import {readContract, writeContract, waitForTransactionReceipt} from "@wagmi/core";
import env from "~/env";
import useUserStore from "~/stores/client/user";

import lendingPoolAbi from "~/consts/abis/LendingPool.json";
// Use the actual Uniswap V4 PoolManager ABI
import erc20Abi from "~/consts/abis/MockERC20.json";
import {Web3Exception} from "~/consts/exceptions";
import {config} from "~/providers/WalletContextProvider";
import {reopenToastLoading, toastDismiss, toastLoading} from "~/utils/toast";
import {getGloopStakersYieldFactor, getReserveFactorMantissa} from "./core";
import {createBigNumber} from "~/utils/math";
import {parseEther} from "viem"; // Import parseEther

const approve = async (amount, token) => {
  let toastId = toastLoading("Please Approve");

  try {
    const approvalHash = await writeContract(config, {
      abi: erc20Abi.abi,
      address: token.address,
      functionName: "approve",
      args: [env.LENDING_POOL_ADDRESS, amount]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Approve Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: approvalHash});
    toastDismiss(toastId);

    return {hash: approvalHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Approve Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {amount, token, error},
      {sendToast: true}
    );
  }
};

const checkAllowance = async (
  userWalletAddress,
  token,
  spenderAddress = env.LENDING_POOL_ADDRESS
) => {
  try {
    return await readContract(config, {
      abi: erc20Abi.abi,
      address: token.address,
      functionName: "allowance",
      args: [userWalletAddress, spenderAddress]
    });
  } catch (error) {
    throw new Web3Exception(
      `Checking Allowance Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {userWalletAddress, spenderAddress, token, error},
      {sendToast: true}
    );
  }
};

const isAssetEnabled = async (assetAddress) => {
  try {
    const walletAddress = useUserStore.getState().walletAddress;
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "enabledCollateral",
      args: [walletAddress, assetAddress]
    });
  } catch (error) {
    console.log(error);
    throw new Web3Exception(
      `Checking if asset is enabled failed: ${error.shortMessage || "Unknown Reason!"}`,
      {
        assetAddress,
        error
      }
    );
  }
};

const deposit = async (amount, token) => {
  let toastId = toastLoading("Please Sign Deposit Transaction");
  const walletAddress = useUserStore.getState().walletAddress;

  try {
    // First check if we need to approve
    const allowance = await checkAllowance(walletAddress, token);
    if (allowance < amount) {
      // Need to approve first
      await approve(amount, token);
    }

    const depositHash = await writeContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "deposit",
      args: [token.address, amount]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Deposit Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: depositHash});
    toastDismiss(toastId);

    return {hash: depositHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    console.log(error);
    throw new Web3Exception(
      `Deposit Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {amount, token, error},
      {sendToast: true}
    );
  }
};

const getSupplyAPY = async (token, rawBorrowRate) => {
  try {
    const reserveFactor = await getReserveFactorMantissa();
    const gloopStakersYieldFactor = await getGloopStakersYieldFactor();
    const oneE18 = createBigNumber(parseEther("1"));

    // Calculate the factor to subtract: (gloopStakersYieldFactor + reserveFactor) / 1e18
    const reductionFactor = createBigNumber(gloopStakersYieldFactor.toString())
      .plus(reserveFactor.toString())
      .div(oneE18);

    // Calculate the multiplier: 1 - reductionFactor = (1e18 - (gloopStakersYieldFactor + reserveFactor)) / 1e18
    const multiplier = createBigNumber(1).minus(reductionFactor);

    // Calculate raw supply rate: rawBorrowRate * multiplier
    // Note: rawBorrowRate is already a BigInt/BigNumber from getBorrowTokenAPY
    const rawSupplyRate = createBigNumber(rawBorrowRate.toString()).mul(multiplier);

    // Convert raw supply rate to APY percentage string
    // 365.25 * 24 * 60 * 60 = 31557600 (seconds per year)
    const secondsPerYear = createBigNumber("31557600");
    const supplyApy = rawSupplyRate
      .mul(secondsPerYear)
      // Convert rate to yearly decimal
      .div(oneE18)
      // Convert to percentage
      .mul(100)
      // Format to 2 decimal places
      .toFixed(2);
    return supplyApy; // Return the calculated APY string
  } catch (error) {
    throw new Web3Exception(`Getting ${token.name} Supply APY Failed`, {token, error});
  }
};

const withdraw = async (amount, token) => {
  let toastId = toastLoading("Please Sign Withdraw Transaction");

  try {
    const withdrawHash = await writeContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "withdraw",
      args: [token.address, amount]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Withdraw Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: withdrawHash});
    toastDismiss(toastId);

    return {hash: withdrawHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Withdraw Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {amount, token, error},
      {sendToast: true}
    );
  }
};

const fetchTotalUnderlying = async (assetAddress) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "totalUnderlying",
      args: [assetAddress]
    });
  } catch (error) {
    throw new Web3Exception(`Getting Total Underlying for ${assetAddress} Failed`, {
      assetAddress,
      error
    });
  }
};

const fetchTotalBorrows = async (assetAddress) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "totalBorrows",
      args: [assetAddress]
    });
  } catch (error) {
    throw new Web3Exception(`Getting Total Borrows for ${assetAddress} Failed`, {
      assetAddress,
      error
    });
  }
};

const getGloopGMIUniswapV3PoolState = async () => {
  try {
    // Uniswap V3 Pool address for GLOOP/GMI on Arbitrum
    const GLOOP_GMI_V3_POOL_ADDRESS = "0x84ef1190ba2be3fadded470642520b7f8948aded";

    // Import Uniswap V3 Pool ABI
    const UniswapV3PoolAbi = await import("~/consts/abis/UniswapV3Pool.json");

    // Call slot0 directly on the V3 pool
    const slot0Data = await readContract(config, {
      abi: UniswapV3PoolAbi.default,
      address: GLOOP_GMI_V3_POOL_ADDRESS,
      functionName: "slot0"
    });

    if (!slot0Data || !Array.isArray(slot0Data)) {
      console.log("No GLOOP/GMI V3 pool data found");
      return null;
    }

    // Uniswap V3 slot0 returns: [sqrtPriceX96, tick, observationIndex, observationCardinality, observationCardinalityNext, feeProtocol, unlocked]
    const [sqrtPriceX96, tick, , , , feeProtocol] = slot0Data;

    // Validate that we got reasonable data
    if (!sqrtPriceX96 || sqrtPriceX96 === 0n) {
      console.log("Invalid sqrtPriceX96 (zero), GLOOP/GMI V3 pool might not be initialized");
      return null;
    }

    console.log("GLOOP/GMI V3 pool state - sqrtPriceX96:", sqrtPriceX96.toString(), "tick:", tick);

    // Return in a compatible format: [sqrtPriceX96, tick, feeProtocol, 0]
    // The last parameter (lpFee) doesn't exist in V3 in the same way, so we pass 0
    return [sqrtPriceX96, tick, feeProtocol, 0];
  } catch (error) {
    console.error("Failed to fetch GLOOP/GMI Uniswap V3 pool state:", error);
    return null;
  }
};

export {
  approve,
  checkAllowance,
  deposit,
  getSupplyAPY,
  withdraw,
  fetchTotalUnderlying,
  fetchTotalBorrows,
  getGloopGMIUniswapV3PoolState,
  getGloopGMIUniswapV3PoolState as getGloopGMIGlobalState // Alias for backward compatibility
};

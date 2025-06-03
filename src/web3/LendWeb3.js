import {readContract, writeContract, waitForTransactionReceipt} from "@wagmi/core";
import env from "~/env";
import useUserStore from "~/stores/client/user";

import lendingPoolAbi from "~/consts/abis/LendingPool.json";
// Use the actual Uniswap V4 PoolManager ABI
import UniswapV4PoolManagerAbi from "~/consts/abis/UniswapV4PoolManager.json";
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
    throw new Web3Exception(`Checking if asset is enabled failed: ${error.shortMessage || "Unknown Reason!"}`, {
      assetAddress,
      error
    });
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

const getGloopGMIUniswapV4PoolState = async () => {
  try {
    // Uniswap V4 PoolManager address on Arbitrum
    const UNISWAP_V4_POOL_MANAGER_ADDRESS = "0x360E68faCcca8cA495c1B759Fd9EEe466db9FB32";
    
    const GLOOP_GMI_POOL_ID = "0x2a147981944315dbb1a2c20a66ed05b6ba29c848d32866739d2124a044c879e7";
    
    // StateLibrary constants from the documentation
    const POOLS_SLOT = 6; // uint256(6)
    
    // Calculate the storage slot for pools[poolId].slot0
    // This follows the Solidity storage layout: keccak256(abi.encode(poolId, POOLS_SLOT))
    const { keccak256, encodeAbiParameters } = await import('viem');
    
    const poolStateSlot = keccak256(
      encodeAbiParameters(
        [{ name: 'poolId', type: 'bytes32' }, { name: 'slot', type: 'uint256' }],
        [GLOOP_GMI_POOL_ID, POOLS_SLOT]
      )
    );
    
    console.log("Calculated GLOOP/GMI pool state slot:", poolStateSlot);
    
    // Use extsload to read the slot0 data
    const slot0Data = await readContract(config, {
      abi: UniswapV4PoolManagerAbi.abi,
      address: UNISWAP_V4_POOL_MANAGER_ADDRESS,
      functionName: "extsload",
      args: [poolStateSlot]
    });
    
    
    if (!slot0Data || slot0Data === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      console.log("No GLOOP/GMI pool data found in slot0");
      return null;
    }
    
    // Decode the packed slot0 data
    // In Uniswap V4, slot0 contains packed data that needs proper extraction
    // eslint-disable-next-line no-undef
    const slot0BigInt = BigInt(slot0Data);
    
    // Extract sqrtPriceX96 (160 bits, rightmost)
    const sqrtPriceX96 = slot0BigInt & ((1n << 160n) - 1n);
    
    // Extract tick (24 bits, signed)
    const tickRaw = (slot0BigInt >> 160n) & ((1n << 24n) - 1n);
    // Convert to signed 24-bit integer
    const tick = tickRaw >= (1n << 23n) ? Number(tickRaw - (1n << 24n)) : Number(tickRaw);
    
    // Extract protocolFee (24 bits)
    const protocolFee = Number((slot0BigInt >> 184n) & ((1n << 24n) - 1n));
    
    // Extract lpFee (24 bits)
    const lpFee = Number((slot0BigInt >> 208n) & ((1n << 24n) - 1n));
    
    
    // Validate that we got reasonable data
    if (sqrtPriceX96 === 0n) {
      console.log("Invalid sqrtPriceX96 (zero), GLOOP/GMI pool might not be initialized");
      return null;
    }
    
    // Return in the same format as the original getSlot0 would
    return [sqrtPriceX96, tick, protocolFee, lpFee];
    
  } catch (error) {
    console.error("Failed to fetch GLOOP/GMI Uniswap V4 pool state:", error);
    return null;
  }
};

const getGMIUSDCUniswapV4PoolState = async () => {
  try {
    // Uniswap V4 PoolManager address on Arbitrum
    const UNISWAP_V4_POOL_MANAGER_ADDRESS = "0x360E68faCcca8cA495c1B759Fd9EEe466db9FB32";
    
    const GMI_USDC_POOL_ID = "0xdc56b8b81ba09dc1476233e707b727c515b3489e1e8ca51e264896df23347de1";
    
    // StateLibrary constants from the documentation
    const POOLS_SLOT = 6; // uint256(6)
    
    // Calculate the storage slot for pools[poolId].slot0
    const { keccak256, encodeAbiParameters } = await import('viem');
    
    const poolStateSlot = keccak256(
      encodeAbiParameters(
        [{ name: 'poolId', type: 'bytes32' }, { name: 'slot', type: 'uint256' }],
        [GMI_USDC_POOL_ID, POOLS_SLOT]
      )
    );
    
    
    // Use extsload to read the slot0 data
    const slot0Data = await readContract(config, {
      abi: UniswapV4PoolManagerAbi.abi,
      address: UNISWAP_V4_POOL_MANAGER_ADDRESS,
      functionName: "extsload",
      args: [poolStateSlot]
    });
    
    
    if (!slot0Data || slot0Data === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      console.log("No GMI/USDC pool data found in slot0");
      return null;
    }
    
    // Decode the packed slot0 data
    // eslint-disable-next-line no-undef
    const slot0BigInt = BigInt(slot0Data);
    
    // Extract sqrtPriceX96 (160 bits, rightmost)
    const sqrtPriceX96 = slot0BigInt & ((1n << 160n) - 1n);
    
    // Extract tick (24 bits, signed)
    const tickRaw = (slot0BigInt >> 160n) & ((1n << 24n) - 1n);
    const tick = tickRaw >= (1n << 23n) ? Number(tickRaw - (1n << 24n)) : Number(tickRaw);
    
    // Extract protocolFee (24 bits)
    const protocolFee = Number((slot0BigInt >> 184n) & ((1n << 24n) - 1n));
    
    // Extract lpFee (24 bits)
    const lpFee = Number((slot0BigInt >> 208n) & ((1n << 24n) - 1n));
    
    
    // Validate that we got reasonable data
    if (sqrtPriceX96 === 0n) {
      console.log("Invalid sqrtPriceX96 (zero), GMI/USDC pool might not be initialized");
      return null;
    }
    
    // Return in the same format as the original getSlot0 would
    return [sqrtPriceX96, tick, protocolFee, lpFee];
    
  } catch (error) {
    console.error("Failed to fetch GMI/USDC Uniswap V4 pool state:", error);
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
  getGloopGMIUniswapV4PoolState,
  getGMIUSDCUniswapV4PoolState,
  getGloopGMIUniswapV4PoolState as getGloopGMIGlobalState // Alias for backward compatibility
};

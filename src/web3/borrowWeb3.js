import {readContract, writeContract, waitForTransactionReceipt} from "@wagmi/core";

import {config} from "~/providers/WalletContextProvider";
import {Web3Exception} from "~/consts/exceptions";
import env from "~/env";

import lendingPoolAbi from "~/consts/abis/LendingPool.json";
import GMInterestRateModel from "~/consts/abis/GMInterestRateModel.json";

// images
import {reopenToastLoading, toastDismiss, toastLoading} from "~/utils/toast";
import {createBigNumber} from "~/utils/math";
import {ContractFunctionExecutionError, parseEther, parseUnits} from "viem";

const getTokenTotalBorrow = async (token) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "getInternalCachedTotalBorrows", // totalBorrows
      args: [token.address]
    });
  } catch (error) {
    throw new Web3Exception(`Getting ${token.name} Total Borrows Failed`, {token, error});
  }
};

const getUserBorrowBalance = async (token, userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "borrowBalance",
      args: [token.address, userWalletAddress]
    });
  } catch (error) {
    throw new Web3Exception(`Getting User Borrows Balance of ${token.name} Failed`, {
      token,
      userWalletAddress,
      error
    });
  }
};

const getUserCollaterals = async (userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "getCollateral",
      args: [userWalletAddress]
    });
  } catch (error) {
    throw new Web3Exception(`Getting Total Collateral Failed`, {userWalletAddress, error});
  }
};

const getUserCollateralValue = async (userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "getUserCollateralValue",
      args: [userWalletAddress]
    });
  } catch (error) {
    throw new Web3Exception(`Getting User Total Collateral Value Failed`, {
      userWalletAddress,
      error
    });
  }
};

const getCollateralEnabledStatus = async (token, userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "enabledCollateral",
      args: [userWalletAddress, token.address]
    });
  } catch (error) {
    throw new Web3Exception(`Getting ${token.name} Collateral Status Failed`, {
      token,
      userWalletAddress,
      error
    });
  }
};

const disableCollateral = async (token) => {
  if (!token.collateral) return;

  let toastId = toastLoading("Please Sign Disable Collateral Transaction");

  try {
    const disableHash = await writeContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "disableAsset",
      args: [token.address]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Disable Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: disableHash});
    toastDismiss(toastId);

    return {hash: disableHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Disabling ${token.name} Collateral Failed: ${error.shortMessage}`,
      {token, error},
      {sendToast: true}
    );
  }
};

const enableCollateral = async (token) => {
  if (!token.collateral) return;

  let toastId = toastLoading("Please Sign Enable Collateral Transaction");

  try {
    const enableHash = await writeContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "enableAsset",
      args: [token.address]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Enable Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: enableHash});
    toastDismiss(toastId);

    return {hash: enableHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Enabling ${token.name} Collateral Failed: ${error.shortMessage}`,
      {token, error},
      {sendToast: true}
    );
  }
};

const getBorrowTokenAPY = async (token) => {
  try {
    const totalBorrows = parseUnits(token.totalBorrows, token.decimals);
    const availableLiquidity = parseUnits(token.availableLiquidity, token.decimals);

    // Fetch the raw borrow rate per second/block
    const rawBorrowRate = await readContract(config, {
      abi: GMInterestRateModel.abi,
      address: env.GM_INTERESTRATE_ADDRESS,
      functionName: "getBorrowRate",
      args: [availableLiquidity, totalBorrows]
    });

    const oneE18 = createBigNumber(parseEther("1"));
    // 365.25 * 24 * 60 * 60 = 31557600 (seconds per year)
    const secondsPerYear = createBigNumber("31557600");

    // Calculate APY percentage string
    const borrowApy = createBigNumber(rawBorrowRate.toString())
      .mul(secondsPerYear)
      // Convert rate to yearly decimal
      .div(oneE18)
      // Convert to percentage
      .mul(100)
      // Format to 2 decimal places
      .toFixed(2);

    // Return both the raw rate and the calculated APY string
    return {rawRate: rawBorrowRate, apy: borrowApy};
  } catch (error) {
    throw new Web3Exception(`Getting ${token.name} Borrow APY Failed`, {token, error});
  }
};

const getMaxBorrowableValue = async (walletAddress) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "maxBorrowableValue",
      args: [walletAddress]
    });
  } catch (error) {
    throw new Web3Exception(
      `Failed To Get Max BorrowableValue`,
      {error, walletAddress},
      {sendToast: true}
    );
  }
};

const borrow = async (amount, token) => {
  let toastId = toastLoading("Please Sign Borrow Transaction");

  try {
    const brrowHash = await writeContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "borrow",
      args: [token.address, amount]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Borrow Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: brrowHash});
    toastDismiss(toastId);

    return {hash: brrowHash, receipt};
  } catch (error) {
    let reason = `${error.shortMessage || "Uknown Reason!"}`;

    // When user is trying to borrow more than pool liquidity
    if (
      error instanceof ContractFunctionExecutionError &&
      error.shortMessage.includes("0xfe9cceec")
    )
      reason = "Insufficient Liquidity";

    toastDismiss(toastId);
    throw new Web3Exception(`Borrow Failed: ${reason}`, {amount, token, error}, {sendToast: true});
  }
};

const repay = async (amount, token) => {
  let toastId = toastLoading("Please Sign Repay Transaction");

  try {
    const repayHash = await writeContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "repay",
      args: [token.address, amount]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Repay Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: repayHash});
    toastDismiss(toastId);

    return {hash: repayHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Repay Failed: ${error.shortMessage || "Uknown Reason!"}`,
      {amount, token, error},
      {sendToast: true}
    );
  }
};

export {
  getTokenTotalBorrow,
  getMaxBorrowableValue,
  getBorrowTokenAPY, // Keep exporting this name
  getUserCollateralValue,
  getUserCollaterals,
  getUserBorrowBalance,
  borrow,
  repay,
  getCollateralEnabledStatus,
  disableCollateral,
  enableCollateral
};

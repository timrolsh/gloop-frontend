import {readContract, waitForTransactionReceipt, writeContract} from "@wagmi/core";

import env from "~/env";

import lendingPoolAbi from "~/consts/abis/LendingPool.json";
import {Web3Exception} from "~/consts/exceptions";
import {config} from "~/providers/WalletContextProvider";

import {reopenToastLoading, toastDismiss, toastLoading} from "~/utils/toast";

const getIsUserLiquidable = async (borrowedAsset, borrowerAddress) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "userLiquidatable",
      args: [borrowedAsset, borrowerAddress]
    });
  } catch (error) {
    throw new Web3Exception("Getting isUserLiquidable Failed", {
      borrowedAsset,
      borrowerAddress,
      error
    });
  }
};

const liquidate = async (borrowedAssetAddress, repayAmount, borrowerAddress, account) => {
  let toastId = toastLoading("Please Sign Liquidation Transaction");

  try {
    const liquidationHash = await writeContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "liquidateUser",
      args: [borrowedAssetAddress, borrowerAddress, repayAmount],
      account
    });

    toastId = reopenToastLoading(toastId, "Waiting For Liquidation Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: liquidationHash});
    toastDismiss(toastId);

    return {hash: liquidationHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Liquidation Failed: ${error.shortMessage || "Uknown Reason!"}`,
      {borrowedAssetAddress, repayAmount, borrowerAddress, account, error},
      {sendToast: true}
    );
  }
};

const getLiquidationBonus = async () => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "liquidationBonus",
      args: []
    });
  } catch (error) {
    throw new Web3Exception("Getting Liquidation Bonus Failed", {error});
  }
};

export {getIsUserLiquidable, liquidate, getLiquidationBonus};

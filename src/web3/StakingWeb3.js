import {readContract, writeContract, waitForTransactionReceipt} from "@wagmi/core";

import {config} from "~/providers/WalletContextProvider";
import {Web3Exception} from "~/consts/exceptions";
import env from "~/env";

// abis
import GloopStakingAbi from "~/consts/abis/GloopStaking.json";
import erc20Abi from "~/consts/abis/MockERC20.json";
import {reopenToastLoading, toastDismiss, toastLoading} from "~/utils/toast";

// Lock period constants (in seconds)
export const LOCK_PERIODS = {
  0: 0,
  14: 14 * 24 * 60 * 60, // 14 days in seconds
  28: 28 * 24 * 60 * 60, // 28 days in seconds
  56: 56 * 24 * 60 * 60 // 56 days in seconds
};

/**
 * Get total amount of GLOOP staked across all users
 */
const getTotalStaked = async () => {
  try {
    return await readContract(config, {
      abi: GloopStakingAbi.abi,
      address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
      functionName: "totalStaked",
      args: []
    });
  } catch (error) {
    throw new Web3Exception("Getting Total Staked Failed", {error});
  }
};

/**
 * Get total number of stakers by summing active stakers from all lock periods
 */
const getTotalStakers = async () => {
  try {
    const [lockPeriod0, lockPeriod14, lockPeriod28, lockPeriod56] = await Promise.all([
      readContract(config, {
        abi: GloopStakingAbi.abi,
        address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
        functionName: "lockPeriods",
        args: [LOCK_PERIODS[0]]
      }),
      readContract(config, {
        abi: GloopStakingAbi.abi,
        address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
        functionName: "lockPeriods",
        args: [LOCK_PERIODS[14]]
      }),
      readContract(config, {
        abi: GloopStakingAbi.abi,
        address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
        functionName: "lockPeriods",
        args: [LOCK_PERIODS[28]]
      }),
      readContract(config, {
        abi: GloopStakingAbi.abi,
        address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
        functionName: "lockPeriods",
        args: [LOCK_PERIODS[56]]
      })
    ]);

    // lockPeriods returns [apr, isActive, activeStakers]
    // We want the third element (activeStakers) from each
    const totalStakers = lockPeriod0[2] + lockPeriod14[2] + lockPeriod28[2] + lockPeriod56[2];
    return totalStakers;
  } catch (error) {
    throw new Web3Exception("Getting Total Stakers Failed", {error});
  }
};

/**
 * Get the amount of GLOOP staked by a specific user
 */
const getUserStakedAmount = async (userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: GloopStakingAbi.abi,
      address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
      functionName: "getUserStakedAmount",
      args: [userWalletAddress]
    });
  } catch (error) {
    throw new Web3Exception("Getting User Staked Amount Failed", {userWalletAddress, error});
  }
};

/**
 * Get user's staking position details
 */
const getUserStakingPosition = async (userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: GloopStakingAbi.abi,
      address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
      functionName: "stakers",
      args: [userWalletAddress]
    });
  } catch (error) {
    throw new Web3Exception("Getting User Staking Position Failed", {userWalletAddress, error});
  }
};

/**
 * Get user's claimable rewards
 */
const getClaimableRewards = async (userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: GloopStakingAbi.abi,
      address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
      functionName: "getClaimableRewards",
      args: [userWalletAddress]
    });
  } catch (error) {
    throw new Web3Exception("Getting Claimable Rewards Failed", {userWalletAddress, error});
  }
};

/**
 * Get user's total rewards earned
 */
const getUserRewards = async (userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: GloopStakingAbi.abi,
      address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
      functionName: "getUserRewards",
      args: [userWalletAddress]
    });
  } catch (error) {
    throw new Web3Exception("Getting User Rewards Failed", {userWalletAddress, error});
  }
};

/**
 * Get lock period information
 */
const getLockPeriodInfo = async (lockPeriodSeconds) => {
  try {
    return await readContract(config, {
      abi: GloopStakingAbi.abi,
      address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
      functionName: "lockPeriods",
      args: [lockPeriodSeconds]
    });
  } catch (error) {
    throw new Web3Exception("Getting Lock Period Info Failed", {lockPeriodSeconds, error});
  }
};

/**
 * Get user's GLOOP token balance
 */
const getGloopBalance = async (userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: erc20Abi.abi,
      address: env.GLOOP_TOKEN_ADDRESS,
      functionName: "balanceOf",
      args: [userWalletAddress]
    });
  } catch (error) {
    throw new Web3Exception("Getting GLOOP Balance Failed", {userWalletAddress, error});
  }
};

/**
 * Check GLOOP token allowance for staking contract
 */
const checkGloopAllowance = async (userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: erc20Abi.abi,
      address: env.GLOOP_TOKEN_ADDRESS,
      functionName: "allowance",
      args: [userWalletAddress, env.GLOOP_STAKING_CONTRACT_ADDRESS]
    });
  } catch (error) {
    throw new Web3Exception("Getting GLOOP Allowance Failed", {userWalletAddress, error});
  }
};

/**
 * Approve GLOOP tokens for staking
 */
const approveGloop = async (amount) => {
  let toastId = toastLoading("Please Approve GLOOP");

  try {
    const approvalHash = await writeContract(config, {
      abi: erc20Abi.abi,
      address: env.GLOOP_TOKEN_ADDRESS,
      functionName: "approve",
      args: [env.GLOOP_STAKING_CONTRACT_ADDRESS, amount]
    });

    toastId = reopenToastLoading(toastId, "Waiting For GLOOP Approval Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: approvalHash});
    toastDismiss(toastId);

    return {hash: approvalHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `GLOOP Approval Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {amount, error},
      {sendToast: true}
    );
  }
};

/**
 * Stake GLOOP tokens with a specified lock period
 */
const stakeGloop = async (amount, lockPeriodDays) => {
  let toastId = toastLoading("Please Sign Staking Transaction");

  try {
    const lockPeriodSeconds = LOCK_PERIODS[lockPeriodDays];
    if (LOCK_PERIODS[lockPeriodDays] === undefined) {
      throw new Error(`Invalid lock period: ${lockPeriodDays} days`);
    }

    const stakeHash = await writeContract(config, {
      abi: GloopStakingAbi.abi,
      address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
      functionName: "stake",
      args: [amount, lockPeriodSeconds]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Staking Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: stakeHash});
    toastDismiss(toastId);

    return {hash: stakeHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Staking Failed: ${error.shortMessage || "Unknown Reason!"}, amount: ${amount}, lockPeriodDays: ${lockPeriodDays}, error: ${error}`,
      {amount, lockPeriodDays, error},
      {sendToast: true}
    );
  }
};

/**
 * Unstake GLOOP tokens
 */
const unstakeGloop = async (amount) => {
  let toastId = toastLoading("Please Sign Unstaking Transaction");

  try {
    const unstakeHash = await writeContract(config, {
      abi: GloopStakingAbi.abi,
      address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
      functionName: "unstake",
      args: [amount]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Unstaking Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: unstakeHash});
    toastDismiss(toastId);

    return {hash: unstakeHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Unstaking Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {amount, error},
      {sendToast: true}
    );
  }
};

/**
 * Claim staking rewards
 */
const claimRewards = async () => {
  let toastId = toastLoading("Please Sign Claim Transaction");

  try {
    const claimHash = await writeContract(config, {
      abi: GloopStakingAbi.abi,
      address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
      functionName: "claimRewards",
      args: []
    });

    toastId = reopenToastLoading(toastId, "Waiting For Claim Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: claimHash});
    toastDismiss(toastId);

    return {hash: claimHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Claiming Rewards Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {error},
      {sendToast: true}
    );
  }
};

/**
 * Partially claim specific amounts of rewards
 */
const partialClaimRewards = async (gloopRewards, usdcRewards) => {
  let toastId = toastLoading("Please Sign Partial Claim Transaction");

  try {
    const claimHash = await writeContract(config, {
      abi: GloopStakingAbi.abi,
      address: env.GLOOP_STAKING_CONTRACT_ADDRESS,
      functionName: "partialClaimRewards",
      args: [gloopRewards, usdcRewards]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Partial Claim Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: claimHash});
    toastDismiss(toastId);

    return {hash: claimHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Partial Claiming Rewards Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {gloopRewards, usdcRewards, error},
      {sendToast: true}
    );
  }
};

export {
  getTotalStaked,
  getTotalStakers,
  getUserStakedAmount,
  getUserStakingPosition,
  getClaimableRewards,
  getUserRewards,
  getLockPeriodInfo,
  getGloopBalance,
  checkGloopAllowance,
  approveGloop,
  stakeGloop,
  unstakeGloop,
  claimRewards,
  partialClaimRewards
};

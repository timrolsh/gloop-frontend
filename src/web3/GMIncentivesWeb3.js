import { readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core"

import env from "~/env"
import useUserStore from "~/stores/client/user"
import { Web3Exception } from "~/consts/exceptions"
import { config } from "~/providers/WalletContextProvider"
import gmIncentivesAbi from "~/consts/abis/GMIncentives.json"
import OraclePriceFeed from "~/consts/abis/OraclePriceFeed.json"
import { reopenToastLoading, toastDismiss, toastLoading } from '~/utils/toast'

export const getAllUserRewards = async (userWalletAddress) => {


  try {
    return await readContract(config, {
      abi: gmIncentivesAbi.abi,
      address: env.GM_INCENTIVES_CONTRACT_ADDRESS,
      functionName: "getAllUserRewards",
      args: [userWalletAddress],
    })

    // returns address[] memory rewardsList, uint256[] memory unclaimedAmounts, uint256[] memory pendingAmounts
  } catch (error) {
    throw new Web3Exception(`Getting All User Rewards Failed: ${error.shortMessage || 'Unknown Reason!'}`, { userWalletAddress, error })
  }
}

export const getRewardsData = async (
  rewardAddress,
) => {
  try {
    return await readContract(config, {
      abi: gmIncentivesAbi.abi,
      address: env.GM_INCENTIVES_CONTRACT_ADDRESS,
      functionName: "getRewardsData",
      args: [rewardAddress],
    })
  } catch (error) {
    throw new Web3Exception(`Getting Reward Data Failed: ${error.shortMessage || 'Unknown Reason!'}`, { rewardAddress, error })
  }
}

export const getOraclePriceFeed = async (tokenAddress) => {
  try {
    return await readContract(config, {
      abi: OraclePriceFeed.abi,
      address: tokenAddress,
      functionName: "latestAnswer",
      args: [],
    })
  } catch (error) {
    throw new Web3Exception(`Getting Oracle Price Feed Data Failed: ${error.shortMessage || 'Unknown Reason!'}`, { tokenAddress, error })
  }
}

export const getOraclePriceDecimals = async (tokenAddress) => {
  try {
    return await readContract(config, {
      abi: OraclePriceFeed.abi,
      address: tokenAddress,
      functionName: "decimals",
      args: [],
    })
  } catch (error) {
    throw new Web3Exception(`Getting Oracle Decimals Failed: ${error.shortMessage || 'Unknown Reason!'}`, { tokenAddress, error })
  }
}

export const claimRewards = async () => {

  let toastId = toastLoading('Please Sign Claim Transaction')

  try {
    const claimHash = await writeContract(config, {
      abi: gmIncentivesAbi.abi,
      address: env.GM_INCENTIVES_CONTRACT_ADDRESS,
      functionName: "claimRewards",
    })

    toastId = reopenToastLoading(toastId, 'Waiting For Claim Transaction Confirmation...')
    const receipt = await waitForTransactionReceipt(config, { hash: claimHash })
    toastDismiss(toastId)

    return receipt
  } catch (error) {
    toastDismiss(toastId)
    throw new Web3Exception(`Claiming Rewards Failed: ${error.shortMessage || 'Uknown Reason!'}`, { error }, { sendToast: true })
  }
}
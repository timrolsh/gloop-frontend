import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core'

import env from '~/env'

import lendingPoolAbi from '~/consts/abis/LendingPool.json'
import GloopGmiCamelotAbi from '~/consts/abis/GloopGmiCamelot.json'
import erc20Abi from '~/consts/abis/MockERC20.json'
import GMInterestRateModel from '~/consts/abis/GMInterestRateModel.json'
import { Web3Exception } from '~/consts/exceptions'
import { config } from '~/providers/WalletContextProvider'
import { reopenToastLoading, toastDismiss, toastLoading } from '~/utils/toast'
import { getBorrowTokenAPY, getTokenTotalBorrow } from './borrowWeb3'
import { getGloopStakersYieldFactor, getReserveFactorMantissa } from './core'
import { formatEther, parseEther } from 'viem'
import { createBigNumber } from '~/utils/math'

const approve = async (amount, token) => {

  let toastId = toastLoading('Please Approve')

  try {

    const approvalHash = await writeContract(config, {
      abi: erc20Abi.abi,
      address: token.address,
      functionName: 'approve',
      args: [env.LENDING_POOL_ADDRESS, amount],
    })

    toastId = reopenToastLoading(toastId, 'Waiting For Approve Transaction Confirmation...')
    const receipt = await waitForTransactionReceipt(config, { hash: approvalHash })
    toastDismiss(toastId)

    return { hash: approvalHash, receipt }

  } catch (error) {
    toastDismiss(toastId)
    throw new Web3Exception(`Approve Failed: ${error.shortMessage || 'Unknown Reason!'}`, { amount, token, error }, { sendToast: true })
  }
}

const checkAllowance = async (userWalletAddress, token, spenderAddress = env.LENDING_POOL_ADDRESS) => {

  try {
    return await readContract(config, {
      abi: erc20Abi.abi,
      address: token.address,
      functionName: 'allowance',
      args: [userWalletAddress, spenderAddress],
    })

  } catch (error) {
    throw new Web3Exception(`Checking Allowance Failed: ${error.shortMessage || 'Unknown Reason!'}`, { userWalletAddress, spenderAddress, token, error }, { sendToast: true })
  }
}

const deposit = async (amount, token) => {

  let toastId = toastLoading('Please Sign Deposit Transaction')

  try {

    const depositHash = await writeContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: 'deposit',
      args: [token.address, amount],
    })

    toastId = reopenToastLoading(toastId, 'Waiting For Deposit Transaction Confirmation...')
    const receipt = await waitForTransactionReceipt(config, { hash: depositHash })
    toastDismiss(toastId)

    return { hash: depositHash, receipt }

  } catch (error) {
    toastDismiss(toastId)
    throw new Web3Exception(`Deposit Failed: ${error.shortMessage || 'Unknown Reason!'}`, { amount, token, error }, { sendToast: true })
  }
}

const getSupplyAPY = async (token) => {

  try {
    const reserveFactor = await getReserveFactorMantissa()
    const gloopStakersYieldFactor = await getGloopStakersYieldFactor()
    const borrowApy = await getBorrowTokenAPY(token)

    return createBigNumber(borrowApy).mul(createBigNumber('1e18').minus((gloopStakersYieldFactor).toString()).plus(reserveFactor.toString())).toString()


  } catch (error) {
    throw new Web3Exception(`Getting ${token.name} Supply APY Failed`, { token, error })
  }
}

const withdraw = async (amount, token) => {

  let toastId = toastLoading('Please Sign Withdraw Transaction')

  try {

    const withdrawHash = await writeContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: 'withdraw',
      args: [token.address, amount],
    })

    toastId = reopenToastLoading(toastId, 'Waiting For Withdraw Transaction Confirmation...')
    const receipt = await waitForTransactionReceipt(config, { hash: withdrawHash })
    toastDismiss(toastId)

    return { hash: withdrawHash, receipt }

  } catch (error) {
    toastDismiss(toastId)
    throw new Web3Exception(`Withdraw Failed: ${error.shortMessage || 'Unknown Reason!'}`, { amount, token, error }, { sendToast: true })
  }
}


const fetchTotalUnderlying = async (assetAddress) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "totalUnderlying",
      args: [assetAddress],
    })
  } catch (error) {
    throw new Web3Exception(`Getting Total Underlying for ${assetAddress} Failed`, {
      assetAddress,
      error,
    })
  }
}

const getGloopGMIGlobalState = async () => {
  try {
    return await readContract(config, {
      abi: GloopGmiCamelotAbi.abi,
      address: "0xA28D1BCc771c132020c18CC733f0E444C2FD7b5B",
      functionName: "globalState",
      args: [],
    })
  } catch (error) {
    console.log(error)
    // throw new Web3Exception(`Getting Total Underlying for ${assetAddress} Failed`, {
    //   assetAddress,
    //   error,
    // })
  }
}

export {
  approve,
  checkAllowance,
  deposit,
  getSupplyAPY,
  withdraw,
  fetchTotalUnderlying,
  getGloopGMIGlobalState
}
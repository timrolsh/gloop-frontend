import { useMutation, useQueryClient } from '@tanstack/react-query'
import { encodeFunctionData, formatEther, parseEther } from 'viem'

import { queries } from '~/consts/queries'
import { GMX_DEPOSIT_VAULT_ADDRESS, GMX_SYNTHETICS_ROUTER_ADDRESS, ZAP_ADDRESS } from '~/consts/gmx'
import ExchangeRouter from "~/consts/abis/gmx/ExchangeRouter.json"

import { GMXApprove, GMXDeposit } from '~/web3/GMIWeb3'
import { toastSuccess } from '~/utils/toast'
import { createBigNumber } from '~/utils/math'
// import { getExecutionFee } from '~/web3/GMXExecutionFee'
import useExecutionFee from '~/web3/useExecutionFee'
import { checkAllowance } from '~/web3/LendWeb3'
import useUserStore from '~/stores/client/user'
import env from '~/env'

export const useGMXDeposit = ({ token }) => {

  const queryClient = useQueryClient()
  const executionFee = useExecutionFee()
  const walletAddress = useUserStore(state => state.walletAddress)

  const GMXDepositToken = async ({ amount }) => {

    try {
      // const executionFee = await getExecutionFee()
      // const UI_FEE_RECEIVER_ACCOUNT = "0x46B18d51f271F7E000Aa01316ab23251b502b240"
      // const callbackFee = createBigNumber(formatEther(2000000n).toString()).mul(formatEther(120000000n).toString())
      // const executionFeeMargin = createBigNumber(executionFee).mul(1.3).toFixed(0) // 30% margin
      // const parsedAmount = createBigNumber(amount.toString()).times(1000000).toString()
      // await GMXApprove(token, parsedAmount)

      const UI_FEE_RECEIVER_ACCOUNT = "0xA17199eAe314E918243c92995Ed4C90b60196448"
      const callbackFee = 2000000n
      const executionFeeMargin = executionFee * 13n / 10n
      const value = (executionFeeMargin + callbackFee * 120000000n) || 0n
      const parsedAmount = createBigNumber(amount.toString()).times(1000000).toString()
      const valueHardcoded = 564092925691000n

      console.log('UI_FEE_RECEIVER_ACCOUNT', UI_FEE_RECEIVER_ACCOUNT)
      console.log('executionFeeMargin', executionFeeMargin)
      console.log('actual value', value)
      console.log('valueHardcoded', valueHardcoded)
      console.log('amount', amount)
      console.log('parsedAmount', parsedAmount)

      const allowance = await checkAllowance(walletAddress, { name: 'USDC', address: env.USDC_TOKEN_ADDRESS }, GMX_SYNTHETICS_ROUTER_ADDRESS)
      const toBeApproved = createBigNumber(parsedAmount).minus(allowance)

      if (toBeApproved.gt(0))
        await GMXApprove(parsedAmount)

      let encodedPayload = !!token ? [
        encodeFunctionData({
          abi: ExchangeRouter.abi,
          functionName: "sendWnt",
          args: [
            GMX_DEPOSIT_VAULT_ADDRESS,
            // executionFeeMargin,
            valueHardcoded,
          ],
        }),
        encodeFunctionData({
          abi: ExchangeRouter.abi,
          functionName: "sendTokens",
          args: [
            token?.name == "USDC-USDT" ? token?.initialLongToken : token?.initialShortToken,
            GMX_DEPOSIT_VAULT_ADDRESS,
            parsedAmount,
          ],
        }),
        encodeFunctionData({
          abi: ExchangeRouter.abi,
          functionName: "createDeposit",
          args: [
            [
              ZAP_ADDRESS,
              ZAP_ADDRESS, // callback
              UI_FEE_RECEIVER_ACCOUNT,
              token?.market,
              token?.initialLongToken,
              token?.initialShortToken,
              [],
              [],
              1n,
              false,
              executionFeeMargin,
              callbackFee,
              // 0n,
            ]
          ],
          //     args: [
          //         {
          //             receiver: ZAP_ADDRESS,
          //             callbackContract: "0x0000000000000000000000000000000000000000",
          //             token: token?.market,
          //             initialLongToken: token?.initialLongToken,
          //             initialShortToken: token?.initialShortToken,
          //             longTokenSwapPath: [],
          //             shortTokenSwapPath: [],
          //             mintokenTokens: 1n,
          //             shouldUnwrapNativeToken: false,
          //             executionFee,
          //             callbackGasLimit: 100000000000n,
          //             uiFeeReceiver: "0x0000000000000000000000000000000000000000",
          //         },                
          //     ],
        }),
      ]
        : []

      await GMXDeposit(token, parsedAmount, encodedPayload, valueHardcoded)

    } catch (error) {
      // Errors are handled in web3 js codes
      throw error
    }
  }

  return useMutation({
    mutationFn: GMXDepositToken,
    onSuccess: async () => {

      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries()

      // enforcing refetch becuase unlike other queries token list might have indirect references that won't be updated by invalidating the staleTime of cache
      queryClient.refetchQueries({ queryKey: [queries.GET_TOKENS_LIST] })


      toastSuccess(`Deposit Transaction Confirmed!`)
    },
  })

}

export default useGMXDeposit
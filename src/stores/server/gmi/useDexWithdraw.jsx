import { useMutation, useQueryClient } from '@tanstack/react-query'
import { parseUnits } from 'viem'

import { queries } from '~/consts/queries'

import { toastSuccess } from '~/utils/toast'
import { dexWithdraw } from '~/web3/GMIWeb3'
import useUserStore from '~/stores/client/user'


export const useDexWithdraw = ({ token }) => {

  const queryClient = useQueryClient()
  const walletAddress = useUserStore(state => state.walletAddress)

  const dexWithdrawToken = async ({ amount }) => {

    try {
      const parsedAmount = parseUnits(amount.toString(), token.decimals)
      await dexWithdraw(token, parsedAmount, walletAddress)

    } catch (error) {
      // Errors are handled in web3 js codes
      throw error
    }
  }

  return useMutation({
    mutationFn: dexWithdrawToken,
    onSuccess: async () => {

      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries()

      // enforcing refetch becuase unlike other queries token list might have indirect references that won't be updated by invalidating the staleTime of cache
      queryClient.refetchQueries({ queryKey: [queries.GET_TOKENS_LIST] })


      toastSuccess(`Withdraw Transaction Confirmed!`)
    },
  })

}

export default useDexWithdraw
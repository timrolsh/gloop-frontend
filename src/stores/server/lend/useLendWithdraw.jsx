import { useMutation, useQueryClient } from '@tanstack/react-query'
import { parseUnits } from 'viem'


import { withdraw } from '~/web3/LendWeb3'

import { toastSuccess } from '~/utils/toast'
import { queries } from '~/consts/queries'

export const useLendWithdraw = ({ token }) => {

  const queryClient = useQueryClient()

  const withdrawToken = async (depositAmount) => {

    try {

      const parsedAmount = parseUnits(depositAmount.toString(), token.decimals)

      await withdraw(parsedAmount, token)

    } catch (error) {
      // Errors are handled in web3 js codes
      throw error
    }
  }

  return useMutation({
    mutationFn: withdrawToken,
    onSuccess: () => {

      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries()

      // enforcing refetch becuase unlike other queries token list might have indirect references that won't be updated by invalidating the staleTime of cache
      queryClient.refetchQueries({ queryKey: [queries.GET_TOKENS_LIST] })


      toastSuccess(`Withdraw Transaction Confirmed!`)
    },
  })

}

export default useLendWithdraw
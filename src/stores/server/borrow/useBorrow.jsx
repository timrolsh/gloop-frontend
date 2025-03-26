import { useMutation, useQueryClient } from '@tanstack/react-query'
import { parseUnits } from 'viem'
import { queries } from '~/consts/queries'

import { toastSuccess } from '~/utils/toast'
import { borrow } from '~/web3/borrowWeb3'

export const useBorrow = ({ token }) => {

  const queryClient = useQueryClient()

  const borrowToken = async (borrowAmount) => {

    try {
      const parsedAmount = parseUnits(borrowAmount.toString(), token.decimals)
      return await borrow(parsedAmount, token)
    } catch (error) {
      // Errors are handled in web3 js codes
      throw error
    }
  }

  return useMutation({
    mutationFn: borrowToken,
    onSuccess: () => {

      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries()

      // enforcing refetch becuase unlike other queries token list might have indirect references that won't be updated by invalidating the staleTime of cache
      queryClient.refetchQueries({ queryKey: [queries.GET_TOKENS_LIST] })

      toastSuccess(`Borrow Transaction Confirmed!`)
    },
  })

}

export default useBorrow
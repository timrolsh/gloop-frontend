import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queries } from '~/consts/queries'

import { toastSuccess } from '~/utils/toast'
import { addReferrer } from '~/web3/core'

export const useAddReferrer = () => {

  const queryClient = useQueryClient()

  const addReferral = async (referralWalletAddress) => {
    try {

      await addReferrer(referralWalletAddress)
    } catch (error) {
      // Errors are handled in web3 js codes
      throw error
    }
  }

  return useMutation({
    mutationFn: addReferral,
    onSuccess: () => {

      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries()

      // enforcing refetch becuase unlike other queries token list might have indirect references that won't be updated by invalidating the staleTime of cache
      queryClient.refetchQueries({ queryKey: [queries.GET_TOKENS_LIST] })

      toastSuccess(`Referrer Confirmed`)
    },
  })

}

export default useAddReferrer
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queries } from '~/consts/queries'
import { toastSuccess } from "~/utils/toast"
import { claimRewards } from '~/web3/GMIncentivesWeb3'

export const useClaimRewards = () => {

  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: claimRewards,
    onSuccess: () => {
      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries()

      // enforcing refetch becuase unlike other queries token list might have indirect references that won't be updated by invalidating the staleTime of cache
      queryClient.refetchQueries({ queryKey: [queries.GET_TOKENS_LIST] })

      toastSuccess(`Claim Succeed`)
    },
  })
}

export default useClaimRewards

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { parseUnits } from 'viem'


import { approve, checkAllowance, deposit } from '~/web3/LendWeb3'
import { toastSuccess } from '~/utils/toast'
import { repay } from '~/web3/borrowWeb3'
import { queries } from '~/consts/queries'
import useUserStore from '~/stores/client/user'
import { createBigNumber } from '~/utils/math'

export const useRepayDebt = ({ token }) => {

  const queryClient = useQueryClient()
  const walletAddress = useUserStore((state) => state.walletAddress)

  const repayDebt = async (depositAmount) => {

    try {
      const parsedAmount = parseUnits(depositAmount.toString(), token.decimals) + 1n // to fix EVM 1n transfer dust issue

      const allowance = await checkAllowance(walletAddress, token)
      const toBeApproved = createBigNumber(parsedAmount).minus(allowance)

      if (toBeApproved.gt(0))
        await approve(parsedAmount.toString(), token)

      await repay(parsedAmount, token)

    } catch (error) {
      // Errors are handled in web3 js codes
      throw error
    }
  }

  return useMutation({
    mutationFn: repayDebt,
    onSuccess: () => {

      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries()

      // enforcing refetch becuase unlike other queries token list might have indirect references that won't be updated by invalidating the staleTime of cache
      queryClient.refetchQueries({ queryKey: [queries.GET_TOKENS_LIST] })

      toastSuccess(`Repay Transaction Confirmed!`)
    },
  })

}

export default useRepayDebt
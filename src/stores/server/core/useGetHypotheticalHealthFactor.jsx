import { useQuery } from '@tanstack/react-query'

import { queries } from '~/consts/queries'
import { createBigNumber } from '~/utils/math'
import { useDebounce } from '~/hooks/useDebounce'
import { calculateHFAfterCollChange } from '~/web3/core'
import useUserStore from '~/stores/client/user'
import { formatEther, parseUnits } from 'viem'
import useGetTotalCollateral from '~/stores/server/borrow/useGetTotalCollateral'
import env from '~/env'
import useGetTotalBorrows from '../borrow/useGetTotalBorrows'
import useGetUserCollaterals from '../borrow/useGetUserCollaterals'

const useGetHypotheticalHealthFactor = ({ token, userWalletAddress, collAmount = '0', collIncrease, collateralModal = false, enabled = true }) => {

  const walletAddress = useUserStore(state => state.walletAddress)
  const debouncedcollAmount = useDebounce(collAmount || '0')
  const effectiveWalletAddress = userWalletAddress || walletAddress
  const totalBorrowsQuery = useGetTotalBorrows({})
  const totalCollateralQuery = useGetTotalCollateral({})
  const userCollateralsQuery = useGetUserCollaterals({})

  const getData = async () => {
    if (!effectiveWalletAddress || totalBorrowsQuery.isLoading || totalCollateralQuery.isLoading || userCollateralsQuery.isLoading)
      return env.EMPTY_VALUE


    // If the user is going to disable their only collateral asset (i.e. pool.getCollateral(user) returns an array of length = 1), then new/hypo HF = 0
    // collIncrease in collateralModal mode means disabling asset
    if (!collIncrease && collateralModal && createBigNumber(totalBorrowsQuery.data).lte(0) && userCollateralsQuery.data?.length === 1)
      return '0'

    if (createBigNumber(totalBorrowsQuery.data).lte(0))
      return Infinity

    const parsedCollAmount = parseUnits(debouncedcollAmount.toString(), token.decimals)
    const healthFactor = await calculateHFAfterCollChange(token, effectiveWalletAddress, parsedCollAmount, collIncrease)
    const formattedHF = formatEther(healthFactor)
    return createBigNumber(formattedHF).mul(100).toFixed(0)
  }

  return useQuery({
    queryKey: [
      queries.GET_HYPOTHETICAL_HEALTH_FACTOR,
      token,
      collIncrease,
      collateralModal,
      effectiveWalletAddress,
      debouncedcollAmount,
      totalBorrowsQuery,
      totalCollateralQuery,
      userCollateralsQuery,
    ],
    queryFn: getData,
    enabled: enabled
  })
}

export default useGetHypotheticalHealthFactor
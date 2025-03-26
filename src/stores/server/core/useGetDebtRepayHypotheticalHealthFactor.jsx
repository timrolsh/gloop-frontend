import { useQuery } from '@tanstack/react-query'

import { queries } from '~/consts/queries'
import { createBigNumber } from '~/utils/math'
import { useDebounce } from '~/hooks/useDebounce'
import { calculateHFAfterCollChange } from '~/web3/core'
import useUserStore from '~/stores/client/user'
import { formatEther, formatUnits, parseUnits } from 'viem'
import { useMemo } from 'react'
import env from '~/env'
import useGetTokensList from './useGetTokensList'
import useGetMaxBorrowableValue from '../borrow/useGetMaxBorrowableValue'
import { getUserBorrowBalance } from '~/web3/borrowWeb3'

const useGetDebtRepayHypotheticalHealthFactor = ({ userWalletAddress, amount = '0', enabled = true }) => {

  const walletAddress = useUserStore(state => state.walletAddress)
  const debouncedAmount = useDebounce(amount || '0')
  const effectiveWalletAddress = userWalletAddress || walletAddress

  const maxBorrowAbleValueQuery = useGetMaxBorrowableValue({ userWalletAddress })
  const tokensList = useGetTokensList({})

  const usdcToken = useMemo(() => {
    return (tokensList.data || []).find(x => x.name === 'USDC')
  }, [tokensList.data])

  const getData = async () => {

    if (!usdcToken || usdcToken.price === env.EMPTY_VALUE || maxBorrowAbleValueQuery.isLoading)
      return env.EMPTY_VALUE

    const userBorrows = await getUserBorrowBalance(usdcToken, effectiveWalletAddress)
    const formattedBorrow = formatUnits(userBorrows, usdcToken.decimals).toString()
    const newBorrowValue = createBigNumber(formattedBorrow).minus(debouncedAmount).mul(usdcToken.price)

    if (newBorrowValue.lte(0)) // user is repaying more than debt size
      return Infinity

    const HF = createBigNumber(maxBorrowAbleValueQuery.data).div(newBorrowValue)
    return createBigNumber(HF).mul(100).toFixed(0)
  }

  return useQuery({
    queryKey: [
      queries.GET_DEBT_REPAY_HYPOTHETICAL_HEALTH_FACTOR,
      effectiveWalletAddress,
      debouncedAmount,
      usdcToken,
      maxBorrowAbleValueQuery,
    ],
    queryFn: getData,
    enabled: enabled
  })
}

export default useGetDebtRepayHypotheticalHealthFactor
import { useQuery } from '@tanstack/react-query'
import { queries } from '~/consts/queries'
import env from '~/env'
import { createBigNumber } from '~/utils/math'
import useGetTokensList from '../core/useGetTokensList'

const useGetTotalBorrows = ({ enabled = true }) => {

  const tokensList = useGetTokensList({})

  const getData = async () => {
    let totalBorrowInUSD = createBigNumber(0)

    const borrowableTokens = (tokensList.data || []).filter(x => x.borrowable && x.userBorrows !== env.EMPTY_VALUE)

    for (const token of borrowableTokens) {
      const borrowInUSD = createBigNumber(token.userBorrows).mul(token.price)
      totalBorrowInUSD = totalBorrowInUSD.plus(borrowInUSD)
    }

    return totalBorrowInUSD.toString()
  }

  return useQuery({
    queryKey: [queries.GET_TOTAL_BORROWS, tokensList],
    queryFn: getData,
    enabled: enabled
  })
}

export default useGetTotalBorrows
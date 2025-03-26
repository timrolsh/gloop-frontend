import { useQuery } from '@tanstack/react-query'
import { formatEther as viemFormatEther } from 'viem'

import { queries } from '~/consts/queries'
import { createBigNumber } from '~/utils/math'
import { getReserveFactorMantissa } from '~/web3/core'

const useGetReserveFactorMantissa = ({ enabled = true }) => {

  const getData = async () => {
    const reserveFactor = await getReserveFactorMantissa()
    return viemFormatEther(createBigNumber(reserveFactor || 0).mul(100))
  }

  return useQuery({
    queryKey: [queries.GET_RESERVE_FACTOR_MANTISSA],
    queryFn: getData,
    enabled: enabled
  })
}

export default useGetReserveFactorMantissa
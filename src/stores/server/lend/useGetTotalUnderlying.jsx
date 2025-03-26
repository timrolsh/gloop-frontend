import { useQuery } from '@tanstack/react-query'
import { formatUnits } from 'ethers'

import { queries } from '~/consts/queries'
import { fetchTotalUnderlying } from '~/web3/LendWeb3'

const useGetTotalUnderlying = ({ token, enabled = true }) => {

  const getData = async () => {

    const result = await fetchTotalUnderlying(token.address)
    return formatUnits(result, token.decimals)
  }

  return useQuery({
    queryKey: [queries.GET_TOTAL_UNDERLYING, token],
    queryFn: getData,
    enabled: enabled
  })
}

export default useGetTotalUnderlying
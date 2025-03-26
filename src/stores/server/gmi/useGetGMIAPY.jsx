import { queries } from '~/consts/queries'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useBlockNumber } from 'wagmi'
import { getGMIAPY } from '~/web3/GMIWeb3'
import useGetTokensList from '../core/useGetTokensList'

const useGetGMIAPY = ({ enabled = true }) => {

  const { data: blockNumber } = useBlockNumber({
    watch: true,
    cacheTime: 4_000,
  })

  const { data: tokens } = useGetTokensList({})

  const getData = async () => {
    return await getGMIAPY(tokens.filter(x => x.market))
  }

  return useQuery({
    queryKey: [queries.GET_GMI_APY, blockNumber?.toString(), tokens],
    queryFn: getData,
    enabled: enabled,
    placeholderData: keepPreviousData
  })

}

export default useGetGMIAPY
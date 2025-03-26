import { useQuery } from '@tanstack/react-query'

import { queries } from '~/consts/queries'
import { getDexSlippage } from '~/web3/GMIWeb3'

const useGetDexSlippage = ({ enabled = true }) => {

  const getData = async () => {
    return getDexSlippage()
  }

  return useQuery({
    queryKey: [queries.GET_DEX_SLIPPAGE],
    queryFn: getData,
    enabled: enabled
  })
}

export default useGetDexSlippage
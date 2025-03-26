import { queries } from '~/consts/queries'
import { formatEther as viemFormatEther } from 'viem'

import { useQuery } from '@tanstack/react-query'
import { getDexTotalControlledValue } from '~/web3/GMIWeb3'

const useGetTotalControlledValue = ({ enabled = true, formatEther = true }) => {

  const getData = async () => {
    const res = await getDexTotalControlledValue()
    return formatEther ? viemFormatEther(res) : res
  }

  return useQuery({
    queryKey: [queries.GET_GMI_TOTAL_CONTROLLED_VALUE, formatEther],
    queryFn: getData,
    enabled: enabled
  })

}

export default useGetTotalControlledValue
import { useQuery } from '@tanstack/react-query'
import { formatEther as viemFormatEther } from 'viem'

import { queries } from '~/consts/queries'
import env from '~/env'
import useUserStore from '~/stores/client/user'

import { getGMIBalance } from '~/web3/GMIWeb3'

const useGetGMIBalance = ({ enabled = true, formatEther = true }) => {

  const walletAddress = useUserStore(state => state.walletAddress)

  const getData = async () => {

    if (!walletAddress)
      return env.EMPTY_VALUE

    const balance = await getGMIBalance(walletAddress)
    return formatEther ? viemFormatEther(balance) : balance
  }

  return useQuery({
    queryKey: [queries.GET_GMI_BALANCE, walletAddress, formatEther],
    queryFn: getData,
    enabled
  })
}

export default useGetGMIBalance
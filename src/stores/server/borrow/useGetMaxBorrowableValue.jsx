import { useQuery } from '@tanstack/react-query'
import { formatEther as viemFormatEther } from 'viem'

import { queries } from '~/consts/queries'
import useUserStore from '~/stores/client/user'
import { getMaxBorrowableValue } from '~/web3/borrowWeb3'

const useGetMaxBorrowableValue = ({ userWalletAddress, enabled = true, formatEther = true }) => {

  const walletAddress = useUserStore(state => state.walletAddress)
  const effectiveWalletAddress = userWalletAddress || walletAddress

  const getData = async () => {
    const max = await getMaxBorrowableValue(effectiveWalletAddress)
    return formatEther ? viemFormatEther(max) : max
  }

  return useQuery({
    queryKey: [queries.GET_MAX_BORROWABLE_VALUE, formatEther, effectiveWalletAddress],
    queryFn: getData,
    enabled: enabled
  })
}

export default useGetMaxBorrowableValue
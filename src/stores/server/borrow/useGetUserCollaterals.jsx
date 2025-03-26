import { useQuery } from '@tanstack/react-query'

import { queries } from '~/consts/queries'
import { getUserCollaterals } from '~/web3/borrowWeb3'
import useUserStore from '~/stores/client/user'

const useGetUserCollaterals = ({ walletAddress, enabled = true }) => {
  const userWalletAddress = useUserStore(state => state.walletAddress)
  const effectiveWalletAddress = walletAddress || userWalletAddress

  const getData = async () => {
    return await getUserCollaterals(effectiveWalletAddress)
  }

  return useQuery({
    queryKey: [queries.GET_USER_COLLATERALS, effectiveWalletAddress],
    queryFn: getData,
    enabled: enabled
  })
}

export default useGetUserCollaterals
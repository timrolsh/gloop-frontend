import { useQuery } from '@tanstack/react-query'

import { queries } from '~/consts/queries'
import { getTokenName, getTokenSymbol } from '~/web3/core'

const useGetTokenName = ({ tokenAddress, enabled = true }) => {

  const getData = async () => {

    const name = await getTokenName(tokenAddress)
    const symbol = await getTokenSymbol(tokenAddress)

    return { name, symbol }
  }

  return useQuery({
    queryKey: [queries.GET_TOKEN_NAME, tokenAddress],
    queryFn: getData,
    enabled: enabled
  })
}

export default useGetTokenName
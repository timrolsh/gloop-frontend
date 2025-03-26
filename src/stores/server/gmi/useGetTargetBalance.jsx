import { useQuery } from '@tanstack/react-query'
import { formatUnits, parseUnits } from 'viem'

import { queries } from '~/consts/queries'
import env from '~/env'
import { getTargetBalance } from '~/web3/GMIWeb3'

const useGetTargetBalance = ({ token, withdrawal, roundUp = true, enabled = true, formatEther = true }) => {

  const getData = async () => {

    if (!token.dexTotalControlledValue)
      return env.EMPTY_VALUE

    const parsedDexTotalControlledValue = parseUnits(token.dexTotalControlledValue, token.decimals)

    const targetAmountInWei = await getTargetBalance(token, withdrawal, parsedDexTotalControlledValue, roundUp)
    return formatEther ? formatUnits(targetAmountInWei, token.decimals) : targetAmountInWei
  }

  return useQuery({
    queryKey: [queries.GET_TARGET_BALANCE, token, withdrawal, roundUp, formatEther],
    queryFn: getData,
    enabled: enabled
  })
}

export default useGetTargetBalance
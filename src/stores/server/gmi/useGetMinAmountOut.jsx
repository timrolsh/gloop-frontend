import { useQuery } from '@tanstack/react-query'
import { formatUnits, parseEther, parseUnits } from 'viem'

import { queries } from '~/consts/queries'
import env from '~/env'
import { useDebounce } from '~/hooks/useDebounce'
import { createBigNumber } from '~/utils/math'

const useGetMinAmountOut = ({ token, slippage, amount, withdrawal, enabled = true }) => {

  const debouncedAmount = useDebounce(amount)

  const getData = async () => {

    if (createBigNumber(debouncedAmount).lte(0))
      return null

    if (!slippage
      || slippage === env.EMPTY_VALUE
      || token.dexPrice === env.EMPTY_VALUE
      || token.dexTotalControlledValue === env.EMPTY_VALUE
      || token.dexTotalSupply === env.EMPTY_VALUE
    )
      return env.EMPTY_VALUE

    const dexTotalSupply = createBigNumber(parseUnits(token.dexTotalSupply, token.decimals))
    const totalValue = createBigNumber(parseUnits(token.dexTotalControlledValue, token.decimals))
    const tokenPrice = createBigNumber(parseUnits(token.dexPrice, token.decimals))
    const parsedAmount = createBigNumber(parseUnits(debouncedAmount, token.decimals))
    let mintAmount

    if (withdrawal) {

      if (dexTotalSupply.eq(0))
        return null

      const withdrawValue = parsedAmount.mul(totalValue).div(dexTotalSupply)
      mintAmount = withdrawValue.mul(parseEther('1')).div(tokenPrice)
    }

    else {

      if (dexTotalSupply.eq(0)) {
        // If dexTotalSupply is 0, mint amount is equivalent to deposit token value
        mintAmount = parsedAmount.mul(tokenPrice).div(parseEther('1'))
      } else {
        // Otherwise, calculate proportional amount based on total controlled value
        const depositTokenValue = parsedAmount.mul(tokenPrice).div(parseEther('1'))
        mintAmount = depositTokenValue.mul(dexTotalSupply).div(totalValue)
      }
    }


    return formatUnits(mintAmount.mul(100 - slippage).div(100).round().toString(), token.decimals)
  }

  return useQuery({
    queryKey: [queries.GET_MIN_AMOUNT_OUT, token, slippage, withdrawal, debouncedAmount],
    queryFn: getData,
    enabled: enabled
  })
}

export default useGetMinAmountOut
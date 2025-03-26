import { keepPreviousData, useQuery } from "@tanstack/react-query"

import env from "~/env"
import { queries } from "~/consts/queries"
import { fetchTotalUnderlying } from "~/web3/LendWeb3"
import { getRewardsData } from "~/web3/GMIncentivesWeb3"
import { createBigNumber } from '~/utils/math'
import { formatEther } from 'viem'
import useGetGloopPrice from './useGetGloopPrice'
import { useBlockNumber } from 'wagmi'

const useGetAPR = ({ rewardTokenAddress, enabled = true }) => {

  const { data: tokenPrice } = useGetGloopPrice({})

  const { data: blockNumber } = useBlockNumber({
    watch: true,
    cacheTime: 4_000,
  })

  // For incentives with no compound interest (APR):
  // Example
  // (1000 reward tokens per day) * ($1.2 as token price example) / ($10,000,000) * 365 = 0.00012 * 365 = 4.38%

  // For ARB, we can get the latestAnswer() from Chainlink oracle price feed for ARB: https://arbiscan.io/address/0xb2A824043730FE05F3DA2efaFa1CBbe83fa548D6#readContract

  const getData = async () => {
    // Emissions per sec = Reward tokens per sec = 0.01157 Gloop per second
    const emissionsPerSecond = await getRewardsData(rewardTokenAddress)

    // Total Lending pool USDC value = call pool.totalUnderlying(ERC20 asset) with the usdc address
    const totalLendingPoolUSDCValue = await fetchTotalUnderlying(env.USDC_TOKEN_ADDRESS)

    // Getting values from contracts:
    // Reward tokens per sec = Emissions per sec = (, uint256 emissionsPerSecond,,) = gmIncentives.getRewardsData(address reward)
    const rewardTokensPerSec = createBigNumber(formatEther(emissionsPerSecond[1]))

    // Reward tokens per day = rewards tokens per sec * 86400
    const rewardTokensPerDay = rewardTokensPerSec.mul(86400)

    // Daily reward rate = [1000 reward tokens per day * price of token] / (total lending pool USDC value)
    const dailyRewardRate = rewardTokensPerDay.mul(tokenPrice).div(totalLendingPoolUSDCValue)

    // APR = daily reward rate * 365
    const apr = dailyRewardRate.mul(365)

    return apr.toString()
  }

  return useQuery({
    queryKey: [queries.GET_APR, tokenPrice, rewardTokenAddress, blockNumber?.toString()],
    queryFn: getData,
    enabled,
    placeholderData: keepPreviousData
  })
}

export default useGetAPR

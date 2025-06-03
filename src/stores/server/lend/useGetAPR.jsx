import {keepPreviousData, useQuery} from "@tanstack/react-query";

import env from "~/env";
import {queries} from "~/consts/queries";
import {fetchTotalUnderlying} from "~/web3/LendWeb3";
import {getRewardsData} from "~/web3/GMIncentivesWeb3";
import {createBigNumber} from "~/utils/math";
import {formatEther, formatUnits} from "viem";
import useGetGloopPrice from "./useGetGloopPrice";
import {useBlockNumber} from "wagmi";

const useGetAPR = ({rewardTokenAddress, enabled = true}) => {
  const {data: tokenPrice} = useGetGloopPrice({});

  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  // For incentives with no compound interest (APR):
  // Example
  // (1000 reward tokens per day) * ($1.2 as token price example) / ($10,000,000) * 365 = 0.00012 * 365 = 4.38%

  // For ARB, we can get the latestAnswer() from Chainlink oracle price feed for ARB: https://arbiscan.io/address/0xb2A824043730FE05F3DA2efaFa1CBbe83fa548D6#readContract

  const getData = async () => {
    try {

      if (!tokenPrice || tokenPrice === env.EMPTY_VALUE || isNaN(tokenPrice) || Number(tokenPrice) <= 0) {
        return "0";
      }

      // Get GLOOP emissions per second
      const emissionsPerSecond = await getRewardsData(rewardTokenAddress);

      if (!emissionsPerSecond || !Array.isArray(emissionsPerSecond) || emissionsPerSecond.length < 2) {
        return "0";
      }

      // Total Lending pool USDC value = call pool.totalUnderlying(ERC20 asset) with the usdc address
      const totalLendingPoolUSDCValue = await fetchTotalUnderlying(env.USDC_TOKEN_ADDRESS);

      if (!totalLendingPoolUSDCValue || totalLendingPoolUSDCValue === 0n) {
        return "0";
      }

      // Getting values from contracts:
      // Reward tokens per sec = Emissions per sec = (, uint256 emissionsPerSecond,,) = gmIncentives.getRewardsData(address reward)
      const emissionsPerSecondValue = emissionsPerSecond[1];

      if (!emissionsPerSecondValue || emissionsPerSecondValue === 0n) {
        return "0";
      }

      // Formula: Gloop Simple APR = ((Gloop Emissions Rate * Seconds per year * Gloop Token Price) / total USDC lent) * 100%
      
      // GLOOP has 18 decimals, so use formatEther to convert to decimal
      const gloopEmissionsPerSec = createBigNumber(formatEther(emissionsPerSecondValue));
      
      // Seconds per year = 365.25 * 24 * 60 * 60 = 31557600
      const secondsPerYear = createBigNumber("31557600");
      
      // USDC has 6 decimals, so use formatUnits(6) to convert to decimal
      const totalLendingPoolFormatted = createBigNumber(formatUnits(totalLendingPoolUSDCValue, 6));

      console.log("=== APR CALCULATION DEBUG ===");
      console.log("GLOOP emissions per second:", gloopEmissionsPerSec.toString());
      console.log("Seconds per year:", secondsPerYear.toString());
      console.log("GLOOP token price:", tokenPrice);
      console.log("Total USDC lent:", totalLendingPoolFormatted.toString());

      // Apply the formula: (Gloop Emissions Rate * Seconds per year * Gloop Token Price) / total USDC lent * 100
      const annualRewardValue = gloopEmissionsPerSec
        .mul(secondsPerYear)
        .mul(tokenPrice);
      
      const aprDecimal = annualRewardValue.div(totalLendingPoolFormatted);
      
      // Convert to percentage (multiply by 100)
      const aprPercentage = aprDecimal.mul(100);

      console.log("Annual reward value ($):", annualRewardValue.toString());
      console.log("APR (decimal):", aprDecimal.toString());
      console.log("APR (percentage):", aprPercentage.toString());
      console.log("=== APR CALCULATION DEBUG END ===");

      return aprPercentage.toString();
    } catch (error) {
      console.error("=== APR CALCULATION ERROR ===");
      console.error("Error calculating APR:", error);
      console.error("Error stack:", error.stack);
      console.error("=== APR CALCULATION ERROR END ===");
      return "0";
    }
  };

  return useQuery({
    queryKey: [queries.GET_APR, tokenPrice, rewardTokenAddress, blockNumber?.toString()],
    queryFn: getData,
    enabled,
    placeholderData: keepPreviousData
  });
};

export default useGetAPR;

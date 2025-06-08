import {keepPreviousData, useQuery} from "@tanstack/react-query";

import {queries} from "~/consts/queries";

import useGetGMIPrice from "../gmi/useGetGMIPrice";
import {getGloopGMIGlobalState} from "~/web3/LendWeb3";
import {createBigNumber} from "~/utils/math";
import env from "~/env";
import {useBlockNumber} from "wagmi";

const useGetGloopPrice = ({enabled = true}) => {

  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  // Use the existing GMI price hook instead of fetching from Uniswap V4 pool
  const {data: gmiPriceInUSD, isLoading: gmiPriceLoading} = useGetGMIPrice({enabled});

  const getData = async () => {
    try {
      // Step 1: Get GLOOP/GMI price from the first pool
      const gloopGmiPoolState = await getGloopGMIGlobalState();
      
      // Step 2: Use GMI price from the useGetGMIPrice hook
      if (gloopGmiPoolState && Array.isArray(gloopGmiPoolState) && gloopGmiPoolState[0] && gloopGmiPoolState[0] !== 0n &&
          gmiPriceInUSD && gmiPriceInUSD !== env.EMPTY_VALUE) {
        
        // Calculate GLOOP/GMI price
        const gloopGmiSqrtPriceX96 = gloopGmiPoolState[0];

        const twoPow96 = createBigNumber(2).pow(96);
        const gloopGmiSqrtPrice = createBigNumber(gloopGmiSqrtPriceX96.toString()).dividedBy(twoPow96);
        const gloopGmiPrice = gloopGmiSqrtPrice.pow(2);
        
        // Convert GMI price from hook to BigNumber
        const gmiUsdPrice = createBigNumber(gmiPriceInUSD.toString());
        
        // Calculate final GLOOP/USD price: GLOOP/GMI * GMI/USD = GLOOP/USD
        const gloopUsdPrice = gloopGmiPrice.mul(gmiUsdPrice);
        
        console.log("Final calculated GLOOP/USD price:", gloopUsdPrice.toString());
        
        return gloopUsdPrice.toString();
      }

      // Fallback: Use the team's suggested price from their Index app
      console.log("GLOOP/GMI pool or GMI price not available, using fallback GLOOP price");
      
      // Based on team discussion, GLOOP was around $1.44 from their Index app
      const fallbackGloopPriceInUSD = "1.44";
      
      console.log("Using fallback GLOOP price in USD:", fallbackGloopPriceInUSD);
      
      return fallbackGloopPriceInUSD;

    } catch (error) {
      console.error("Error in GLOOP price calculation:", error);
      
      // Emergency fallback to ensure APR calculation can proceed
      console.log("Using emergency fallback GLOOP price due to error");
      return "1.44"; // Emergency fallback based on team data
    }
  };

  return useQuery({
    queryKey: [queries.GET_GLOOP_PRICE, blockNumber?.toString(), gmiPriceInUSD?.toString()],
    enabled: enabled && !gmiPriceLoading,
    queryFn: getData,
    placeholderData: keepPreviousData
  });
};

export default useGetGloopPrice;

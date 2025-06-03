import {keepPreviousData, useQuery} from "@tanstack/react-query";

import {queries} from "~/consts/queries";

import useGetGMIPrice from "../gmi/useGetGMIPrice";
import {getGloopGMIGlobalState, getGMIUSDCUniswapV4PoolState} from "~/web3/LendWeb3";
import {createBigNumber} from "~/utils/math";
import env from "~/env";
import {useBlockNumber} from "wagmi";
import { getDexTokenPrice } from "~/web3/GMIWeb3";

const useGetGloopPrice = ({enabled = true}) => {

  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  const getData = async () => {
    try {

      // Step 1: Get GLOOP/GMI price from the first pool
      const gloopGmiPoolState = await getGloopGMIGlobalState();
      
      // Step 2: Get GMI/USDC price from the second pool
      
      // const gmiUsdcPoolState = await getDexTokenPrice();
      // console.log("gmiUsdcPoolState", gmiUsdcPoolState);
      const gmiUsdcPoolState = await getGMIUSDCUniswapV4PoolState();

      if (gloopGmiPoolState && Array.isArray(gloopGmiPoolState) && gloopGmiPoolState[0] && gloopGmiPoolState[0] !== 0n &&
          gmiUsdcPoolState && Array.isArray(gmiUsdcPoolState) && gmiUsdcPoolState[0] && gmiUsdcPoolState[0] !== 0n) {
        
        
        // Calculate GLOOP/GMI price
        const gloopGmiSqrtPriceX96 = gloopGmiPoolState[0];

        const twoPow96 = createBigNumber(2).pow(96);
        const gloopGmiSqrtPrice = createBigNumber(gloopGmiSqrtPriceX96.toString()).dividedBy(twoPow96);
        const gloopGmiPrice = gloopGmiSqrtPrice.pow(2);
        
        
        // Calculate GMI/USDC price
        const gmiUsdcSqrtPriceX96 = gmiUsdcPoolState[0];
        
        const gmiUsdcSqrtPrice = createBigNumber(gmiUsdcSqrtPriceX96.toString()).dividedBy(twoPow96);
        const gmiUsdcPrice = gmiUsdcSqrtPrice.pow(2);
        
        
        // Calculate final GLOOP/USD price: GLOOP/GMI * GMI/USDC = GLOOP/USDC
        const gloopUsdPrice = gloopGmiPrice.mul(gmiUsdcPrice);
        
        // Adjust for token decimal differences (multiply by 10^12)
        const adjustedGloopUsdPrice = gloopUsdPrice.mul(createBigNumber(10).pow(12));
        
        console.log("Final calculated GLOOP/USD price (after 10^12 adjustment):", adjustedGloopUsdPrice.toString());
        
        return adjustedGloopUsdPrice.toString();
      }

      // Fallback: Use the team's suggested price from their Index app
      console.log("One or both V4 pools not available, using fallback GLOOP price");
      
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
    queryKey: [queries.GET_GLOOP_PRICE, blockNumber?.toString()],
    enabled: enabled,
    queryFn: getData,
    placeholderData: keepPreviousData
  });
};

export default useGetGloopPrice;

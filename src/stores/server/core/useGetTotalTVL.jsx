import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {formatEther} from "viem";
import {queries} from "~/consts/queries";
import {fetchTotalUnderlying} from "~/web3/LendWeb3";
import useGetTotalControlledValue from "../gmi/useGetTotalControlledValue";
import {createBigNumber} from "~/utils/math";
import env from "~/env";
import {useBlockNumber} from "wagmi";

const useGetTotalTVL = ({enabled = true}) => {
  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  // Get GMI TVL using existing hook
  const {data: gmiTVL, isLoading: gmiTVLLoading} = useGetTotalControlledValue({
    enabled,
    formatEther: true
  });

  const getData = async () => {
    try {
      // Get GM Lending TVL by calling totalUnderlying for each token
      const [gmBtcUnderlying, gmEthUnderlying, gmSolUnderlying, usdcUnderlying] = await Promise.all([
        fetchTotalUnderlying(env.BTC_TOKEN_ADDRESS),
        fetchTotalUnderlying(env.ETH_TOKEN_ADDRESS), 
        fetchTotalUnderlying(env.SOL_TOKEN_ADDRESS),
        fetchTotalUnderlying(env.USDC_TOKEN_ADDRESS)
      ]);

      // Convert all to formatted ether (assuming 18 decimals for GM tokens, 6 for USDC)
      const gmBtcFormatted = createBigNumber(formatEther(gmBtcUnderlying));
      const gmEthFormatted = createBigNumber(formatEther(gmEthUnderlying));
      const gmSolFormatted = createBigNumber(formatEther(gmSolUnderlying));
      // USDC has 6 decimals, so we need to handle it differently
      const usdcFormatted = createBigNumber(usdcUnderlying.toString()).dividedBy(createBigNumber(10).pow(6));

      // Calculate GM Lending TVL
      const gmLendingTVL = gmBtcFormatted.plus(gmEthFormatted).plus(gmSolFormatted).plus(usdcFormatted);

      // Get GMI TVL (already formatted)
      const gmiTVLFormatted = gmiTVL ? createBigNumber(gmiTVL.toString()) : createBigNumber(0);

      // Calculate Total TVL = GMI TVL + GM Lending TVL
      const totalTVL = gmiTVLFormatted.plus(gmLendingTVL);

      // console.log("=== TVL CALCULATION DEBUG ===");
      // console.log("GMI TVL:", gmiTVLFormatted.toString());
      // console.log("GM BTC Underlying:", gmBtcFormatted.toString());
      // console.log("GM ETH Underlying:", gmEthFormatted.toString());
      // console.log("GM SOL Underlying:", gmSolFormatted.toString());
      // console.log("USDC Underlying:", usdcFormatted.toString());
      // console.log("GM Lending TVL:", gmLendingTVL.toString());
      // console.log("Total TVL:", totalTVL.toString());
      // console.log("=== TVL CALCULATION DEBUG END ===");

      return totalTVL.toString();
    } catch (error) {
      console.error("Error calculating Total TVL:", error);
      return env.EMPTY_VALUE;
    }
  };

  return useQuery({
    queryKey: [queries.GET_TOTAL_TVL, gmiTVL?.toString(), blockNumber?.toString()],
    queryFn: getData,
    enabled: enabled && !gmiTVLLoading && gmiTVL !== undefined,
    placeholderData: keepPreviousData
  });
};

export default useGetTotalTVL; 
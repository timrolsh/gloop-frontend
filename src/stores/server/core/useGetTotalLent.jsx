import {useQuery} from "@tanstack/react-query";
import {formatUnits} from "viem";
import {queries} from "~/consts/queries";
import {fetchTotalUnderlying} from "~/web3/LendWeb3";
import env from "~/env";
import {useBlockNumber} from "wagmi";

const useGetTotalLent = ({enabled = true}) => {
  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  const getData = async () => {
    try {
      // Get total underlying for USDC
      const totalUnderlying = await fetchTotalUnderlying(env.USDC_TOKEN_ADDRESS);
      
      // USDC has 6 decimals, so use formatUnits(6) to convert to decimal
      const formattedUnderlying = formatUnits(totalUnderlying, 6);
      
      return formattedUnderlying;
    } catch (error) {
      console.error("Error calculating Total Lent:", error);
      return env.EMPTY_VALUE;
    }
  };

  return useQuery({
    queryKey: [queries.GET_TOTAL_LENT, blockNumber?.toString()],
    queryFn: getData,
    enabled,
    placeholderData: env.EMPTY_VALUE
  });
};

export default useGetTotalLent; 
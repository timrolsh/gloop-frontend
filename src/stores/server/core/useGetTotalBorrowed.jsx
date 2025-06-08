import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {formatUnits} from "viem";
import {queries} from "~/consts/queries";
import {fetchTotalBorrows} from "~/web3/LendWeb3";
import env from "~/env";
import {useBlockNumber} from "wagmi";

const useGetTotalBorrowed = ({enabled = true}) => {
  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  const getData = async () => {
    try {
      // Get total borrows for USDC
      const totalBorrows = await fetchTotalBorrows(env.USDC_TOKEN_ADDRESS);
      
      // USDC has 6 decimals, so use formatUnits(6) to convert to decimal
      const formattedBorrows = formatUnits(totalBorrows, 6);
      
      return formattedBorrows;
    } catch (error) {
      console.error("Error calculating Total Borrowed:", error);
      return env.EMPTY_VALUE;
    }
  };

  return useQuery({
    queryKey: [queries.GET_TOTAL_BORROWED, blockNumber?.toString()],
    queryFn: getData,
    enabled,
    placeholderData: keepPreviousData
  });
};

export default useGetTotalBorrowed; 
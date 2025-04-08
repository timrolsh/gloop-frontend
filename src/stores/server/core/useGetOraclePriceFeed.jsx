import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {formatEther, formatUnits} from "viem";
import {useBlockNumber} from "wagmi";

import {queries} from "~/consts/queries";
import {getOraclePriceDecimals, getOraclePriceFeed} from "~/web3/GMIncentivesWeb3";

const useGetOraclePriceFeed = ({tokenAddress, enabled = true}) => {
  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  const getData = async () => {
    const price = await getOraclePriceFeed(tokenAddress);
    const decimals = await getOraclePriceDecimals(tokenAddress);
    return formatUnits(price, decimals);
  };

  return useQuery({
    queryKey: [queries.GET_TOKEN_ORACLE_PRICE, tokenAddress, blockNumber?.toString()],
    queryFn: getData,
    enabled: enabled,
    placeholderData: keepPreviousData
  });
};

export default useGetOraclePriceFeed;

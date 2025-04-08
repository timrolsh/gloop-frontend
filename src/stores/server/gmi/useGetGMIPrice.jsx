import {queries} from "~/consts/queries";

import {keepPreviousData, useQuery} from "@tanstack/react-query";
import useGetGMITotalSupply from "./useGetGMITotalSupply";
import useGetTotalControlledValue from "./useGetTotalControlledValue";
import {useBlockNumber} from "wagmi";

const useGetGMIPrice = ({enabled = true}) => {
  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  const {data: totalSupply} = useGetGMITotalSupply({formatEther: false});
  const {data: totalControlledValue} = useGetTotalControlledValue({formatEther: false});

  const getData = async () => {
    const price = Number(((totalControlledValue || 0n) * 100000n) / (totalSupply || 1n));
    return Number(price / 100000).toFixed(4);
  };

  return useQuery({
    queryKey: [
      queries.GET_GMI_PRICE,
      totalSupply?.toString(),
      totalControlledValue?.toString(),
      blockNumber?.toString()
    ],
    queryFn: getData,
    enabled: enabled,
    placeholderData: keepPreviousData
  });
};

export default useGetGMIPrice;

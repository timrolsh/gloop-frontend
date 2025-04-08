import {useQuery} from "@tanstack/react-query";
import {formatEther} from "viem";

import {queries} from "~/consts/queries";
import {createBigNumber} from "~/utils/math";
import {getGloopStakersYieldFactor} from "~/web3/core";

const useGetGloopStakersYieldFactor = ({enabled = true}) => {
  const getData = async () => {
    const yieldFactor = await getGloopStakersYieldFactor();
    return createBigNumber(formatEther(yieldFactor)).mul(100).toFixed(2);
  };

  return useQuery({
    queryKey: [queries.GET_GLOOP_STAKERS_YIELD_FACTOR],
    queryFn: getData,
    enabled: enabled
  });
};

export default useGetGloopStakersYieldFactor;

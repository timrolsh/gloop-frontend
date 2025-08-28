import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {queries} from "~/consts/queries";
import {getTotalStakers} from "~/web3/StakingWeb3";
import {useBlockNumber} from "wagmi";

const useGetTotalStakers = ({enabled = true}) => {
  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  const getData = async () => {
    const res = await getTotalStakers();
    return Number(res);
  };

  return useQuery({
    queryKey: [queries.GET_TOTAL_STAKERS, blockNumber?.toString()],
    queryFn: getData,
    enabled: enabled,
    placeholderData: keepPreviousData
  });
};

export default useGetTotalStakers;

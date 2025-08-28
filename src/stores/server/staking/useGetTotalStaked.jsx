import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {formatEther} from "viem";
import {queries} from "~/consts/queries";
import {getTotalStaked} from "~/web3/StakingWeb3";
import {useBlockNumber} from "wagmi";

const useGetTotalStaked = ({enabled = true, formatEther: shouldFormatEther = true}) => {
  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  const getData = async () => {
    const res = await getTotalStaked();
    return shouldFormatEther ? formatEther(res) : res;
  };

  return useQuery({
    queryKey: [queries.GET_TOTAL_STAKED, shouldFormatEther, blockNumber?.toString()],
    queryFn: getData,
    enabled: enabled,
    placeholderData: keepPreviousData
  });
};

export default useGetTotalStaked;

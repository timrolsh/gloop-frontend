import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {useBlockNumber} from "wagmi";

import {queries} from "~/consts/queries";
import env from "~/env";
import useUserStore from "~/stores/client/user";
import {getAllUserRewards} from "~/web3/GMIncentivesWeb3";

const useGetAllUserRewards = ({enabled = true}) => {
  const walletAddress = useUserStore((state) => state.walletAddress);

  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  const getData = async () => {
    if (!walletAddress) return [];

    const allUserRewards = await getAllUserRewards(walletAddress);

    return allUserRewards || env.EMPTY_VALUE;
  };

  return useQuery({
    queryKey: [queries.GET_ALL_USER_REWARDS, walletAddress, blockNumber?.toString()],
    queryFn: getData,
    enabled: enabled,
    placeholderData: keepPreviousData
  });
};

export default useGetAllUserRewards;

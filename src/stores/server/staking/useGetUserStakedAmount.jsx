import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {formatEther} from "viem";
import {queries} from "~/consts/queries";
import {getUserStakedAmount} from "~/web3/StakingWeb3";
import useUserStore from "~/stores/client/user";
import {useBlockNumber} from "wagmi";

const useGetUserStakedAmount = ({enabled = true, formatEther: shouldFormatEther = true}) => {
  const walletAddress = useUserStore((state) => state.walletAddress);
  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  const getData = async () => {
    if (!walletAddress) return shouldFormatEther ? "0" : 0n;
    
    const res = await getUserStakedAmount(walletAddress);
    return shouldFormatEther ? formatEther(res) : res;
  };

  return useQuery({
    queryKey: [queries.GET_USER_STAKED_AMOUNT, walletAddress, shouldFormatEther, blockNumber?.toString()],
    queryFn: getData,
    enabled: enabled && !!walletAddress,
    placeholderData: keepPreviousData
  });
};

export default useGetUserStakedAmount;

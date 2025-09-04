import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {formatEther, formatUnits} from "viem";
import {queries} from "~/consts/queries";
import {getUserStakingPosition} from "~/web3/StakingWeb3";
import useUserStore from "~/stores/client/user";
import {useBlockNumber} from "wagmi";
import {LOCK_PERIODS} from "~/web3/StakingWeb3";

const useGetUserStakingPositions = ({enabled = true}) => {
  const walletAddress = useUserStore((state) => state.walletAddress);
  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  const getData = async () => {
    if (!walletAddress) return null;
    
    const position = await getUserStakingPosition(walletAddress);
    
    // position structure: [amountStaked, usdcIndex, rewardsUSDC, rewardsGLOOP, lastUpdateTime, lockEndTime, lockDuration]
    const [amountStaked, , rewardsUSDC, rewardsGLOOP, lastUpdateTime, lockEndTime, lockDuration] = position;
    
    // Convert bigints to numbers/strings for easier use
    const formattedPosition = {
      amountStaked: formatEther(amountStaked),
      rewardsUSDC: formatUnits(rewardsUSDC, 6), // USDC has 6 decimals
      rewardsGLOOP: formatEther(rewardsGLOOP),
      lastUpdateTime: Number(lastUpdateTime),
      lockEndTime: Number(lockEndTime),
      lockDuration: Number(lockDuration),
      // Calculate lock period in days
      lockPeriodDays: Number(lockDuration) / (24 * 60 * 60),
      // Calculate if position is unlockable
      isUnlockable: Date.now() / 1000 >= Number(lockEndTime),
      // Calculate unlock date
      unlockDate: new Date(Number(lockEndTime) * 1000),
      // Calculate boost based on lock duration
      boost: getLockBoostPercentage(Number(lockDuration))
    };
    
    return formattedPosition;
  };

  const getLockBoostPercentage = (lockDurationSeconds) => {
    if (lockDurationSeconds === LOCK_PERIODS[0]) return 10;
    if (lockDurationSeconds === LOCK_PERIODS[14]) return 25;
    if (lockDurationSeconds === LOCK_PERIODS[28]) return 50;
    if (lockDurationSeconds === LOCK_PERIODS[56]) return 100;
    return 0;
  };

  return useQuery({
    queryKey: [queries.GET_USER_STAKING_POSITIONS, walletAddress, blockNumber?.toString()],
    queryFn: getData,
    enabled: enabled && !!walletAddress,
    placeholderData: keepPreviousData
  });
};

export default useGetUserStakingPositions;

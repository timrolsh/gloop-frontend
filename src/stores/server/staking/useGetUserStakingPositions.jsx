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
    const currentTimeSeconds = Date.now() / 1000;
    const lockEndTimestamp = Number(lockEndTime);
    const lockDurationSeconds = Number(lockDuration);
    const stakedAmount = parseFloat(formatEther(amountStaked));
    
    const formattedPosition = {
      amountStaked: formatEther(amountStaked),
      rewardsUSDC: formatUnits(rewardsUSDC, 6), // USDC has 6 decimals
      rewardsGLOOP: formatEther(rewardsGLOOP),
      lastUpdateTime: Number(lastUpdateTime),
      lockEndTime: lockEndTimestamp,
      lockDuration: lockDurationSeconds,
      // Calculate lock period in days
      lockPeriodDays: lockDurationSeconds / (24 * 60 * 60),
      // Calculate if position is unlockable
      isUnlockable: currentTimeSeconds >= lockEndTimestamp,
      // Calculate unlock date
      unlockDate: new Date(lockEndTimestamp * 1000),
      // Calculate boost based on lock duration and expiry status
      boost: getActiveBoostPercentage(stakedAmount, currentTimeSeconds, lockEndTimestamp, lockDurationSeconds)
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

  const getActiveBoostPercentage = (stakedAmount, currentTimeSeconds, lockEndTime, lockDurationSeconds) => {
    // No stake or unstaked position -> 0% boost
    if (stakedAmount <= 0) return 0;
    
    // Stake is active but lock has expired -> 10% boost (unlocked staking)
    if (currentTimeSeconds >= lockEndTime) return 10;
    
    // Stake is active and lock is still valid -> use the boost multiplier for the lock duration
    return getLockBoostPercentage(lockDurationSeconds);
  };

  return useQuery({
    queryKey: [queries.GET_USER_STAKING_POSITIONS, walletAddress, blockNumber?.toString()],
    queryFn: getData,
    enabled: enabled && !!walletAddress,
    placeholderData: keepPreviousData
  });
};

export default useGetUserStakingPositions;

import {useMutation, useQueryClient} from "@tanstack/react-query";
import {queries} from "~/consts/queries";

import {toastSuccess} from "~/utils/toast";
import {claimRewards, partialClaimRewards} from "~/web3/StakingWeb3";

export const useClaimStakingRewards = () => {
  const queryClient = useQueryClient();

  const claimStakingRewards = async ({isPartial = false, gloopRewards = 0n, usdcRewards = 0n}) => {
    try {
      if (isPartial) {
        return await partialClaimRewards(gloopRewards, usdcRewards);
      } else {
        return await claimRewards();
      }
    } catch (error) {
      // Errors are handled in web3 js codes
      throw error;
    }
  };

  return useMutation({
    mutationFn: claimStakingRewards,
    onSuccess: () => {
      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries();

      // enforcing refetch because claiming affects reward queries
      queryClient.refetchQueries({queryKey: [queries.GET_CLAIMABLE_REWARDS]});
      queryClient.refetchQueries({queryKey: [queries.GET_USER_STAKING_POSITIONS]});
      queryClient.refetchQueries({queryKey: [queries.GET_GLOOP_BALANCE]});

      toastSuccess(`Claim Transaction Confirmed!`);
    }
  });
};

export default useClaimStakingRewards;

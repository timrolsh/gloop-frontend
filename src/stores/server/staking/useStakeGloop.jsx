import {useMutation, useQueryClient} from "@tanstack/react-query";
import {parseUnits} from "viem";
import {queries} from "~/consts/queries";

import {toastSuccess} from "~/utils/toast";
import {stakeGloop, approveGloop, checkGloopAllowance} from "~/web3/StakingWeb3";
import useUserStore from "~/stores/client/user";
import {createBigNumber} from "~/utils/math";

export const useStakeGloop = () => {
  const queryClient = useQueryClient();
  const walletAddress = useUserStore((state) => state.walletAddress);

  const stakeTokens = async ({amount, lockPeriodDays}) => {
    try {
      const parsedAmount = parseUnits(amount.toString(), 18); // GLOOP has 18 decimals

      // Check allowance first
      const allowance = await checkGloopAllowance(walletAddress);
      const toBeApproved = createBigNumber(parsedAmount.toString()).minus(allowance.toString());

      // Approve if necessary
      if (toBeApproved.gt(0)) {
        await approveGloop(parsedAmount);
      }

      // Stake the tokens
      return await stakeGloop(parsedAmount, lockPeriodDays);
    } catch (error) {
      // Errors are handled in web3 js codes
      throw error;
    }
  };

  return useMutation({
    mutationFn: stakeTokens,
    onSuccess: () => {
      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries();

      // enforcing refetch because staking affects multiple queries
      queryClient.refetchQueries({queryKey: [queries.GET_TOTAL_STAKED]});
      queryClient.refetchQueries({queryKey: [queries.GET_TOTAL_STAKERS]});
      queryClient.refetchQueries({queryKey: [queries.GET_USER_STAKED_AMOUNT]});
      queryClient.refetchQueries({queryKey: [queries.GET_USER_STAKING_POSITIONS]});
      queryClient.refetchQueries({queryKey: [queries.GET_GLOOP_BALANCE]});

      toastSuccess(`Staking Transaction Confirmed!`);
    }
  });
};

export default useStakeGloop;

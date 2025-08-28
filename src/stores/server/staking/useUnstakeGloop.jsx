import {useMutation, useQueryClient} from "@tanstack/react-query";
import {parseUnits} from "viem";
import {queries} from "~/consts/queries";

import {toastSuccess} from "~/utils/toast";
import {unstakeGloop} from "~/web3/StakingWeb3";

export const useUnstakeGloop = () => {
  const queryClient = useQueryClient();

  const unstakeTokens = async (amount) => {
    try {
      const parsedAmount = parseUnits(amount.toString(), 18); // GLOOP has 18 decimals
      return await unstakeGloop(parsedAmount);
    } catch (error) {
      // Errors are handled in web3 js codes
      throw error;
    }
  };

  return useMutation({
    mutationFn: unstakeTokens,
    onSuccess: () => {
      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries();

      // enforcing refetch because unstaking affects multiple queries
      queryClient.refetchQueries({queryKey: [queries.GET_TOTAL_STAKED]});
      queryClient.refetchQueries({queryKey: [queries.GET_TOTAL_STAKERS]});
      queryClient.refetchQueries({queryKey: [queries.GET_USER_STAKED_AMOUNT]});
      queryClient.refetchQueries({queryKey: [queries.GET_USER_STAKING_POSITIONS]});
      queryClient.refetchQueries({queryKey: [queries.GET_GLOOP_BALANCE]});

      toastSuccess(`Unstaking Transaction Confirmed!`);
    }
  });
};

export default useUnstakeGloop;

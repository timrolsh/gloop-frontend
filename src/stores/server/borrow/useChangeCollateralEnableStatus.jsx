import {useMutation, useQueryClient} from "@tanstack/react-query";

import {toastSuccess} from "~/utils/toast";
import {disableCollateral, enableCollateral} from "~/web3/borrowWeb3";
import {queries} from "~/consts/queries";

export const useChangeCollateralEnableStatus = ({token, enable = true}) => {
  const queryClient = useQueryClient();

  const changeStatus = async () => {
    try {
      if (enable) await enableCollateral(token);
      else await disableCollateral(token);
    } catch (error) {
      // Errors are handled in web3 js codes
      throw error;
    }
  };

  return useMutation({
    mutationFn: changeStatus,
    onSuccess: () => {
      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries();

      // enforcing refetch becuase unlike other queries token list might have indirect references that won't be updated by invalidating the staleTime of cache
      queryClient.refetchQueries({queryKey: [queries.GET_TOKENS_LIST]});

      toastSuccess(`Collateral ${enable ? "Enabled" : "Disabled"} Successfully`);
    }
  });
};

export default useChangeCollateralEnableStatus;

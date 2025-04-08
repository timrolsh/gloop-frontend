import {useMutation, useQueryClient} from "@tanstack/react-query";
import { parseUnits} from "viem";

import {approve, checkAllowance, deposit} from "~/web3/LendWeb3";
import {queries} from "~/consts/queries";

import {toastSuccess} from "~/utils/toast";
import useUserStore from "~/stores/client/user";
import {createBigNumber} from "~/utils/math";

export const useLendDeposit = ({token}) => {
  const queryClient = useQueryClient();
  const walletAddress = useUserStore((state) => state.walletAddress);

  const depositToken = async (depositAmount) => {
    try {
      const parsedAmount = parseUnits(depositAmount.toString(), token?.decimals);
      const allowance = await checkAllowance(walletAddress, token);

      const toBeApproved = createBigNumber(parsedAmount).minus(allowance);

      if (toBeApproved.gt(0)) await approve(parsedAmount.toString(), token);

      await deposit(parsedAmount, token);
    } catch (error) {
      // Errors are handled in web3 js codes
      throw error;
    }
  };

  return useMutation({
    mutationFn: depositToken,
    onSuccess: async () => {
      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries();

      // enforcing refetch becuase unlike other queries token list might have indirect references that won't be updated by invalidating the staleTime of cache
      queryClient.refetchQueries({queryKey: [queries.GET_TOKENS_LIST]});

      toastSuccess(`Deposit Transaction Confirmed!`);
    }
  });
};

export default useLendDeposit;

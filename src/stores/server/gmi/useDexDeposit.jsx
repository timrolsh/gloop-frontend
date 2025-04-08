import {useMutation, useQueryClient} from "@tanstack/react-query";
import {parseUnits} from "viem";

import {queries} from "~/consts/queries";

import {toastSuccess} from "~/utils/toast";
import {checkDexAllowance, dexApprove, dexDeposit} from "~/web3/GMIWeb3";
import {createBigNumber} from "~/utils/math";
import useUserStore from "~/stores/client/user";

export const useDexDeposit = ({token}) => {
  const queryClient = useQueryClient();
  const walletAddress = useUserStore((state) => state.walletAddress);

  const dexDepositToken = async ({amount}) => {
    try {
      const parsedAmount = parseUnits(amount.toString(), token.decimals);
      const allowance = await checkDexAllowance(token, walletAddress);
      const toBeApproved = createBigNumber(parsedAmount).minus(allowance);

      if (toBeApproved.gt(0)) await dexApprove(token, parsedAmount);

      await dexDeposit(token, parsedAmount, walletAddress);
    } catch (error) {
      // Errors are handled in web3 js codes
      throw error;
    }
  };

  return useMutation({
    mutationFn: dexDepositToken,
    onSuccess: async () => {
      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries();

      // enforcing refetch becuase unlike other queries token list might have indirect references that won't be updated by invalidating the staleTime of cache
      queryClient.refetchQueries({queryKey: [queries.GET_TOKENS_LIST]});

      toastSuccess(`Deposit Transaction Confirmed!`);
    }
  });
};

export default useDexDeposit;

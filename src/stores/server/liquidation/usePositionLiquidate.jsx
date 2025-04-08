import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAccount} from "wagmi";

import {toastSuccess} from "~/utils/toast";
import {liquidate} from "~/web3/liquidation";
import {parseUnits} from "viem";
import {queries} from "~/consts/queries";
import {approve, checkAllowance} from "~/web3/LendWeb3";
import useUserStore from "~/stores/client/user";
import {createBigNumber} from "~/utils/math";

export const usePositionLiquidate = () => {
  const {address} = useAccount();
  const queryClient = useQueryClient();
  const walletAddress = useUserStore((state) => state.walletAddress);

  const liquidatePosition = async ({borrowedAssetAddress, repayAmount, borrowerAddress}) => {
    try {
      const token = {address: borrowedAssetAddress, name: "USDC"};
      const parsedAmount = parseUnits(repayAmount.toString(), 6) + 1n; // to fix EVM 1n transfer dust issue
      const allowance = await checkAllowance(walletAddress, token);

      const toBeApproved = createBigNumber(parsedAmount).minus(allowance);

      if (toBeApproved.gt(0)) await approve(parsedAmount.toString(), token);

      await liquidate(borrowedAssetAddress, parsedAmount, borrowerAddress, address);
    } catch (error) {
      // Errors are handled in web3 js codes
      throw error;
    }
  };

  return useMutation({
    mutationFn: liquidatePosition,
    onSuccess: () => {
      // Invalidating all caches and whenever the data is used it will be fetched again
      queryClient.invalidateQueries();

      // enforcing refetch becuase unlike other queries token list might have indirect references that won't be updated by invalidating the staleTime of cache
      queryClient.refetchQueries({queryKey: [queries.GET_TOKENS_LIST]});

      toastSuccess(`Liquidation Success!`);
    }
  });
};

export default usePositionLiquidate;

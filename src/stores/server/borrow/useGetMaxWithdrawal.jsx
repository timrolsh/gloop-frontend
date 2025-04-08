import {useQuery} from "@tanstack/react-query";
import {queries} from "~/consts/queries";
import env from "~/env";
import {getConfigurations, getPoolAssetBalance, getTokenPrice} from "~/web3/core";
import {getMaxBorrowableValue, getUserBorrowBalance} from "~/web3/borrowWeb3";
import useUserStore from "~/stores/client/user";
import {formatEther, formatUnits} from "viem";
import {createBigNumber} from "~/utils/math";
import BigNumber from "bignumber.js";

const useGetMaxWithdrawal = ({token, walletAddress, enabled = true}) => {
  const userWalletAddress = useUserStore((state) => state.walletAddress);
  const effectiveWalletAddress = walletAddress || userWalletAddress;

  const getData = async () => {
    const borrowedToken = {name: "USDC", address: env.USDC_TOKEN_ADDRESS};
    const userCollateralBalance = await getPoolAssetBalance(token, effectiveWalletAddress);
    const userBorrowBalance = await getUserBorrowBalance(borrowedToken, effectiveWalletAddress);
    const lendFactor = (await getConfigurations(token)).lendFactor;
    const collateralPrice = await getTokenPrice(token);
    const maxBorrowableValue = await getMaxBorrowableValue(effectiveWalletAddress);
    const usdcPrice = await getTokenPrice(borrowedToken);

    // if user doesn't have active borrows allow max pool balance withdrawal
    if (createBigNumber(userBorrowBalance).lte(0))
      return formatUnits(userCollateralBalance, token.decimals);

    const remainingBorrowCapacity = createBigNumber(maxBorrowableValue).minus(
      createBigNumber(userBorrowBalance).mul(usdcPrice).div(1e6)
    );

    if (remainingBorrowCapacity.lte(0)) return 0; // User cannot withdraw any collateral without dropping health factor below 1

    // Convert remaining borrow capacity to collateral withdrawal
    const collateralWithdrawValue = remainingBorrowCapacity.div(formatEther(lendFactor));
    const collateralWithdrawAmount = collateralWithdrawValue.div(collateralPrice).toString();

    // Ensure the result doesn't exceed user's existing collateral balance
    return BigNumber.min(
      collateralWithdrawAmount,
      formatUnits(userCollateralBalance, token.decimals)
    ).toString();
  };

  return useQuery({
    queryKey: [queries.GET_MAX_WITHDRAWAL, token, effectiveWalletAddress],
    queryFn: getData,
    enabled: enabled
  });
};

export default useGetMaxWithdrawal;

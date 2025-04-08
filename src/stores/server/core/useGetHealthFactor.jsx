import {useQuery} from "@tanstack/react-query";
import {formatEther as viemFormatEther, parseUnits} from "viem";

import {queries} from "~/consts/queries";
import {calculateHealthFactor} from "~/web3/core";
import {useDebounce} from "~/hooks/useDebounce";
import env from "~/env";
import useUserStore from "~/stores/client/user";
import {createBigNumber} from "~/utils/math";
import useGetTotalBorrows from "../borrow/useGetTotalBorrows";
import useGetTotalCollateral from "~/stores/server/borrow/useGetTotalCollateral";

const useGetHealthFactor = ({
  token,
  amount,
  userWalletAddress,
  enabled = true,
  formatEther = true
}) => {
  const debouncedAmount = useDebounce(amount);
  const walletAddress = useUserStore((state) => state.walletAddress);
  const effectiveWalletAddress = userWalletAddress || walletAddress;
  const totalBorrowsQuery = useGetTotalBorrows({});
  const totalCollateralQuery = useGetTotalCollateral({});

  const getData = async () => {
    if (!effectiveWalletAddress || totalBorrowsQuery.isLoading || totalCollateralQuery.isLoading)
      return env.EMPTY_VALUE;

    // if user is displaying current HF with collateral deposited value greater than zero and a zero borrow amount display Infinity symbol
    if (
      createBigNumber(totalCollateralQuery.data).gt(0) &&
      createBigNumber(totalBorrowsQuery.data).lte(0) &&
      createBigNumber(amount).equals("0")
    )
      return Infinity;

    const parsedAmount = parseUnits(debouncedAmount.toString(), token.decimals);
    const healthFactor = await calculateHealthFactor(token, parsedAmount, effectiveWalletAddress);
    const formattedHF = formatEther ? viemFormatEther(healthFactor) : healthFactor;
    return createBigNumber(formattedHF).mul(100).toFixed(0);
  };

  return useQuery({
    queryKey: [
      queries.GET_HEALTH_FACTOR,
      token,
      effectiveWalletAddress,
      debouncedAmount,
      formatEther,
      totalBorrowsQuery,
      totalCollateralQuery
    ],
    queryFn: getData,
    enabled: enabled
  });
};

export default useGetHealthFactor;

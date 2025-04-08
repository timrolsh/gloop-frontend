import {useQuery} from "@tanstack/react-query";
import {parseUnits, formatEther as viemFormatEther} from "viem";

import {queries} from "~/consts/queries";
import env from "~/env";
import {useDebounce} from "~/hooks/useDebounce";
import {createBigNumber} from "~/utils/math";
import {getTransferFee} from "~/web3/GMIWeb3";
import useGetLowestFeeToken from "./useGetDexLowestFeeToken";

const useGetTrasnferFee = ({token, withdrawal, amount, enabled = true}) => {
  const debouncedAmount = useDebounce(amount);
  const lowestDepositFeeTokenQuery = useGetLowestFeeToken({});
  const lowestWithdrawFeeTokenQuery = useGetLowestFeeToken({withdrawal: true});

  const getData = async () => {
    if (createBigNumber(debouncedAmount).lte(0)) return null;

    const _token =
      token.name === "USDC"
        ? withdrawal
          ? lowestWithdrawFeeTokenQuery.data
          : lowestDepositFeeTokenQuery.data
        : token;
    const parsedAmount = parseUnits(debouncedAmount, token.decimals);
    const fee = await getTransferFee(_token, parsedAmount, withdrawal);
    return createBigNumber(fee).div(100).toString();
  };

  return useQuery({
    queryKey: [
      queries.GET_TRANSFER_FEE,
      token,
      withdrawal,
      debouncedAmount,
      lowestDepositFeeTokenQuery,
      lowestWithdrawFeeTokenQuery
    ],
    queryFn: getData,
    enabled: enabled
  });
};

export default useGetTrasnferFee;

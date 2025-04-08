import {useQuery} from "@tanstack/react-query";
import { formatUnits} from "viem";

import {queries} from "~/consts/queries";
import env from "~/env";
import useUserStore from "~/stores/client/user";

import {getPoolAssetBalance} from "~/web3/core";

const useGetWithdrawTokenBalance = ({returnEtherBalance = true, token}) => {
  const walletAddress = useUserStore((state) => state.walletAddress);

  const getData = async () => {
    if (!walletAddress) return env.EMPTY_VALUE;

    const balance = await getPoolAssetBalance(token, walletAddress);
    const formattedBalance = formatUnits(balance, token.decimals).toString();
    return returnEtherBalance ? formattedBalance : balance;
  };

  return useQuery({
    queryKey: [queries.GET_LEND_WITHDRAW_TOKEN_BALANCE, returnEtherBalance, token, walletAddress],
    queryFn: getData
  });
};

export default useGetWithdrawTokenBalance;

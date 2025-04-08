import {useQuery} from "@tanstack/react-query";
import { formatUnits} from "viem";

import {queries} from "~/consts/queries";
import env from "~/env";
import useUserStore from "~/stores/client/user";

import {getUserAssetBalance} from "~/web3/core";

const useGetDepositTokenBalance = ({token, returnEtherBalance = true}) => {
  const walletAddress = useUserStore((state) => state.walletAddress);

  const getData = async () => {
    if (!walletAddress) return env.EMPTY_VALUE;

    const balance = await getUserAssetBalance(token, walletAddress);
    const formattedBalance = formatUnits(balance, token.decimals).toString();
    return returnEtherBalance ? formattedBalance : balance.toString();
  };

  return useQuery({
    queryKey: [queries.GET_LEND_DEPOSIT_TOKEN_BALANCE, returnEtherBalance, token, walletAddress],
    queryFn: getData
  });
};

export default useGetDepositTokenBalance;

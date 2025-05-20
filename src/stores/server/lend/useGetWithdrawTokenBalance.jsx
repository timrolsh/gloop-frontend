import {useQuery} from "@tanstack/react-query";
import {formatUnits} from "viem";

import {queries} from "~/consts/queries";
import env from "~/env";
import useUserStore from "~/stores/client/user";

import {getPoolAssetBalance, getEffectiveUSDCBalance} from "~/web3/core";

const useGetWithdrawTokenBalance = ({returnEtherBalance = true, token}) => {
  const walletAddress = useUserStore((state) => state.walletAddress);

  const getData = async () => {
    if (!walletAddress || !token) return env.EMPTY_VALUE;

    // For USDC, use getEffectiveUSDCBalanceOf
    let balance;
    if (token.name === "USDC") {
      balance = await getEffectiveUSDCBalance(walletAddress);
    } else {
      balance = await getPoolAssetBalance(token, walletAddress);
    }

    // Directly use formatUnits. It correctly converts bigint to a decimal string.
    const formattedBalance = formatUnits(balance, token.decimals);

    // Return the raw bigint balance if returnEtherBalance is false
    return returnEtherBalance ? formattedBalance : balance;
  };

  return useQuery({
    queryKey: [queries.GET_LEND_WITHDRAW_TOKEN_BALANCE, returnEtherBalance, token, walletAddress],
    queryFn: getData,
    // Ensure query only runs when walletAddress and token are available
    enabled: !!walletAddress && !!token
  });
};

export default useGetWithdrawTokenBalance;

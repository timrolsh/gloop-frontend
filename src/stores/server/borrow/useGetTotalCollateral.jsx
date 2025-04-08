import {useQuery} from "@tanstack/react-query";

import {queries} from "~/consts/queries";
import {getUserCollateralValue} from "~/web3/borrowWeb3";
import {formatEther} from "viem";
import useUserStore from "~/stores/client/user";

const useGetUserCollateralValue = ({walletAddress, enabled = true}) => {
  const userWalletAddress = useUserStore((state) => state.walletAddress);
  const effectiveWalletAddress = walletAddress || userWalletAddress;

  const getData = async () => {
    const collateralValue = await getUserCollateralValue(effectiveWalletAddress);
    return formatEther(collateralValue);
  };

  return useQuery({
    queryKey: [queries.GET_TOTAL_USER_COLLATERAL_VALUE, effectiveWalletAddress],
    queryFn: getData,
    enabled: enabled
  });
};

export default useGetUserCollateralValue;

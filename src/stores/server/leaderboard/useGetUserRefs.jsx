import {queries} from "~/consts/queries";

import {useQuery} from "@tanstack/react-query";
import useUserStore from "~/stores/client/user";
import {getUserRefs} from "~/web3/core";

const useGetUserRefs = ({walletAddress, enabled = true}) => {
  const userWalletAddress = useUserStore((state) => state.walletAddress);
  const effectiveWalletAddress = walletAddress || userWalletAddress;

  const getData = async () => {
    return await getUserRefs(effectiveWalletAddress);
  };

  return useQuery({
    queryKey: [queries.GET_USER_REFS, effectiveWalletAddress],
    queryFn: getData,
    enabled: Boolean(enabled && effectiveWalletAddress.length)
  });
};

export default useGetUserRefs;

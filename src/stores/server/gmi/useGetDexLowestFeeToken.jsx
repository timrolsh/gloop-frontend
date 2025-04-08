import {queries} from "~/consts/queries";

import {useQuery} from "@tanstack/react-query";
import useGetTokensList from "../core/useGetTokensList";

const useGetLowestFeeToken = ({withdrawal = false, enabled = true}) => {
  const {data: tokens} = useGetTokensList({});

  const getData = async () => {
    const GMITokens = tokens.filter((x) => x.name !== "USDC");

    return GMITokens.reduce(function (prev, curr) {
      if (withdrawal) return prev.dexWithdrawFee < curr.dexWithdrawFee ? prev : curr;

      return prev.dexDepositFee < curr.dexDepositFee ? prev : curr;
    });
  };

  return useQuery({
    queryKey: [queries.GET_LOWEST_FEE_TOKEN, withdrawal, tokens],
    queryFn: getData,
    enabled: enabled
  });
};

export default useGetLowestFeeToken;

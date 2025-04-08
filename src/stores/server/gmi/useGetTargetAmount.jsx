import {useQuery} from "@tanstack/react-query";
import {formatUnits} from "viem";

import {queries} from "~/consts/queries";
import env from "~/env";
import {getTargetAmount} from "~/web3/GMIWeb3";

const useGetTargetAmount = ({token, enabled = true, formatEther = true}) => {
  const getData = async () => {
    const targetAmountInWei = await getTargetAmount(token);
    return formatEther ? formatUnits(targetAmountInWei, token.decimals) : targetAmountInWei;
  };

  return useQuery({
    queryKey: [queries.GET_TARGET_AMOUNT, token, formatEther],
    queryFn: getData,
    enabled: enabled
  });
};

export default useGetTargetAmount;

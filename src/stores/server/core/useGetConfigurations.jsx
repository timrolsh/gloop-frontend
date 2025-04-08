import {useQuery} from "@tanstack/react-query";
import {formatUnits} from "viem";

import {queries} from "~/consts/queries";
import {getConfigurations} from "~/web3/core";

const useGetConfigurations = ({token, enabled = true, formatEther = true}) => {
  const getData = async () => {
    const result = await getConfigurations(token);
    return formatEther
      ? {
          lendFactor: formatUnits(result.lendFactor, token.decimals),
          borrowFactor: formatUnits(result.borrowFactor, token.decimals)
        }
      : result;
  };

  return useQuery({
    queryKey: [queries.GET_CONFIGURATIONS, token, formatEther],
    queryFn: getData,
    enabled: enabled
  });
};

export default useGetConfigurations;

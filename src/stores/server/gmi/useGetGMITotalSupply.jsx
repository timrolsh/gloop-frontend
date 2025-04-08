import {queries} from "~/consts/queries";
import {formatEther as viemFormatEther} from "viem";

import {useQuery} from "@tanstack/react-query";
import {getGMITotalSupply} from "~/web3/GMIWeb3";

const useGetGMITotalSupply = ({enabled = true, formatEther = true}) => {
  const getData = async () => {
    const res = await getGMITotalSupply();
    return formatEther ? viemFormatEther(res) : res;
  };

  return useQuery({
    queryKey: [queries.GET_GMI_TOTAL_SUPPLY, formatEther],
    queryFn: getData,
    enabled: enabled
  });
};

export default useGetGMITotalSupply;

import {queries} from "~/consts/queries";

import {useQuery} from "@tanstack/react-query";
import {getIsUserLiquidable} from "~/web3/liquidation";

const useGetIsUserLiquidable = ({borrowedAsset, borrowerAddress}) => {
  const getData = async () => {
    return await getIsUserLiquidable(borrowedAsset, borrowerAddress);
  };

  return useQuery({
    queryKey: [queries.GET_IS_USER_LIQUIDABLE],
    queryFn: getData
  });
};

export default useGetIsUserLiquidable;

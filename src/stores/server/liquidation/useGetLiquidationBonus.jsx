import {queries} from "~/consts/queries";

import {useQuery} from "@tanstack/react-query";
import {getLiquidationBonus} from "~/web3/liquidation";
import {createBigNumber} from "~/utils/math";
import {formatEther} from "viem";

const useGetLiquidationBonus = ({enabled = true}) => {
  const getData = async () => {
    const bonus = await getLiquidationBonus();
    const formattedBonus = formatEther(bonus);
    return createBigNumber(formattedBonus).minus(1).mul(100).toString();
  };

  return useQuery({
    queryKey: [queries.GET_LIQUIDATION_BONUS],
    queryFn: getData,
    enabled
  });
};

export default useGetLiquidationBonus;

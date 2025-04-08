import {keepPreviousData, useQuery} from "@tanstack/react-query";

import {queries} from "~/consts/queries";

import useGetGMIPrice from "../gmi/useGetGMIPrice";
import {getGloopGMIGlobalState} from "~/web3/LendWeb3";
import {createBigNumber} from "~/utils/math";
import env from "~/env";
import {useBlockNumber} from "wagmi";

const useGetGloopPrice = ({enabled = true}) => {
  const {data: priceOfGMIInUSD} = useGetGMIPrice({});

  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  const getData = async () => {
    const globalState = await getGloopGMIGlobalState();

    if (!globalState || !Array.isArray(globalState)) return env.EMPTY_VALUE;

    const returnedPrice = globalState[0];

    const twoPow96 = createBigNumber(2).pow(96); // 2^96 for Q64.96 conversion

    // Step 1: Calculate sqrtPrice (square root of the Gloop/GMI price)
    const sqrtPrice = createBigNumber(returnedPrice).dividedBy(twoPow96);

    // Step 2: Calculate the price of Gloop in GMI
    const priceOfGloopInGMI = sqrtPrice.pow(2);

    // Step 3: Calculate the price of Gloop in USD
    const priceOfGloopInUSD = priceOfGloopInGMI.times(priceOfGMIInUSD);

    return priceOfGloopInUSD.toString();
  };

  return useQuery({
    queryKey: [queries.GET_GLOOP_PRICE, priceOfGMIInUSD, blockNumber?.toString()],
    enabled: enabled,
    queryFn: getData,
    placeholderData: keepPreviousData
  });
};

export default useGetGloopPrice;

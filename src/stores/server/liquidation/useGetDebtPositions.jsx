import {queries} from "~/consts/queries";

import {useQuery} from "@tanstack/react-query";
import {PositionDTO} from "~/dtos/liquidation/PositionDTO";
import {useAxios} from "~/plugins/api";
import Endpoint from "~/plugins/endpoint";

const useGetDebtPositions = () => {
  const axios = useAxios();

  const getData = async () => {
    const endpoint = Endpoint.getUrl("liquidation-list");
    const reponse = await axios.get(endpoint);
    return reponse.data.data;
  };

  return useQuery({
    queryKey: [queries.GET_DEBT_POSITIONS],
    queryFn: getData,
    placeholderData: [new PositionDTO(), new PositionDTO(), new PositionDTO(), new PositionDTO()]
  });
};

export default useGetDebtPositions;

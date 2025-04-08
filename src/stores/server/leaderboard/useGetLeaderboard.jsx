import {queries} from "~/consts/queries";

import {useQuery} from "@tanstack/react-query";
import {useAxios} from "~/plugins/api";
import Endpoint from "~/plugins/endpoint";
import {LeaderboardDTO} from "~/dtos/leaderboard/LeaderboardDTO";

const useGetLeaderboard = () => {
  const axios = useAxios();

  const getData = async () => {
    const endpoint = Endpoint.getUrl("leaderboard");
    const reponse = await axios.get(endpoint);
    return reponse.data.data;
  };

  return useQuery({
    queryKey: [queries.GET_LEADERBOARD],
    queryFn: getData,
    placeholderData: {
      totalUsers: undefined,
      LeaderboardList: [
        new LeaderboardDTO(),
        new LeaderboardDTO(),
        new LeaderboardDTO(),
        new LeaderboardDTO(),
        new LeaderboardDTO()
      ]
    }
  });
};

export default useGetLeaderboard;

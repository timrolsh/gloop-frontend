import {Table} from "react-bootstrap";
import LeaderboardTableRow from "./LeaderboardTableRow";
import Skeleton from "~/components/Skeleton";

export default function LeaderboardTable({rankings, isLoading, isError, isPlaceholderData}) {
  return (
    <div className="radius-8 bg-trans p-4 ">
      <div className="desktop-show">
        <Table borderless className="gmi_basket_table">
          <thead>
            <tr>
              <th className="color-gray font-14 bold-300">Rank</th>
              <th className="color-gray font-14 bold-300">User</th>
              <th className="color-gray font-14 bold-300">Lending Points</th>
              <th className="color-gray font-14 bold-300">Borrowing Points</th>
              <th className="color-gray font-14 bold-300">Staking Boost</th>
              <th className="color-gray font-14 bold-300">Total Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6}>
                <hr className="hr-3 border-dark-green m-0" />
              </td>
            </tr>
            {!isLoading && !rankings.length ? (
              <tr>
                <td className="color-white text-center" colSpan={8}>
                  <span>
                    {isError ? "Failed To Fetch Leaderboard Data" : "No Leaderboard Data Available"}
                  </span>
                </td>
              </tr>
            ) : (
              rankings.length &&
              rankings.map((ranking, index) =>
                isLoading || isPlaceholderData ? (
                  <tr key={index}>
                    <td colSpan={6}>
                      <Skeleton loading={true}>
                        <div></div>
                      </Skeleton>
                    </td>
                  </tr>
                ) : (
                  <LeaderboardTableRow key={index} index={index} ranking={ranking} />
                )
              )
            )}
          </tbody>
        </Table>
      </div>
      <div className="mobile-show">
        {!isLoading && !rankings.length ? (
          <span className="color-white text-center w-100 d-block">
            {isError ? "Failed To Fetch Leaderboard Data" : "No Leaderboard Data Available"}
          </span>
        ) : (
          rankings.length &&
          rankings.map((ranking, index) => (
            <Skeleton key={index} loading={isLoading || isPlaceholderData}>
              <LeaderboardTableRow key={index} index={index} ranking={ranking} card={true} />
            </Skeleton>
          ))
        )}
      </div>
    </div>
  );
}

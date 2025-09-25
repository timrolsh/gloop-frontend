import {partializeWalletAddress, truncateAmount, formatStakingBoost} from "~/utils/ui";

export default function LeaderboardTableRow({ranking, index, card = false}) {
  return (
    <>
      {card ? (
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between">
            <div className="color-gray font-14 bold-300 py-2">Ranking</div>
            <div className="color-white font-14 bold-600 py-2">#{index + 1}</div>
          </div>

          <div className="d-flex justify-content-between">
            <div className="color-gray font-14 bold-300 py-2">User</div>
            <div className="color-white font-14 bold-600 py-2">
              {partializeWalletAddress(ranking.address)}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <div className="color-gray font-14 bold-300 py-2">Lending Points</div>
            <div className="color-white font-14 bold-600 py-2">
              <span className="color-white font-16 bold-700">
                {truncateAmount(ranking.lendingUSDCPoints)}
              </span>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <div className="color-gray font-14 bold-300 py-2">Borrowing Points</div>
            <div className="color-white font-14 bold-600 py-2">
              <span className="color-white font-16 bold-700">
                {truncateAmount(ranking.borrowingUSDCPoints)}
              </span>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <div className="color-gray font-14 bold-300 py-2">Staking Boost</div>
            <div className="color-white font-14 bold-600 py-2">
              <span className="color-white font-16 bold-700">
                {formatStakingBoost(ranking.stakingBoost)}%
              </span>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <div className="color-gray font-14 bold-300 py-2">Total Points</div>
            <div className="color-white font-14 bold-600 py-2">
              <span className="color-white font-16 bold-700">
                {truncateAmount(ranking.totalEarnedPoints)}
              </span>
            </div>
          </div>

          <div>
            <hr className="hr-1 border-dark-green" />
          </div>
        </div>
      ) : (
        <tr className="py-3">
          <td className="color-white font-16 bold-700">#{index + 1}</td>
          <td className="color-white font-16 bold-700">
            {partializeWalletAddress(ranking.address)}
          </td>
          <td className="color-white font-16 bold-700">
            {truncateAmount(ranking.lendingUSDCPoints)}
          </td>
          <td className="color-white font-16 bold-700">
            {truncateAmount(ranking.borrowingUSDCPoints)}
          </td>
          <td className="color-white font-16 bold-700">
            {formatStakingBoost(ranking.stakingBoost)}%
          </td>
          <td className="color-white font-16 bold-700">
            {truncateAmount(ranking.totalEarnedPoints)}
          </td>
        </tr>
      )}
    </>
  );
}

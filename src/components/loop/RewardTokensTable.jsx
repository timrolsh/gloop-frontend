import React from "react"
import { Table } from "react-bootstrap"

import { truncateString } from "~/utils/truncateString"
import useScreenWidth from "~/hooks/useScreenWidth"

import Skeleton from "../Skeleton"
import RewardTokensTableRow from './RewardTokensTableRow'

const RewardTokensTable = ({ rewardsList, totalUnclaimedRewards, isLoading = true }) => {
  // Get the current screen width
  const screenWidth = useScreenWidth()

  return (
    <>
      <Table borderless className="gmi_basket_table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th className="color-gray font-14 bold-300">Reward token</th>
            <th className="color-gray font-14 bold-300">Unclaimed Rewards</th>
            <th className="color-gray font-14 bold-300">Unclaimed value</th>
            <th className="color-gray font-14 bold-300">APR</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7}>
              <hr className="hr-3 border-dark-green m-0" />
            </td>
          </tr>
          {isLoading ? (
            <tr>
              <td>
                <Skeleton
                  loading={isLoading}
                  height="40px"
                  width="200px"
                ></Skeleton>
              </td>
              <td>
                <Skeleton
                  loading={isLoading}
                  height="40px"
                  width="100px"
                ></Skeleton>
              </td>
              <td>
                <Skeleton
                  loading={isLoading}
                  height="40px"
                  width="100px"
                ></Skeleton>
              </td>
            </tr>
          ) : (
            rewardsList?.map((tokenAddress, index) => (
              <RewardTokensTableRow key={tokenAddress} tokenAddress={tokenAddress} totalUnclaimedReward={totalUnclaimedRewards[index]} />
            ))
          )}
        </tbody>
      </Table>
    </>
  )
}

export default RewardTokensTable

import React, { useMemo } from "react"
import { Row, Col, Button, Table } from "react-bootstrap"

import env from "~/env"
import { truncateAmount } from "~/utils/ui"
import useGetUserDetails from "~/stores/server/leaderboard/useGetUserDetails"
import useGetAllUserRewards from "~/stores/server/incentives/useGetAllUserRewards"

import Skeleton from "../Skeleton"
import useGetAPR from "~/stores/server/lend/useGetAPR"
import useClaimRewards from "~/stores/server/core/useClaimRewards"
import RewardTokensTable from "./RewardTokensTable"
import useGetTokensList from '~/stores/server/core/useGetTokensList'
import AsyncButton from '../AsyncButton'
import { createBigNumber } from '~/utils/math'

const LendMyDashboard = () => {

  const tokenListQuery = useGetTokensList({})

  // Claim points
  const { mutate: claimRewards, isPending: isClaimingPoints } = useClaimRewards()

  // Fetch all user rewards data
  const { data: allUserRewards, isLoading: isLoadingAllUserRewards } =
    useGetAllUserRewards({})

  // Destructure the arrays from the fetched data
  const rewardsList = allUserRewards?.[0]
  const unclaimedAmounts = allUserRewards?.[1]
  const pendingAmounts = allUserRewards?.[2]

  // Calculate total unclaimed rewards for each token
  const totalUnclaimedRewards = unclaimedAmounts?.map((amount, index) => {
    return amount + pendingAmounts[index]
  })

  const totalSupplied = useMemo(() => {

    if (!(tokenListQuery.data || []).length || tokenListQuery.isLoading)
      return env.EMPTY_VALUE

    return tokenListQuery.data.find(x => x.name === 'USDC')?.userPoolBalance

  }, [tokenListQuery])

  const totalClaimable = useMemo(() => {
    let totalRewards = createBigNumber(0)
    const totalUnclaimed = totalUnclaimedRewards || []

    for (const unclaimed of totalUnclaimed)
      totalRewards = totalRewards.plus(unclaimed)

    return totalRewards.toString()

  }, [totalUnclaimedRewards])

  const claimPointsButtonDisabledReason = useMemo(() => {

    if (!totalClaimable || createBigNumber(totalClaimable).lte(0))
      return 'No Rewards To Claim'

  }, [totalClaimable])

  return (
    <div className="my-4 bg-trans mx-auto overall-usdc-card">
      <div className="border-bottom-lg-up">
        <div className="information-detail-title mb-4">My Dashboard</div>
      </div>

      <Row className="overflow-x-auto">
        <Col sm={12} className="">
          <Skeleton loading={isLoadingAllUserRewards.isLoading || tokenListQuery.isLoading} height="100px">
            <div className="mobile-show" style={{ width: 'fit-content' }}>
              <div
                className="radius-8 bg-trans px-4 pt-4 pb-4 d-flex flex-column"
                style={{ gap: "16px" }}
              >
                <div className="d-flex v-center space-between">
                  <div className="font-16 bold-300 color-gray">
                    <span className="mr-10">Total Supplied</span>
                  </div>
                  <Skeleton
                    loading={tokenListQuery.isLoading || totalSupplied === env.EMPTY_VALUE}
                    width="80px"
                  >
                    <div className="font-16 bold-700 color-white text-end">
                      {truncateAmount(totalSupplied || "", 2)}
                    </div>
                  </Skeleton>
                </div>

                <RewardTokensTable rewardsList={rewardsList} totalUnclaimedRewards={totalUnclaimedRewards} isLoading={isLoadingAllUserRewards} />

                <AsyncButton
                  loading={isClaimingPoints}
                  onClick={claimRewards}
                  disabledreason={claimPointsButtonDisabledReason}
                  className="gloop-btn-primary-gray-disable font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2 w-100"
                >
                  Claim
                </AsyncButton>
              </div>
            </div>

            <div className="desktop-show bg-trans1 radius-8 p-3 my-2">
              <div className="d-flex space-between" style={{ gap: "16px" }}>
                <div className="d-flex flex-column space-between flex-grow-1">
                  <div className="p-2">
                    <span className="font-14 bold-300 color-gray">
                      Total Supplied
                    </span>
                  </div>
                  <Skeleton loading={tokenListQuery.isLoading || totalSupplied === env.EMPTY_VALUE} width='80px'>
                    <div className="font-20 bold-700 color-white px-2 pb-2">
                      {truncateAmount(totalSupplied || "", 2)}
                    </div>
                  </Skeleton>
                </div>

                <div className="d-flex flex-column space-between">
                  <div className="p-2">
                    <span className="font-14 bold-300 color-gray"></span>
                  </div>
                  <AsyncButton
                    loading={isClaimingPoints}
                    onClick={claimRewards}
                    disabledreason={claimPointsButtonDisabledReason}
                    className="gloop-btn-primary-gray-disable font-16 bold-700 radius-8 bg-green border-green color-dark"
                  >
                    Claim
                  </AsyncButton>
                </div>
              </div>

              <RewardTokensTable rewardsList={rewardsList} totalUnclaimedRewards={totalUnclaimedRewards} isLoading={isLoadingAllUserRewards} />
            </div>
          </Skeleton>
        </Col>
      </Row>
    </div>
  )
}

export default LendMyDashboard

import React, {useState} from "react";
import {Row, Col} from "react-bootstrap";
import AsyncButton from "~/components/AsyncButton";
import AuthenticatedSection from "../AuthenticatedSection";
import Skeleton from "../Skeleton";
import useGetTotalStaked from "~/stores/server/staking/useGetTotalStaked";
import useGetTotalStakers from "~/stores/server/staking/useGetTotalStakers";
import useGetUserStakedAmount from "~/stores/server/staking/useGetUserStakedAmount";
import useGetUserStakingPositions from "~/stores/server/staking/useGetUserStakingPositions";
import useUnstakeGloop from "~/stores/server/staking/useUnstakeGloop";
import {createBigNumber} from "~/utils/math";

export default function StakingRightPart() {
  const [activeTab, setActiveTab] = useState("Overview");

  // Hooks
  const {data: totalStaked, isLoading: totalStakedLoading} = useGetTotalStaked({});
  const {data: totalStakers, isLoading: totalStakersLoading} = useGetTotalStakers({});
  const {data: userStakedAmount, isLoading: userStakedLoading} = useGetUserStakedAmount({});
  const {data: userPosition, isLoading: userPositionLoading} = useGetUserStakingPositions({});
  const {mutateAsync: unstakeGloop, isPending: isUnstaking} = useUnstakeGloop();

  // Format data for display
  const stakingOverview = {
    totalStaked: totalStaked ? createBigNumber(totalStaked).toFormat(0) : "0",
    totalStakers: totalStakers ? totalStakers.toString() : "0",
    userStaked: userStakedAmount ? createBigNumber(userStakedAmount).toFormat(2) : "0",
    userBoost: userPosition && parseFloat(userPosition.amountStaked) > 0 ? userPosition.boost : "0"
  };

  // Convert single position to array format for compatibility with existing UI
  const userStakingPositions =
    userPosition && parseFloat(userPosition.amountStaked) > 0
      ? [
          {
            id: 1,
            amount: createBigNumber(userPosition.amountStaked).toFormat(2),
            lockPeriod: userPosition.lockPeriodDays,
            boost: userPosition.boost,
            unlockDate: userPosition.unlockDate.toISOString().split("T")[0],
            status: "active",
            isUnlockable: userPosition.isUnlockable,
            rawAmount: userPosition.amountStaked
          }
        ]
      : [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleUnstake = async (position) => {
    try {
      await unstakeGloop(position.rawAmount);
    } catch (error) {
      console.error("Unstaking failed:", error);
    }
  };

  // Helper function to determine if unstaking is allowed
  const canUnstake = (position) => {
    // For no-lock positions (0 days), always allow unstaking
    if (position.lockPeriod === 0) {
      return true;
    }
    // For locked positions, only allow if the lock period has expired
    return position.isUnlockable;
  };

  // Helper function to get the disabled reason for unstaking
  const getUnstakeDisabledReason = (position) => {
    if (isUnstaking) {
      return "Transaction in progress...";
    }
    if (position.lockPeriod > 0 && !position.isUnlockable) {
      const unlockDate = formatDate(position.unlockDate);
      return `This position is locked until ${unlockDate}. You cannot unstake until the lock period expires.`;
    }
    return "";
  };

  return (
    <>
      <Row className="">
        <Col sm={12}>
          <div className="space-between align-items-center my-2 desktop-flex">
            <div className="mobile-show">
              <div className="mt-4 my-2 d-flex flex-column" style={{gap: "8px"}}>
                <div className="d-flex" style={{gap: "8px"}}>
                  <div
                    className={`font-16 bold-600 cursur-pointer px-3 py-2 ${
                      activeTab === "Overview"
                        ? "color-white border-bottom border-green"
                        : "color-white-50"
                    }`}
                    onClick={() => setActiveTab("Overview")}
                  >
                    Overview
                  </div>
                  <div
                    className={`font-16 bold-600 cursur-pointer px-3 py-2 ${
                      activeTab === "Positions"
                        ? "color-white border-bottom border-green"
                        : "color-white-50"
                    }`}
                    onClick={() => setActiveTab("Positions")}
                  >
                    My Stakes
                  </div>
                </div>
              </div>
            </div>
            <div className="font-32 bold-700 color-white d-flex align-items-center my-4">
              Staking Info
            </div>

            <div className="desktop-show">
              <div className="my-2 d-flex" style={{gap: "8px"}}>
                <div
                  className={`font-16 bold-600 cursur-pointer px-3 py-2 ${
                    activeTab === "Overview"
                      ? "color-white border-bottom border-green"
                      : "color-white-50"
                  }`}
                  onClick={() => setActiveTab("Overview")}
                >
                  Overview
                </div>
                <div
                  className={`font-16 bold-600 cursur-pointer px-3 py-2 ${
                    activeTab === "Positions"
                      ? "color-white border-bottom border-green"
                      : "color-white-50"
                  }`}
                  onClick={() => setActiveTab("Positions")}
                >
                  My Stakes
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="overflow-hidden">
        <AuthenticatedSection height="500px">
          <Col sm={12} className="">
            {activeTab === "Overview" ? (
              <div className="mobile-show">
                <div
                  className="radius-8 bg-trans px-4 pt-4 pb-4 d-flex flex-column"
                  style={{gap: "16px"}}
                >
                  <div className="d-flex v-center space-between">
                    <div className="font-16 bold-300 color-gray">
                      <span className="mr-10">Total GLOOP Staked</span>
                    </div>
                    <Skeleton loading={totalStakedLoading} width="120px">
                      <div className="font-16 bold-700 color-white text-end">
                        {stakingOverview.totalStaked} GLOOP
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex v-center space-between">
                    <div className="font-16 bold-300 color-gray">
                      <span className="mr-10">Total Stakers</span>
                    </div>
                    <Skeleton loading={totalStakersLoading} width="80px">
                      <div className="font-16 bold-700 color-white text-end">
                        {stakingOverview.totalStakers}
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex v-center space-between">
                    <div className="font-16 bold-300 color-gray">
                      <span className="mr-10">Your Staked Amount</span>
                    </div>
                    <Skeleton loading={userStakedLoading} width="120px">
                      <div className="font-16 bold-700 color-green text-end">
                        {stakingOverview.userStaked} GLOOP
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex v-center space-between">
                    <div className="font-16 bold-300 color-gray">
                      <span className="mr-10">Your Current Point Boost</span>
                    </div>
                    <Skeleton loading={userPositionLoading} width="80px">
                      <div className="font-16 bold-700 color-green text-end">
                        +{stakingOverview.userBoost}%
                      </div>
                    </Skeleton>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mobile-show">
                <div
                  className="radius-8 bg-trans px-4 pt-4 pb-4 d-flex flex-column"
                  style={{gap: "16px"}}
                >
                  {userStakingPositions.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="font-18 bold-500 color-gray mb-2">No Active Stakes</div>
                      <div className="font-14 color-gray">
                        Start staking GLOOP to see your positions here
                      </div>
                    </div>
                  ) : (
                    <>
                      {userStakingPositions.map((position) => (
                        <div
                          key={position.id}
                          className="border-1 border-gray radius-8 p-3 staking-position-card"
                        >
                          <div className="d-flex space-between v-center mb-2">
                            <div className="font-16 bold-500 color-white">
                              {position.amount} GLOOP
                            </div>
                            <div className="font-14 color-green">+{position.boost}% Boost</div>
                          </div>
                          <div className="d-flex space-between mb-2">
                            <span className="font-14 color-gray">Lock Period:</span>
                            <span className="font-14 color-white">{position.lockPeriod} days</span>
                          </div>
                          <div className="d-flex space-between mb-3">
                            <span className="font-14 color-gray">Status:</span>
                            <span
                              className={`font-14 ${
                                position.isUnlockable ? "color-green" : "color-white"
                              }`}
                            >
                              {position.isUnlockable
                                ? "Unlocked"
                                : `Unlocks ${formatDate(position.unlockDate)}`}
                            </span>
                          </div>
                          <AsyncButton
                            className={`w-100 font-14 bold-600 radius-8 p-2 ${
                              canUnstake(position) && !isUnstaking
                                ? "gloop-btn-primary bg-green border-green color-dark"
                                : "gloop-btn-primary-gray-disable"
                            }`}
                            disabledreason={
                              !canUnstake(position) || isUnstaking
                                ? getUnstakeDisabledReason(position)
                                : ""
                            }
                            loading={isUnstaking}
                            onClick={() => handleUnstake(position)}
                          >
                            {isUnstaking
                              ? "Unstaking..."
                              : canUnstake(position)
                              ? "Unstake"
                              : "Locked"}
                          </AsyncButton>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Desktop view */}
            {activeTab === "Overview" ? (
              <div className="desktop-show bg-trans1 radius-8 p-3 my-2">
                <div className="d-flex space-between" style={{gap: "16px"}}>
                  <div className="d-flex flex-column space-between flex-grow-1">
                    <div className="p-2">
                      <span className="font-14 bold-300 color-gray">Total GLOOP Staked</span>
                    </div>
                    <Skeleton loading={totalStakedLoading}>
                      <div className="font-20 bold-700 color-white px-2 pb-2">
                        {stakingOverview.totalStaked} GLOOP
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex flex-column space-between flex-grow-1">
                    <div className="p-2">
                      <span className="font-14 bold-300 color-gray">Total Stakers</span>
                    </div>
                    <Skeleton loading={totalStakersLoading}>
                      <div className="font-20 bold-700 color-white px-2 pb-2">
                        {stakingOverview.totalStakers}
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex flex-column space-between flex-grow-1">
                    <div className="p-2">
                      <span className="font-14 bold-300 color-gray">Your Staked Amount</span>
                    </div>
                    <Skeleton loading={userStakedLoading}>
                      <div className="font-20 bold-700 color-green px-2 pb-2">
                        {stakingOverview.userStaked} GLOOP
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex flex-column space-between flex-grow-1">
                    <div className="p-2">
                      <span className="font-14 bold-300 color-gray">Your Current Point Boost</span>
                    </div>
                    <Skeleton loading={userPositionLoading}>
                      <div className="font-20 bold-700 color-green px-2 pb-2">
                        +{stakingOverview.userBoost}%
                      </div>
                    </Skeleton>
                  </div>
                </div>
              </div>
            ) : (
              <div className="desktop-show bg-trans1 radius-8 p-4 my-2">
                <div className="d-flex flex-column" style={{gap: "16px"}}>
                  {userStakingPositions.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="font-18 bold-500 color-gray mb-2">No Active Stakes</div>
                      <div className="font-14 color-gray">
                        Start staking GLOOP to see your positions here
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="font-18 bold-600 color-white mb-2">
                        Your Staking Positions
                      </div>
                      <div className="d-flex flex-column" style={{gap: "12px"}}>
                        {userStakingPositions.map((position) => (
                          <div
                            key={position.id}
                            className="border-1 border-gray radius-8 p-3 d-flex space-between v-center staking-position-card"
                          >
                            <div className="d-flex flex-column">
                              <div className="font-16 bold-500 color-white mb-1">
                                {position.amount} GLOOP
                              </div>
                              <div className="font-14 color-gray">
                                {position.lockPeriod} days •{" "}
                                {position.isUnlockable ? (
                                  <span className="color-green">Unlocked</span>
                                ) : (
                                  `Unlocks ${formatDate(position.unlockDate)}`
                                )}
                              </div>
                            </div>
                            <div className="d-flex v-center" style={{gap: "16px"}}>
                              <div className="text-end">
                                <div className="font-14 color-green">+{position.boost}% Boost</div>
                              </div>
                              <AsyncButton
                                className={`font-14 bold-600 radius-8 p-2 ${
                                  canUnstake(position) && !isUnstaking
                                    ? "gloop-btn-primary bg-green border-green color-dark"
                                    : "gloop-btn-primary-gray-disable"
                                }`}
                                disabledreason={
                                  !canUnstake(position) || isUnstaking
                                    ? getUnstakeDisabledReason(position)
                                    : ""
                                }
                                loading={isUnstaking}
                                onClick={() => handleUnstake(position)}
                                style={{minWidth: "100px"}}
                              >
                                {isUnstaking
                                  ? "Unstaking..."
                                  : canUnstake(position)
                                  ? "Unstake"
                                  : "Locked"}
                              </AsyncButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </Col>
        </AuthenticatedSection>
      </Row>
    </>
  );
}

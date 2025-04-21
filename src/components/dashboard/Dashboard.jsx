import {useMemo, useState} from "react";
import {Row, Col, Button, Container} from "react-bootstrap";
import Skeleton from "~/components/Skeleton";
import AsyncButton from "~/components/AsyncButton";
import useGetUserDetails from "~/stores/server/leaderboard/useGetUserDetails";

import {copyToClipboard, truncateAmount} from "~/utils/ui";
import useUserStore from "~/stores/client/user";
import {useAccount} from "wagmi";
import AddReferral from "../wallet/AddReferral";
import AuthenticatedSection from "../AuthenticatedSection";
import useGetUserRefs from "~/stores/server/leaderboard/useGetUserRefs";

export default function Dashboard() {
  const userDetailsQuery = useGetUserDetails();
  const userRefsQuery = useGetUserRefs({});

  const {isConnected} = useAccount();

  const [addReferralModalVisible, setAddReferralModalVisible] = useState(false);

  const handleOpenReferral = () => {
    setAddReferralModalVisible(true);
  };

  const addReferralButtonDisabledReason = useMemo(() => {
    if (!isConnected) return "Please Connect Wallet First!";

    const hasReferrer =
      userRefsQuery.data && Array.isArray(userRefsQuery.data) && userRefsQuery.data.length
        ? userRefsQuery.data[1]
        : false;

    if (hasReferrer) return "Referral Is Already Used!";
  }, [isConnected, userRefsQuery]);

  return (
    <>
      <Row className="">
        <Col sm={12}>
          <div className="space-between align-items-center my-2 desktop-flex">
            <div className="mobile-show">
              <Skeleton width="400px" loading={userRefsQuery.isLoading}>
                <div className="mt-4 my-2 d-flex flex-column" style={{gap: "8px"}}>
                  <AsyncButton
                    className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10 min-w-200"
                    disabledreason={addReferralButtonDisabledReason}
                    onClick={handleOpenReferral}
                  >
                    Add Referrer
                  </AsyncButton>
                  <AsyncButton
                    className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10 min-w-200"
                    disabledreason={"Coming Soon"}
                  >
                    Claim Points
                  </AsyncButton>
                </div>
              </Skeleton>
            </div>
            <div className="font-32 bold-700 color-white d-flex align-items-center my-4">
              My Dashboard
            </div>

            <div className="desktop-show">
              <Skeleton width="400px" loading={userRefsQuery.isLoading}>
                <div className="my-2 d-flex" style={{gap: "8px"}}>
                  <AsyncButton
                    className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10 min-w-200"
                    disabledreason={"Coming Soon"}
                  >
                    Claim Points
                  </AsyncButton>
                  <AsyncButton
                    className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10 min-w-200"
                    disabledreason={addReferralButtonDisabledReason}
                    onClick={handleOpenReferral}
                  >
                    Add Referrer
                  </AsyncButton>
                </div>
              </Skeleton>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="overflow-hidden">
        <AuthenticatedSection height="200px">
          <Col sm={12} className="">
            <Skeleton loading={userDetailsQuery.isLoading} height="200px">
              <div className="mobile-show">
                <div
                  className="radius-8 bg-trans px-4 pt-4 pb-4 d-flex flex-column"
                  style={{gap: "16px"}}
                >
                  <div className="d-flex v-center space-between">
                    <div className="font-16 bold-300 color-gray">
                      <span className="mr-10">Lending Points</span>
                    </div>
                    <Skeleton
                      loading={
                        userDetailsQuery.isLoading || !userDetailsQuery.data?.lendingUSDCPoints
                      }
                      width="80px"
                    >
                      <div className="font-16 bold-700 color-white text-end">
                        {truncateAmount(userDetailsQuery.data?.lendingUSDCPoints || "")}
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex v-center space-between">
                    <div className="font-16 bold-300 color-gray">
                      <span className="mr-10">Borrowing Points</span>
                    </div>
                    <Skeleton
                      loading={
                        userDetailsQuery.isLoading || !userDetailsQuery.data?.borrowingUSDCPoints
                      }
                      width="80px"
                    >
                      <div className="font-16 bold-700 color-white text-end">
                        {truncateAmount(userDetailsQuery.data?.borrowingUSDCPoints || "")}
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex v-center space-between">
                    <div className="font-16 bold-300 color-gray">
                      <span className="mr-10">Referral Boost</span>
                    </div>
                    <Skeleton
                      loading={userDetailsQuery.isLoading || !userDetailsQuery.data?.referralBoost}
                      width="80px"
                    >
                      <div className="font-16 bold-700 color-white my-3 text-end">
                        {truncateAmount(parseInt(userDetailsQuery.data?.referralBoost || 0))}
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex v-center space-between">
                    <div className="font-16 bold-300 color-gray">
                      <span className="mr-10">Users Referred</span>
                    </div>
                    <Skeleton
                      loading={
                        userDetailsQuery.isLoading || isNaN(userDetailsQuery.data?.usersReferred)
                      }
                      width="80px"
                    >
                      <div className="font-16 bold-700 color-white text-end">
                        {truncateAmount(userDetailsQuery.data?.usersReferred)}
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex v-center space-between">
                    <div className="font-16 bold-300 color-gray">
                      <span className="mr-10">Total Points</span>
                    </div>
                    <Skeleton
                      loading={
                        userDetailsQuery.isLoading || !userDetailsQuery.data?.totalEarnedPoints
                      }
                      width="80px"
                    >
                      <div className="font-16 bold-700 color-green text-end">
                        {truncateAmount(userDetailsQuery.data?.totalEarnedPoints || "")}
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex v-center space-between">
                    <div className="font-16 bold-300 color-gray">
                      <span className="mr-10">Rank</span>
                    </div>
                    <Skeleton loading={userDetailsQuery.isLoading} width="80px">
                      <div className="font-16 bold-700 color-green text-end">
                        {userDetailsQuery.data?.rank ? `#${userDetailsQuery.data?.rank}` : "-"}
                      </div>
                    </Skeleton>
                  </div>
                </div>
              </div>

              <div className="desktop-show bg-trans1 radius-8 p-3 my-2">
                <div className="d-flex space-between" style={{gap: "16px"}}>
                  <div className="d-flex flex-column space-between flex-grow-1">
                    <div className="p-2">
                      <span className="font-14 bold-300 color-gray">Lending Points</span>
                    </div>
                    <Skeleton
                      loading={
                        userDetailsQuery.isLoading || !userDetailsQuery.data?.lendingUSDCPoints
                      }
                    >
                      <div className="font-20 bold-700 color-white px-2 pb-2">
                        {truncateAmount(userDetailsQuery.data?.lendingUSDCPoints || "")}
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex flex-column space-between flex-grow-1">
                    <div className="p-2">
                      <span className="font-14 bold-300 color-gray">Borrowing Points</span>
                    </div>
                    <Skeleton
                      loading={
                        userDetailsQuery.isLoading || !userDetailsQuery.data?.borrowingUSDCPoints
                      }
                    >
                      <div className="font-20 bold-700 color-white px-2 pb-2">
                        {truncateAmount(userDetailsQuery.data?.borrowingUSDCPoints || "")}
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex flex-column space-between flex-grow-1">
                    <div className="p-2">
                      <span className="font-14 bold-300 color-gray">Referral Boost</span>
                    </div>
                    <Skeleton
                      loading={userDetailsQuery.isLoading || !userDetailsQuery.data?.referralBoost}
                    >
                      <div className="font-20 bold-700 color-white px-2 pb-2">
                        {truncateAmount(parseInt(userDetailsQuery.data?.referralBoost || 0), 2)}%
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex flex-column space-between flex-grow-1">
                    <div className="p-2">
                      <span className="font-14 bold-300 color-gray">Users Referred</span>
                    </div>
                    <Skeleton loading={userDetailsQuery.isLoading}>
                      <div className="font-20 bold-700 color-white px-2 pb-2">
                        {truncateAmount(userDetailsQuery.data?.usersReferred)}
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex flex-column space-between flex-grow-1">
                    <div className="p-2">
                      <span className="font-14 bold-300 color-gray">Total Points</span>
                    </div>
                    <Skeleton
                      loading={
                        userDetailsQuery.isLoading || !userDetailsQuery.data?.totalEarnedPoints
                      }
                    >
                      <div className="font-20 bold-700 color-green px-2 pb-2">
                        {truncateAmount(userDetailsQuery.data?.totalEarnedPoints || "")}
                      </div>
                    </Skeleton>
                  </div>
                  <div className="d-flex flex-column space-between flex-grow-1">
                    <div className="p-2">
                      <span className="font-14 bold-300 color-gray">Rank</span>
                    </div>
                    <Skeleton loading={userDetailsQuery.isLoading}>
                      <div className="font-20 bold-700 color-green px-2 pb-2">
                        {userDetailsQuery.data?.rank ? `#${userDetailsQuery.data?.rank}` : "-"}
                      </div>
                    </Skeleton>
                  </div>
                </div>
              </div>
            </Skeleton>
          </Col>
        </AuthenticatedSection>
      </Row>
      {addReferralModalVisible ? (
        <AddReferral onClose={() => setAddReferralModalVisible(false)} />
      ) : null}
    </>
  );
}

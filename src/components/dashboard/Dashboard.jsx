import {Row, Col} from "react-bootstrap";
import Skeleton from "~/components/Skeleton";
import useGetUserDetails from "~/stores/server/leaderboard/useGetUserDetails";
import {truncateAmount, scalePoints} from "~/utils/ui";
import AuthenticatedSection from "../AuthenticatedSection";

export default function Dashboard() {
  const userDetailsQuery = useGetUserDetails();

  return (
    <>
      <Row className="">
        <Col sm={12}>
          <div className="space-between align-items-center my-2 desktop-flex">
            <div className="mobile-show">
            </div>
            <div className="font-32 bold-700 color-white d-flex align-items-center my-4">
              My Dashboard
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
                        {truncateAmount(scalePoints(userDetailsQuery.data?.lendingUSDCPoints) || "")}
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
                        {truncateAmount(scalePoints(userDetailsQuery.data?.borrowingUSDCPoints) || "")}
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
                        {truncateAmount(scalePoints(userDetailsQuery.data?.totalEarnedPoints) || "")}
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
                        {truncateAmount(scalePoints(userDetailsQuery.data?.lendingUSDCPoints) || "")}
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
                        {truncateAmount(scalePoints(userDetailsQuery.data?.borrowingUSDCPoints) || "")}
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
                        {truncateAmount(scalePoints(userDetailsQuery.data?.totalEarnedPoints) || "")}
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
    </>
  );
}

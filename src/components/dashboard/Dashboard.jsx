import {Row, Col} from "react-bootstrap";
import useGetUserDetails from "~/stores/server/leaderboard/useGetUserDetails";
import {truncateAmount} from "~/utils/ui";
import AuthenticatedSection from "../AuthenticatedSection";

export default function Dashboard() {
  const userDetailsQuery = useGetUserDetails();
  const userData = userDetailsQuery.data || {};

  return (
    <>
      <Row className="">
        <Col sm={12}>
          <div className="space-between align-items-center my-2 desktop-flex">
            <div className="mobile-show"></div>
            <div className="font-32 bold-700 color-white d-flex align-items-center my-4">
              My Dashboard
            </div>
          </div>
        </Col>
      </Row>
      <Row className="overflow-hidden">
        <AuthenticatedSection height="200px">
          <Col sm={12} className="">
            <div className="mobile-show">
              <div
                className="radius-8 bg-trans px-4 pt-4 pb-4 d-flex flex-column"
                style={{gap: "16px"}}
              >
                <div className="d-flex v-center space-between">
                  <div className="font-16 bold-300 color-gray">
                    <span className="mr-10">Lending Points</span>
                  </div>
                  <div className="font-16 bold-700 color-white text-end">
                    {truncateAmount(userData.lendingUSDCPoints) || "0"}
                  </div>
                </div>
                <div className="d-flex v-center space-between">
                  <div className="font-16 bold-300 color-gray">
                    <span className="mr-10">Borrowing Points</span>
                  </div>
                  <div className="font-16 bold-700 color-white text-end">
                    {truncateAmount(userData.borrowingUSDCPoints) || "0"}
                  </div>
                </div>
                <div className="d-flex v-center space-between">
                  <div className="font-16 bold-300 color-gray">
                    <span className="mr-10">Total Points</span>
                  </div>
                  <div className="font-16 bold-700 color-green text-end">
                    {truncateAmount(userData.totalEarnedPoints) || "0"}
                  </div>
                </div>
                <div className="d-flex v-center space-between">
                  <div className="font-16 bold-300 color-gray">
                    <span className="mr-10">Rank</span>
                  </div>
                  <div className="font-16 bold-700 color-green text-end">
                    {userData.rank ? `#${userData.rank}` : "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="desktop-show bg-trans1 radius-8 p-3 my-2">
              <div className="d-flex space-between" style={{gap: "16px"}}>
                <div className="d-flex flex-column space-between flex-grow-1">
                  <div className="p-2">
                    <span className="font-14 bold-300 color-gray">Lending Points</span>
                  </div>
                  <div className="font-20 bold-700 color-white px-2 pb-2">
                    {truncateAmount(userData.lendingUSDCPoints) || "0"}
                  </div>
                </div>
                <div className="d-flex flex-column space-between flex-grow-1">
                  <div className="p-2">
                    <span className="font-14 bold-300 color-gray">Borrowing Points</span>
                  </div>
                  <div className="font-20 bold-700 color-white px-2 pb-2">
                    {truncateAmount(userData.borrowingUSDCPoints) || "0"}
                  </div>
                </div>
                <div className="d-flex flex-column space-between flex-grow-1">
                  <div className="p-2">
                    <span className="font-14 bold-300 color-gray">Total Points</span>
                  </div>
                  <div className="font-20 bold-700 color-green px-2 pb-2">
                    {truncateAmount(userData.totalEarnedPoints) || "0"}
                  </div>
                </div>
                <div className="d-flex flex-column space-between flex-grow-1">
                  <div className="p-2">
                    <span className="font-14 bold-300 color-gray">Rank</span>
                  </div>
                  <div className="font-20 bold-700 color-green px-2 pb-2">
                    {userData.rank ? `#${userData.rank}` : "-"}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </AuthenticatedSection>
      </Row>
    </>
  );
}

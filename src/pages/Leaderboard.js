import React from "react";
import {Row, Col, Container} from "react-bootstrap";
import SidebarSocial from "../components/SidebarSoical";
import leaderboard_img1_url from "../assets/img/leaderboard_img1.svg";
import gmi_img2_url from "../assets/img/gmi_img2.svg";
import leaderboard_img3_url from "../assets/img/leaderboard_img3.svg";
import leaderboard_img4_url from "../assets/img/leaderboard_img4.png";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import useGetLeaderboard from "~/stores/server/leaderboard/useGetLeaderboard";
import Skeleton from "~/components/Skeleton";
import {truncateAmount} from "~/utils/ui";
import Dashboard from "~/components/dashboard/Dashboard";

export default function Leaderboard() {
  const leaderboardQuery = useGetLeaderboard();

  return (
    <div>
      <SidebarSocial />
      <section>
        <Container className="mt-5 mb-3">
          <Row className="radius-8 bg-trans m-0 py-3 px-3 min-h-150">
            <Col sm={9} className="w-75-100">
              <div className="desktop-flex v-center">
                <div className="my-3 mr-20">
                  <img src={leaderboard_img1_url} width={62} />
                </div>
                <div className="color-white font-16 my-2">
                  Earn points for participating in Gloop's growing ecosystem by lending USDC and
                  borrowing USDC. Current Rates and Boosts: Lending USDC: 2 points per dollar per
                  day, Borrowing USDC: 1 point per dollar per day. Staking Boosts: 0 days - 10%, 14 days - 25%, 28
                  days - 50%, 56 days - 100%.
                </div>
              </div>
            </Col>
            <Col sm={3} className="w-25-100">
              <div className="mobile-left my-3 desktop-show">
                <a
                  href="https://docs.gloop.finance/frequently-asked-questions-faqs/gm-points"
                  target="_blank"
                  className="gloop-btn-second btn font-16 bold-400 radius-8 bg-trans-0 border-white color-white p-10-25 my-2 min-w-200" rel="noreferrer"
                >
                  <span className="mr-10">How to earn Points</span>
                  <img src={gmi_img2_url} width={12} />
                </a>
              </div>
              <div className="mobile-left mt-2 mobile-show">
                <a
                  href="https://docs.gloop.finance/frequently-asked-questions-faqs/gm-points"
                  target="_blank"
                  className="gloop-btn-second btn font-16 bold-400 radius-8 bg-trans-0 border-white color-white p-10-25 my-2 min-w-200" rel="noreferrer"
                >
                  <span className="mr-10">How to earn Points</span>
                  <img src={gmi_img2_url} width={12} />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container className="mt-3 mb-2">
          <Dashboard />
        </Container>
        <Container className="mt-3 mb-2">
          <Row className="">
            <Col sm={12}>
              <div className="space-between align-items-center my-2 desktop-flex ">
                <div className="font-32 bold-700 color-white d-flex align-items-center my-2">
                  Leaderboard
                </div>
              </div>
            </Col>
          </Row>
          <Row className="overflow-hidden v-center">
            <Col sm={6} className="">
              <Skeleton
                loading={leaderboardQuery.isLoading || !leaderboardQuery.data?.totalUsers}
                height="100px"
              >
                <div className="bg-trans1 radius-8 p-3 my-2">
                  <div className="d-flex space-between v-center">
                    <div className="p-2">
                      <img src={leaderboard_img3_url} width={14} className="mr-10" />
                      <span className="font-14 bold-300 color-gray">Total Users</span>
                    </div>
                  </div>
                  <div className="font-20 bold-700 color-white px-2 pb-2">
                    {truncateAmount(leaderboardQuery?.data?.totalUsers, 2)}
                  </div>
                </div>
              </Skeleton>
            </Col>
            <Col sm={6} className="">
              <Skeleton
                loading={leaderboardQuery.isLoading || !leaderboardQuery.data?.totalPoints}
                height="100px"
              >
                <div className="bg-trans1 radius-8 p-3 my-2">
                  <div className="d-flex space-between v-center">
                    <div className="p-2">
                      <img src={leaderboard_img4_url} width={14} className="mr-10" />
                      <span className="font-14 bold-300 color-gray">Total Points</span>
                    </div>
                  </div>
                  <div className="font-20 bold-700 color-white px-2 pb-2">
                    {truncateAmount(leaderboardQuery?.data?.totalPoints)}
                  </div>
                </div>
              </Skeleton>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row className="mt-3">
            <Col sm={12}>
              <LeaderboardTable
                rankings={leaderboardQuery?.data?.LeaderboardList || []}
                isPlaceholderData={leaderboardQuery.isPlaceholderData}
                isError={leaderboardQuery.isError}
                isLoading={leaderboardQuery.isLoading}
              />
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <div className="ptb-50"></div>
      </section>
    </div>
  );
}

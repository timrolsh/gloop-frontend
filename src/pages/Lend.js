import {useState, useEffect} from "react";
import LendSupply from "~/components/loop/LendSupply";
import LendWithdraw from "~/components/loop/LendWithdraw";

import {Col, Container, Row} from "react-bootstrap";
import loop_img1_url from "../assets/img/loop_img1.svg";
import gmi_img2_url from "../assets/img/gmi_img2.svg";
import SidebarSocial from "../components/SidebarSoical";
import gmi_img9_url from "../assets/img/gmi_img9.svg";
import {Link} from "react-router-dom";
import env from "~/env";
import LendOverallUSDCMarket from "~/components/loop/LendOverallUSDCMarket";
import LendMyDashboard from "~/components/loop/LendMyDashboard";
import AuthenticatedSection from "~/components/AuthenticatedSection";

export default function Lend() {
  const [activeTab, setActiveTab] = useState("Supply");

  return (
    <>
      <SidebarSocial />
      <section>
        <Container className="mt-5 mb-3">
          <Row className="radius-8 bg-trans m-0 py-3 px-3 min-h-150">
            <Col sm={9} className="w-75-100">
              <div className="desktop-flex v-center">
                <div className="my-3 mr-20">
                  <img src={loop_img1_url} width={62} />
                </div>
                <div className="color-white font-16 my-3">
                  Lend USDC to earn APY from accrued interest paid by borrowers, as well as
                  additional incentives.
                </div>
              </div>
            </Col>
            <Col sm={3} className="w-25-100">
              <div className="mobile-left my-3">
                <Link
                  to={env.DOCS_URL}
                  target="_blank"
                  className="gloop-btn-second btn font-16 radius-8 bg-trans-0 border-white color-white p-10-25 my-2"
                >
                  <span className="mr-10">See Documentation</span>
                  <img src={gmi_img2_url} width={12} />
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Container className="loop-main-container">
        <LendOverallUSDCMarket />
        <AuthenticatedSection height="700px">
          <LendMyDashboard />

          <div className="p-4 min-h-357 bg-trans mx-auto">
            <div className="d-flex v-center space-between">
              <div className="w-100 cursur-pointer" onClick={() => setActiveTab("Supply")}>
                <div
                  className={`font-18 bold-600  text-center ${
                    activeTab == "Supply" ? "color-white" : "color-white-50"
                  }`}
                >
                  Supply
                </div>
                <hr
                  className={`hr-3 border-dark-green ${
                    activeTab == "Supply" ? "active_gmi_tab" : ""
                  }`}
                />
              </div>
              <div className="w-100 cursur-pointer" onClick={() => setActiveTab("Withdraw")}>
                <div
                  className={`font-18 bold-600  text-center ${
                    activeTab == "Withdraw" ? "color-white" : "color-white-50"
                  }`}
                >
                  Withdraw
                </div>
                <hr
                  className={`hr-3 border-dark-green ${
                    activeTab == "Withdraw" ? "active_gmi_tab" : ""
                  }`}
                />
              </div>
            </div>
            {activeTab == "Supply" ? <LendSupply /> : <LendWithdraw />}
          </div>
        </AuthenticatedSection>
      </Container>
    </>
  );
}

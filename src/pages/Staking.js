import React from "react";
import {Row, Col, Container} from "react-bootstrap";
import SidebarSocial from "../components/SidebarSoical";
import StakingLeftPart from "../components/staking/StakingLeftPart";
import StakingRightPart from "../components/staking/StakingRightPart";
import stake_gmi_img from "../assets/img/stake_gmi_img.svg";
import gmi_img2_url from "../assets/img/gmi_img2.svg";
import {Link} from "react-router-dom";
import env from "~/env";

export default function Staking() {
  return (
    <div>
      <SidebarSocial />
      <section>
        <Container className="mt-5 mb-3">
          <Row className="radius-8 bg-trans m-0 py-3 px-3 min-h-150">
            <Col sm={9} className="w-75-100">
              <div className="desktop-flex v-center">
                <div className="my-3 mr-20">
                  <img src={stake_gmi_img} width={62} />
                </div>
                <div className="color-white font-16 my-3">
                  Stake your GLOOP tokens to earn rewards and boost your yield. Choose from 14-day,
                  28-day, or 56-day lock periods for different boost multipliers.
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
      <section>
        <Container className="mt-3 mb-5">
          <Row className="">
            <Col sm={12}>
              <div className="space-between align-items-center my-2 desktop-flex">
                <div className="mt-4 my-2 mobile-show">
                  <div className="btn font-16 bold-400 radius-8 bg-trans-0 border-gray2 color-white p-10-25 my-2 min-w-200">
                    <span className="color-gray">Total Staked: </span>
                    <span className="color-green">0 GLOOP</span>
                  </div>
                </div>
                <div className="font-32 bold-700 color-white d-flex align-items-center my-2">
                  GLOOP Staking
                </div>
                <div className="my-2 desktop-show">
                  <div className="btn font-16 bold-400 radius-8 bg-trans-0 border-gray2 color-white p-10-25 my-2 min-w-200">
                    <span className="color-gray">Total Staked: </span>
                    <span className="color-green">0 GLOOP</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={6} className="width-100 my-2">
              <StakingLeftPart />
            </Col>
            <Col sm={6} className="width-100 my-2">
              <StakingRightPart />
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

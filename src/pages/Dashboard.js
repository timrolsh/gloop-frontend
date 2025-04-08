import React, {useEffect} from "react";
import {Row, Col, Container} from "react-bootstrap";
import SidebarSocial from "../components/SidebarSoical";
import DashboardLeftPart from "../components/dashboard/DashboardLeftPart";
import DashboardRightPart from "../components/dashboard/DashboardRightPart";
import dashboard_icon1_url from "../assets/img/dashboard_icon1.svg";
import gmi_img2_url from "../assets/img/gmi_img2.svg";
import dashboard_img2_url from "../assets/img/dashboard_img2.svg";

export default function Dashboard() {
  useEffect(() => {}, []);

  return (
    <div>
      <SidebarSocial />
      <section>
        <Container className="mt-5 mb-3">
          <Row className="radius-8 bg-trans m-0 py-3 px-3 min-h-150">
            <Col sm={9} className="w-75-100">
              <div className="desktop-flex v-center">
                <div className="my-3 mr-20">
                  <img src={dashboard_icon1_url} width={62} />
                </div>
                <div className="color-white font-16 my-1">
                  Stake your GMI to earn points and invite friends to earn even more ...
                  <br />
                  What these points will be used for? Only time will tell!
                </div>
              </div>
            </Col>
            <Col sm={3} className="w-25-100">
              <div className="mobile-left my-3 desktop-show">
                <a
                  href="#"
                  target="_blank"
                  className="gloop-btn-second btn font-16 bold-400 radius-8 bg-trans-0 border-white color-white p-10-25 my-2 min-w-200"
                >
                  <span className="mr-10">More Details</span>
                  <img src={gmi_img2_url} width={12} />
                </a>
              </div>
              <div className="mobile-left my-1 mobile-show">
                <a
                  href="#"
                  target="_blank"
                  className="gloop-btn-second btn font-16 bold-400 radius-8 bg-trans-0 border-white color-white p-10-25 my-2 min-w-200"
                >
                  <span className="mr-10">More Details</span>
                  <img src={gmi_img2_url} width={12} />
                </a>
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
                    <img src={dashboard_img2_url} width={24} className="mr-10" />
                    <span className="color-gray">My Referral: </span>
                    <span className="color-green">12345</span>
                  </div>
                </div>
                <div className="font-32 bold-700 color-white d-flex align-items-center my-2">
                  Dashboard & GMI Staking
                </div>
                <div className="my-2 desktop-show">
                  <div className="gloop-btn-second btn font-16 bold-400 radius-8 bg-trans-0 border-gray2 color-white p-10-25 my-2 min-w-200">
                    <img src={dashboard_img2_url} width={24} className="mr-10" />
                    <span className="color-gray">My Referral: </span>
                    <span className="color-green">12345</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={6} className="width-100 my-2">
              <DashboardLeftPart />
            </Col>
            <Col sm={6} className="width-100 my-2">
              <DashboardRightPart />
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

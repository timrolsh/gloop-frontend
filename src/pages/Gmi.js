import React, {useState, useEffect, useMemo} from "react";
import {Row, Col, Button, Container} from "react-bootstrap";
import SidebarSocial from "../components/SidebarSoical";
import GMIDetails from "../components/gmi/GMIDetails";
import GMIDex from "../components/gmi/GMIDex";

import gmi_img1_url from "../assets/img/gmi_img1.svg";
import gmi_img2_url from "../assets/img/gmi_img2.svg";
import GmiBasket from "../components/gmi/GmiBasket";
import dashboard_img2_url from "../assets/img/dashboard_img2.svg";
import env from "~/env";

export default function Gmi() {
  return (
    <div>
      <SidebarSocial />
      <section>
        <Container className="mt-5 mb-3">
          <Row className="radius-8 bg-trans m-0 py-3 px-3 min-h-150">
            <Col sm={9} className="w-75-100">
              <div className="desktop-flex v-center">
                <div className="my-3 mr-20">
                  <img src={gmi_img1_url} width={62} />
                </div>
                <div className="color-white font-16 my-3">
                  GMI is an index token that contains a basket of optimally weighted GM assets,
                  offering holders a highly diversified return by automatically optimizing
                  risk-to-return ratios.
                </div>
              </div>
            </Col>
            <Col sm={3} className="w-25-100">
              <div className="mobile-left my-3">
                <a
                  href={env.DOCS_URL}
                  target="_blank"
                  className="gloop-btn-second btn font-16 radius-8 bg-trans-0 border-white color-white p-10-25 my-2"
                >
                  <span className="mr-10">See Documentation</span>
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
                <div className="font-32 bold-700 color-white d-flex align-items-center my-2">
                  Buy / Sell GMI
                </div>
                <div className="my-2 desktop-show visibility-hidden">
                  <div className="gloop-btn-second btn font-16 bold-400 radius-8 bg-trans-0 border-white color-white p-10-25 my-2 min-w-200">
                    <img src={dashboard_img2_url} width={24} className="mr-10" />
                    <span>My Referral: </span>
                    <span className="color-green">12345</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={6} className="width-100 my-2">
              <GMIDetails />
            </Col>
            <Col sm={6} className="width-100 my-2">
              <GMIDex />
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container className="my-5">
          <Row className="">
            <Col sm={12}>
              {/* <div className='font-32 bold-700 color-white mb-3'>
                                GMI Composition
                            </div>
                            <div className='font-16 bold-400 color-white mb-3'>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel fermentum massa.
                            </div> */}
              <div>
                <GmiBasket />
              </div>
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

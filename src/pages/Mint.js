import React, {useState, useEffect} from "react";
import {Row, Col, Button, Container} from "react-bootstrap";
import SidebarSocial from "../components/SidebarSoical";
import MintLeftPart from "../components/mint/MintLeftPart";
import MintRightPart from "../components/mint/MintRightPart";

import gmi_img1_url from "../assets/img/gmi_img1.svg";
import gmi_img2_url from "../assets/img/gmi_img2.svg";

import mint_img1_url from "../assets/img/mint_img1.svg";

export default function Mint() {
  useEffect(() => {}, []);

  return (
    <div>
      <SidebarSocial />
      <section>
        <Container className="my-5">
          <Row className="radius-8 bg-trans m-0 py-4 px-3">
            <Col sm={9} className="w-75-100">
              <div className="desktop-flex v-center">
                <div className="my-3 mr-20">
                  <img src={mint_img1_url} width={62} />
                </div>
                <div className="my-3">
                  <div className="color-white font-16 ">
                    <span className="bold-700">Mint GDC</span> → Deposit Staked IOU to get GDC
                    stablecoin.
                  </div>
                  <div className="color-white font-16 ">
                    <span className="bold-700">Redeem GDC</span> → Deposit GDC to get IOU for
                    rewards or to repay your debt.
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={3} className="w-25-100">
              <div className="mobile-left my-3">
                <a
                  href="#"
                  target="_blank"
                  className="gloop-btn-second btn font-16 bold-400 radius-8 bg-trans-0 border-white color-white p-10-25 my-2"
                >
                  <span className="mr-10">Buy GDC</span>
                  <img src={gmi_img2_url} width={12} />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container className="my-5">
          <Row className="">
            <Col sm={12}>
              <div className="font-32 bold-700 color-white mb-3">Mint / Redeem</div>
            </Col>
            <Col sm={6} className="width-100 my-2">
              <MintLeftPart />
            </Col>
            <Col sm={6} className="width-100 my-2">
              <MintRightPart />
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <div className="py-3"></div>
      </section>
    </div>
  );
}

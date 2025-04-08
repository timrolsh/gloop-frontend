import React, {useState, useEffect} from "react";
import {Row, Col, Button, Container} from "react-bootstrap";
import SidebarSocial from "../components/SidebarSoical";
import Info from "../components/Info";
import gmi_img2_url from "../assets/img/gmi_img2.svg";
import vault_img1_url from "../assets/img/vault_img1.svg";
import vault_img2_url from "../assets/img/vault_img2.svg";
import vault_img3_url from "../assets/img/vault_img3.svg";
import vault_img4_url from "../assets/img/vault_img4.svg";
import vault_img5_url from "../assets/img/vault_img5.svg";
import vault_img6_url from "../assets/img/vault_img6.svg";
import vault_img7_url from "../assets/img/vault_img7.svg";
import vault_img8_url from "../assets/img/vault_img8.svg";

import VaultLeftPart from "../components/vault/VaultLeftPart";
import VaultRightPart from "../components/vault/VaultRightPart";

export default function Vault() {
  const [selectedAsset, setSelectedAsset] = useState(vault_img8_url);
  const [activeAsset, setActiveAsset] = useState("eth");
  useEffect(() => {
    if (selectedAsset == vault_img1_url) {
      setActiveAsset("eth");
    }
    if (selectedAsset == vault_img2_url) {
      setActiveAsset("glp");
    }
    if (selectedAsset == vault_img3_url) {
      setActiveAsset("gmx");
    }
  }, [selectedAsset]);

  return (
    <div>
      <SidebarSocial />
      <section>
        <Container className="my-5">
          <Row className="">
            <Col sm={12}>
              <div className="font-32 bold-700 color-white mb-3">Choose asset</div>
            </Col>
          </Row>
          <Row>
            <Col sm={4} className="w-33-100">
              <div
                className={`bg-trans1 radius-8 p-3 my-2 border-1 vault_asset_item ${
                  activeAsset == "eth" ? "vault_asset_item_active" : ""
                }`}
                onClick={() => setSelectedAsset(vault_img1_url)}
              >
                <div className="d-flex space-between v-center">
                  <div className="p-2 text-center">
                    <img src={vault_img1_url} width={37} className="mr-10" />
                    <span className="font-18 bold-600 color-white">wstETH</span>
                  </div>
                  <div className="font-16 bold-700 color-white bg-trans radius-8 py-2 px-3">
                    20% APY
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={4} className="w-33-100">
              <div
                className={`bg-trans1 radius-8 p-3 my-2 border-1 vault_asset_item ${
                  activeAsset == "glp" ? "vault_asset_item_active" : ""
                }`}
                onClick={() => setSelectedAsset(vault_img2_url)}
              >
                <div className="d-flex space-between v-center">
                  <div className="p-2 text-center">
                    <img src={vault_img2_url} width={37} className="mr-10" />
                    <span className="font-18 bold-600 color-white">GLP</span>
                  </div>
                  <div className="font-16 bold-700 color-white bg-trans radius-8 py-2 px-3">
                    20% APY
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={4} className="w-33-100">
              <div
                className={`bg-trans1 radius-8 p-3 my-2 border-1 vault_asset_item ${
                  activeAsset == "gmx" ? "vault_asset_item_active" : ""
                }`}
                onClick={() => setSelectedAsset(vault_img3_url)}
              >
                <div className="d-flex space-between v-center">
                  <div className="p-2 text-center">
                    <img src={vault_img3_url} width={37} className="mr-10" />
                    <span className="font-18 bold-600 color-white">GMX</span>
                  </div>
                  <div className="font-16 bold-700 color-white bg-trans radius-8 py-2 px-3">
                    20% APY
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container className="my-5">
          <Row className="">
            <Col sm={12}>
              <div className="d-flex v-center mb-3 space-between">
                <div className="font-32 bold-700 color-white">Borrow</div>
                <div className="mobile-left">
                  <a
                    href="#"
                    target="_blank"
                    className="gloop-btn-second btn font-16 bold-700 radius-8 bg-trans-0 border-white color-white p-10-25"
                  >
                    <span className="mr-10">Buy wstETH</span>
                    <img src={gmi_img2_url} width={12} />
                  </a>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="overflow-hidden">
            <Col sm={3} className="w-25-100">
              <div className="bg-trans1 radius-8 p-3 my-2">
                <div className="d-flex space-between v-center">
                  <div className="p-2">
                    <img src={vault_img4_url} width={20} className="mr-10" />
                    <span className="font-14 bold-300 color-white">Total Value Locked</span>
                  </div>
                  <div>
                    <Info content="Lorem ipsum dolor sit amet consectetur lorem222" />
                  </div>
                </div>
                <div className="font-24 bold-700 color-white px-2">$ 0</div>
              </div>
            </Col>
            <Col sm={3} className="w-25-100">
              <div className="bg-trans1 radius-8 p-3 my-2">
                <div className="d-flex space-between v-center">
                  <div className="p-2">
                    <img src={vault_img5_url} width={20} className="mr-10" />
                    <span className="font-14 bold-300 color-white">Total Debt</span>
                  </div>
                  <div>
                    <Info content="Lorem ipsum dolor sit amet consectetur lorem222" />
                  </div>
                </div>
                <div className="font-24 bold-700 color-white px-2">$ 0</div>
              </div>
            </Col>
            <Col sm={3} className="w-25-100">
              <div className="bg-trans1 radius-8 p-3 my-2">
                <div className="d-flex space-between v-center">
                  <div className="p-2">
                    <img src={vault_img6_url} width={20} className="mr-10" />
                    <span className="font-14 bold-300 color-white">Minimum Col. Ratio</span>
                  </div>
                  <div>
                    <Info content="Lorem ipsum dolor sit amet consectetur lorem222" />
                  </div>
                </div>
                <div className="font-24 bold-700 color-white px-2">110%</div>
              </div>
            </Col>
            <Col sm={3} className="w-25-100">
              <div className="bg-trans1 radius-8 p-3 my-2">
                <div className="d-flex space-between v-center">
                  <div className="p-2">
                    <img src={vault_img7_url} width={20} className="mr-10" />
                    <span className="font-14 bold-300 color-white">ETH Price</span>
                  </div>
                  <div>
                    <Info content="Lorem ipsum dolor sit amet consectetur lorem222" />
                  </div>
                </div>
                <div className="font-24 bold-700 color-white px-2">$ 0</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container className="my-5">
          <Row className="">
            <Col sm={6} className="width-100 my-2">
              <VaultLeftPart asset_url={selectedAsset} />
            </Col>
            <Col sm={6} className="width-100 my-2">
              <VaultRightPart />
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

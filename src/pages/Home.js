import React, {useState, useEffect} from "react";
import {Row, Col, Button, Container, Accordion} from "react-bootstrap";
import {Link, Navigate, useNavigate} from "react-router-dom";
import home_img2_url from "../assets/img/home-img2.svg";
import circle_url from "../assets/img/circle.svg";
import home_img1_url from "../assets/img/home-img1.png";
import home_light_url from "../assets/img/home_light.svg";
import capitally_efficient_url from "../assets/img/Capitally_Efficient.svg";
import low_risk_url from "../assets/img/Low_Risk.svg";
import secure_url from "../assets/img/Secure.svg";
import fun_url from "../assets/img/Fun.svg";
import home_img3_url from "../assets/img/home_img3.svg";
import home_img4_url from "../assets/img/home_img4.svg";
import home_img5_url from "../assets/img/home_img5.png";
import home_img7_url from "../assets/img/home_img7.svg";
import one_url from "../assets/img/one.svg";
import two_url from "../assets/img/two.svg";
import three_url from "../assets/img/three.svg";
import four_url from "../assets/img/four.svg";
import otter_url from "../assets/img/otter.svg";
import arbi_url from "../assets/img/arbi.svg";
import gmx_url from "../assets/img/gmx.svg";
import halborn_url from "../assets/img/halborn.svg";
import SidebarSocial from "../components/SidebarSoical";
import {routes} from "../consts/routes";
import arrow_url from "../assets/img/arrow.svg";
import env from "~/env";
import useGetTotalTVL from "~/stores/server/core/useGetTotalTVL";
import {truncateAmount} from "~/utils/ui";
import Skeleton from "../components/Skeleton";

export default function Home() {
  const navigate = useNavigate();
  const {data: totalTVL, isLoading: totalTVLLoading} = useGetTotalTVL({});

  return (
    <div>
      <SidebarSocial />
      <section className="home-section1">
        <Container className="">
          <Row>
            <Col className="width-100" sm={6}>
              {/* <div className='w-280 font-14 color-white radius-8 bg-trans px-3 py-2 text-center'>PRESALE ON FJORD NOVEMBER 18TH</div> */}
              <div className="py-5">
                <img src={home_img2_url} width={203} />
              </div>
              <div className="font-36 bold-700 color-white">Increase your capital efficiency</div>
              <div className="font-16 color-white py-3">
                Gloop is a lending protocol allowing users to borrow against yield bearing tokens.
              </div>
              <div className="mt-3">
                <a
                  href={env.DOCS_URL}
                  target="_blank"
                  className="btn btn_read_doc gloop-btn-second font-16 bold-700 radius-8 bg-trans-0 border-white color-white p-10-25 my-2" rel="noreferrer"
                >
                  Read Documentation
                </a>
              </div>
              <img src={home_light_url} className="section1-img-light1 mobile-show" />
            </Col>
            <Col className="width-100" sm={6}>
              <div className="desktop-show positoin-relative">
                {/* <img src={circle_url} width={418}/> */}
                <img src={home_img1_url} width={466} className="section1-img" />
                <img src={home_light_url} className="section1-img-light" />
              </div>
            </Col>
          </Row>
          <Row className="m-0 radius-8 bg-trans mt-5 border-dark-green border-1">
            <Col sm={4} className="p-4 w-33-100">
              <Skeleton
                loading={totalTVLLoading || totalTVL === env.EMPTY_VALUE}
                width="120px"
              >
                <div className="font-32 bold-600 color-green mb-2">
                  ${truncateAmount(totalTVL, 2)}
                </div>
              </Skeleton>
              <div className="font-22 color-white ">TVL</div>
            </Col>
            <Col sm={4} className="p-4 w-33-100">
              <div className="font-32 bold-600 color-green mb-2">[Soon]</div>
              <div className="font-22 color-white ">Total Borrowed</div>
            </Col>
            <Col sm={4} className="p-4 w-33-100">
              <div className="font-32 bold-600 color-green mb-2">[Soon]</div>
              <div className="font-22 color-white ">Total Lent</div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container className="mt-5 mb-3">
          <Row className="home-3-logos-row">
            <Col sm={3} className="w-25-100">
              <div className="d-flex justify-content-center my-3">
                <img src={otter_url} width={190} />
              </div>
            </Col>
            <Col sm={3} className="w-25-100">
              <div className="d-flex justify-content-center my-3">
                <img src={arbi_url} width={190} />
              </div>
            </Col>
            <Col sm={3} className="w-25-100">
              <div className="d-flex justify-content-center my-3">
                <img src={gmx_url} width={128} />
              </div>
            </Col>
            <Col sm={3} className="w-25-100 d-flex justify-content-center v-center">
              <div className="d-flex justify-content-center my-3">
                <img src={halborn_url} width={200} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container className="ptb-50">
          <Row>
            <Col sm={12}>
              <div className="font-32 bold-700 color-white mb-4">Why Gloop?</div>
            </Col>
          </Row>
          <Row>
            <Col sm={3} className="w-25-100">
              <div className="bg-trans radius-8 p-4 min-h-357 my-2">
                <div className="bg-trans radius-8 p-2 w-58px text-center">
                  <img src={capitally_efficient_url} width={38} />
                </div>
                <div className="font-24 bold-700 color-white mt-3">Capitally Efficient</div>
                <div className="color-gray font-16 mt-3">
                  Instead of relying solely on GM tokens, consider the strategic use of the GMI
                  index and explore borrowing against it to optimize your overall investment
                  portfolio.
                </div>
              </div>
            </Col>
            <Col sm={3} className="w-25-100">
              <div className="bg-trans radius-8 p-4 min-h-357 my-2">
                <div className="bg-trans radius-8 p-2 w-58px text-center">
                  <img src={low_risk_url} width={38} />
                </div>
                <div className="font-24 bold-700 color-white mt-3">Low Risk</div>
                <div className="color-gray font-16 mt-3">
                  Our smart rebalancing algorithm adjusts the weights of GM's in the index to
                  maximize return and minimize risk so you don't have to constantly rebalance your
                  own portfolio.
                </div>
              </div>
            </Col>
            <Col sm={3} className="w-25-100">
              <div className="bg-trans radius-8 p-4 min-h-357 my-2">
                <div className="bg-trans radius-8 p-2 w-58px text-center">
                  <img src={secure_url} width={38} />
                </div>
                <div className="font-24 bold-700 color-white mt-3">Secure</div>
                <div className="color-gray font-16 mt-3">
                  Extremely talented developers with smart contract auditing experience developed
                  Gloop. All our products and features have also been audited out by some top firms
                  in the field.
                </div>
              </div>
            </Col>
            <Col sm={3} className="w-25-100">
              <div className="bg-trans radius-8 p-4 min-h-357 my-2">
                <div className="bg-trans radius-8 p-2 w-58px text-center">
                  <img src={fun_url} width={38} />
                </div>
                <div className="font-24 bold-700 color-white mt-3">Fun</div>
                <div className="color-gray font-16 mt-3">
                  The Gloop community is made up of awesome arbitrum loving individuals who are
                  passionate about web3 and the future of finance.
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container className="ptb-50">
          <Row>
            <Col sm={12}>
              <div className="font-32 bold-700 color-white mb-4 text-center">
                GMI & Borrowing Synergies
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={4} className="width-33-100">
              <div className="bg-trans radius-8 p-4 min-h-429 my-2">
                <div className="">
                  <img src={home_img3_url} className="w-100" />
                </div>
                <div className="font-24 bold-700 color-white mt-4">GMI</div>
                <div className="color-gray font-16 mt-3">
                  GMI operates as a basket, offering a curated assortment of GM assets.
                </div>
                <Link
                  to={routes.Gmi.path}
                  style={{textDecoration: "none"}}
                  className="home-page-link"
                >
                  <span>DIscover GMI</span>

                  <img className="arrow-icon" src={arrow_url} />
                </Link>
              </div>
            </Col>
            <Col sm={4} className="width-33-100">
              <div className="bg-trans radius-8 p-4 min-h-429 my-2">
                <div className="">
                  <img src={home_img4_url} className="w-100" />
                </div>
                <div className="font-24 bold-700 color-white mt-4">Borrowing and Looping</div>
                <div className="color-gray font-16 mt-3">
                  Gloop allows people to borrow USDC against yield bearing assets.
                </div>
                <Link
                  to={routes.Borrow.path}
                  style={{textDecoration: "none"}}
                  className="home-page-link"
                >
                  <span>
                    Deposit/Borrow <br />
                  </span>

                  <img className="arrow-icon" src={arrow_url} />
                </Link>
              </div>
            </Col>
            <Col sm={4} className="width-33-100">
              <div className="bg-trans radius-8 p-4 min-h-429 my-2">
                <div className="">
                  <img src={home_img7_url} className="w-100" />
                </div>
                <div className="font-24 bold-700 color-white mt-4">Lending USDC</div>
                <div className="color-gray font-16 mt-3">
                  Deposit USDC to earn passive yield without taking on the volatility
                </div>
                <Link
                  to={routes.Lend.path}
                  style={{textDecoration: "none"}}
                  className="home-page-link"
                >
                  <span>
                    Lend USDC <br />
                  </span>

                  <img className="arrow-icon" src={arrow_url} />
                </Link>
              </div>
            </Col>
            <Col sm={12}>
              <div className="text-center mt-4 mb-5">
                <Button className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2">
                  <Link
                    to="https://docs.gloop.finance/gloop-litepaper-v2/introduction"
                    target="_blank"
                    className="color-dark none-text-line"
                  >
                    Read Documentation
                  </Link>
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="home-section4">
        <Container className="ptb-50">
          <Row>
            <Col sm={12}>
              <div className="text-center mb-5">
                <img src={home_img5_url} className="w-450px" />
              </div>
              <div className="font-32 bold-700 color-white mb-3 text-center">Built to Boost</div>
              <div className="color-gray font-16 mt-3 text-center px-5">
                GMI includes gmBTC, gmETH, gmSOL, and USDC-USDT SWAP. To maintain the index at its
                target weights, fees are adjusted in response to variations in the targeted pool
                weights.
              </div>
              <div
                className="text-center mt-4"
                onClick={() => navigate(routes.Gmi.path, {preventScrollReset: false})}
              >
                <Button className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2">
                  Start Earning
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container className="ptb-50">
          <Row>
            <Col sm={12}>
              <div className="font-32 bold-700 color-white mb-4 text-center">How it works?</div>
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="width-100">
              <div className="bg-trans radius-8 p-4 my-2">
                <div className="bg-trans radius-8 p-2 py-3 w-58px text-center">
                  <img src={one_url} width={12} />
                </div>
                <div className="font-24 bold-700 color-white mt-4">Connect Wallet</div>
                <div className="color-gray font-16 mt-3">
                  Connect your wallet with the "connect wallet" button on the top right side of the
                  page.
                </div>
              </div>
            </Col>
            <Col sm={6} className="width-100">
              <div className="bg-trans radius-8 p-4 my-2">
                <div className="bg-trans radius-8 p-2 py-3 w-58px text-center">
                  <img src={two_url} width={21} />
                </div>
                <div className="font-24 bold-700 color-white mt-4">Go to GMI page</div>
                <div className="color-gray font-16 mt-3">
                  Head over to the dedicated GMI page to get more info on yield, the pool, and index
                  adjustments.
                </div>
              </div>
            </Col>
            <Col sm={6} className="width-100">
              <div className="bg-trans radius-8 p-4 my-2">
                <div className="bg-trans radius-8 p-2 py-3 w-58px text-center">
                  <img src={three_url} width={21} />
                </div>
                <div className="font-24 bold-700 color-white mt-4">Buy GMI</div>
                <div className="color-gray font-16 mt-3">
                  Gloop takes care of everything. Deposit your USDC and, in return, receive GMI
                  containing the GM tokens perfectly adjusted algorithmically by Gloop's proprietary
                  optimizer.
                </div>
              </div>
            </Col>
            <Col sm={6} className="width-100">
              <div className="bg-trans radius-8 p-4 my-2">
                <div className="bg-trans radius-8 p-2 py-3 w-58px text-center">
                  <img src={four_url} width={21} />
                </div>
                <div className="font-24 bold-700 color-white mt-4">Borrow Aginst GM's</div>
                <div className="color-gray font-16 mt-3">
                  Seize opportunities with our lending and borrowing feature, empowering you to
                  leverage GM holdings and gain flexibility in capitalizing on market trends.
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container className="ptb-50">
          <Row>
            <Col sm={5} className="w-41-100 pt-3">
              <div className="font-32 bold-700 color-white">
                Get the answers you need about Gloop
              </div>
              <div className="mt-4 desktop-show">
                <Link
                  target="_blank"
                  style={{textDecoration: "none"}}
                  to={"https://docs.gloop.finance/frequently-asked-questions-faqs/gm-index-gmi"}
                  className="gloop-btn-primary font-16 bold-700 radius-8 bg-green order-green color-dark p-10-25 my-2"
                >
                  FAQs
                </Link>
              </div>
            </Col>
            <Col sm={7} className="w-59-100">
              <div>
                <Accordion className="color-gray">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header className="color-white">
                      Are only GM tokens available for borrowing?
                    </Accordion.Header>
                    <Accordion.Body className="color-gray">
                      Only initially, the roadmap includes adding other yield bearing coins like
                      LSDs/LRT's later on.
                    </Accordion.Body>
                  </Accordion.Item>
                  {/* <Accordion.Item eventKey="1">
                                        <Accordion.Header>How soon will the protocol launch after the fjord sale?</Accordion.Header>
                                        <Accordion.Body className='color-gray'>
                                            Gloop is ready to go and has undergone two audits, the plan is to launch it a week or two after the sale has concluded so that those contributing to the project can focus entirely on the launch of the project without focusing on the token sale as well.
                                        </Accordion.Body>
                                    </Accordion.Item> */}
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>How does the GMI rebalance work?</Accordion.Header>
                    <Accordion.Body className="color-gray">
                      The GMI token is rebalanced by incentivizing the deposit/withdrawal of tokens
                      that are above/below target similar to that of GLP. Weights are calculated
                      using a proprietary algorithm that is fed months of price history and
                      historical yield to fetch the perfect weighting of the assets from time to
                      time. Changing the weights does not directly alter the price of GMI. To
                      simplify it, GMI generally leans more toward stables in bad market conditions
                      and more towards crypto in good conditions.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>Where can I buy $GLOOP</Accordion.Header>
                    <Accordion.Body className="color-gray">
                      <a
                        href="https://app.uniswap.org/"
                        target="_blank"
                        className="green-link" rel="noreferrer"
                      >
                        Uniswap V4 DEX.
                      </a>
                    </Accordion.Body>
                  </Accordion.Item>
                  {/* <Accordion.Item eventKey="4">
                                        <Accordion.Header>How can I join the private whitelisted part of the sale on fjord?</Accordion.Header>
                                        <Accordion.Body className='color-gray'>
                                            You can apply for our whitelist which is in the link in the @gloopfinance x.com bio or by owning a GBC (GMX Blueberry Club) NFT. Snapshots will be taken approximately a day before the sale.
                                        </Accordion.Body>
                                    </Accordion.Item> */}
                </Accordion>
              </div>
              <div className="mt-4 mobile-show text-center">
                <Button className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2">
                  Read more
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

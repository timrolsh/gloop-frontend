import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import loop_img1_url from "../assets/img/loop_img1.svg"
import gmi_img2_url from "../assets/img/gmi_img2.svg"
import loop_market_tab from "../assets/img/loop_market_tab.svg"
import loop_lend_tab from "../assets/img/loop_lend_tab.svg"
import loop_positions_tab from "../assets/img/loop_positions_tab.svg"
import loop_market_tab_active from "../assets/img/loop_market_tab_active.svg"
import loop_lend_tab_active from "../assets/img/loop_lend_tab_active.svg"
import loop_positions_tab_active from "../assets/img/loop_positions_tab_active.svg"
import Markets from '~/components/loop/Markets'
import Portfolio from '~/components/portfolio/Portfolio'
import SidebarSocial from '../components/SidebarSoical'
import gmi_img9_url from '../assets/img/gmi_img9.svg'
import { Link } from 'react-router-dom'
import { routes } from '~/consts/routes'
import env from '~/env'
import Skeleton from '~/components/Skeleton'
import useBorrowStore from '~/stores/client/borrow'
import PortfolioOverall from '~/components/portfolio/PortfolioOverall'
import usePortfolioStore from '~/stores/client/portfolio'
import AuthenticatedSection from '~/components/AuthenticatedSection'

export default function Borrow({ selectedTab }) {

  const activeTab = useBorrowStore((state) => state.activeTab)
  const setActiveTab = useBorrowStore((state) => state.setActiveTab)
  const setSelectedMarket = useBorrowStore((state) => state.setSelectedMarket)

  const selectedPosition = usePortfolioStore((state) => state.selectedPosition)
  const setSelectedPosition = usePortfolioStore((state) => state.setSelectedPosition)

  useEffect(() => {
    setActiveTab(selectedTab)
  }, [selectedTab])

  const onTabChange = (tab) => {
    setActiveTab(tab)
    setSelectedPosition(null)
    setSelectedMarket(null)
  }

  return (
    <div>
      <SidebarSocial />
      <section>
        <Container className='mt-5 mb-3'>
          <Row className='radius-8 bg-trans m-0 py-3 px-3 min-h-150'>
            <Col sm={9} className='w-75-100'>
              <div className='desktop-flex v-center'>
                <div className='my-3 mr-20'>
                  <img src={loop_img1_url} width={62} />
                </div>
                <div className='color-white font-16 my-3'>
                  Deposit GM tokens as collateral to borrow USDC. Use the USDC to buy and deposit more GM tokens
                  and loop the process to gain additional GMX-native APY.
                </div>
              </div>
            </Col>
            <Col sm={3} className='w-25-100'>
              <div className='mobile-left my-3'>
                <Link to={env.DOCS_URL} target='_blank' className='gloop-btn-second btn font-16 radius-8 bg-trans-0 border-white color-white p-10-25 my-2'><span className='mr-10'>See Documentation</span><img src={gmi_img2_url} width={12} /></Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container className='loop-main-container'>
          <Row>
            <Col className='mx-auto' sm={9} xs={12}>
              <Row>
                <Col sm={6} className='w-50-100 p-0' >
                  <div className={`bg-transparent border-3-bottom loop_tab_item ${activeTab === "market" ? "loop_tab_item_active" : ""}`} onClick={() => onTabChange('market')}>
                    <img src={activeTab === "market" ? loop_market_tab_active : loop_market_tab} width={24} />
                    <span>Deposit/Borrow Markets</span>
                  </div>
                </Col>
                <Col sm={6} className='w-50-100 p-0' >
                  <div className={`bg-transparent border-3-bottom  loop_tab_item ${activeTab === "portfolio" ? "loop_tab_item_active" : ""}`} onClick={() => onTabChange('portfolio')}>
                    <img src={activeTab === "portfolio" ? loop_positions_tab_active : loop_positions_tab} width={24} />

                    <div className='d-flex align-items-center gap-2'>
                      <span>Portfolio</span>
                      {/* <Skeleton loading={portfolioQuery.isLoading} width='60px'>
                        <span>({portfolioQuery?.data?.length})</span>
                      </Skeleton> */}
                    </div>

                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className='mt-4'>
            <Col sm={9} className='mx-auto radius-8 p-0'>
              {activeTab === "market" && <Markets />}
              {
                activeTab === 'portfolio'
                  ? <AuthenticatedSection height='700px'>
                    {!selectedPosition && <PortfolioOverall />}
                    <Portfolio />
                  </AuthenticatedSection>
                  : null
              }
            </Col>
          </Row>
        </Container>
      </section>
    </div >
  )
}

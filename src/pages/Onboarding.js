import React from 'react'
import { Row, Col, Button, Container } from 'react-bootstrap'
import SidebarSocial from '../components/SidebarSoical'
import WalletBox from '../components/onboarding/WalletBox'
import InviteBox from '../components/onboarding/InviteBox'
import TwitterBox from '../components/onboarding/TwitterBox'
import DiscordBox from '../components/onboarding/DiscordBox'
import useUserStore from '~/stores/client/user'

export default function Onboarding() {

    return (
        <div>
            <section>
                <Container className='my-5'>
                    <Row>
                        <Col sm={2}></Col>
                        <Col sm={8}>
                            <div className='text-center mb-4'>
                                <div className='font-52 color-white bold-600'>Want to join the <span className='color-green'>Gloopers?</span></div>
                                <div className='font-16 color-white bold-400 mt-3'>Begin your farming journey by completing the quests below.</div>
                            </div>
                            <div className='my-3'>
                                <WalletBox />
                            </div>
                            <div className='my-3'>
                                <InviteBox />
                            </div>
                        </Col>
                        <Col sm={2}></Col>
                    </Row>
                </Container>
            </section>
            <section>
                <div className='ptb-50'></div>
            </section>
        </div>
    )
}


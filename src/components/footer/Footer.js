import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { routes } from '~/consts/routes'
import env from '~/env'

// images
import Logo from "~/assets/img/logo.png"
import TwitterIcon from "~/assets/img/twitter.svg"
import DiscordIcon from "~/assets/img/discord.svg"
import DocsIcon from "~/assets/img/book.svg"
import MediumIcon from "~/assets/img/m.svg"

export default function Footer() {
    return (
        <footer className='footer-bg'>
            <Container>
                <Row>
                    <Col sm={6} className='width-100 py-3'>
                        <Link to="/"><img src={Logo} width="140px" /></Link>
                    </Col>
                    <Col sm={6} className='width-100 py-3'>
                        <Row>
                            <Col sm={4} className='width-33-50'>
                                <div className='color-white font-16 bold-700 mb-3'>Product</div>
                                <div className='footer-menu-item'>
                                    <Link to={routes.Borrow.path} className="font-14 color-gray none-text-line">{routes.Borrow.name}</Link>
                                </div>
                                <div className='footer-menu-item'>
                                    <Link to={routes.Gmi.path} className="font-14 color-gray none-text-line">{routes.Gmi.name}</Link>
                                </div>
                                <div className='footer-menu-item'>
                                    <Link to={routes.Lend.path} className="font-14 color-gray none-text-line">{routes.Lend.name}</Link>
                                </div>
                            </Col>
                            <Col sm={4} className='width-33-50'>
                                <div className='color-white font-16 bold-700 mb-3'>Resources</div>
                                <div className='footer-menu-item'>
                                    <Link to={env.DOCS_URL} target="_blank" className="font-14 color-gray none-text-line">Documentation</Link>
                                </div>
                                <div className='footer-menu-item'>
                                    <Link to="/#" className="font-14 color-gray none-text-line">Guide</Link>
                                </div>
                                {/* <div className='footer-menu-item'>
                                    <Link to={env.GITHUB_URL} target='_blank' className="font-14 color-gray none-text-line">Github</Link>
                                </div> */}
                            </Col>
                            <Col sm={4} className='width-33-100'>
                                <div className='color-white font-16 bold-700 mb-4'>Community</div>
                                <div className='footer-menu-item'>
                                    <div className="d-flex">
                                        <div>
                                            <a href={env.Twitter_URL} target="_blank" className='footer-social-item'><img src={TwitterIcon} width={18} /></a>
                                        </div>
                                        <div>
                                            <a href={env.Discord_URL} target="_blank" className='footer-social-item'><img src={DiscordIcon} width={18} /></a>
                                        </div>
                                        <div>
                                            <a href={env.DOCS_URL} target="_blank" className='footer-social-item'><img src={DocsIcon} width={18} /></a>
                                        </div>
                                        <div>
                                            <a href={env.MEDIUM_URL} target="_blank" className='footer-social-item'><img src={MediumIcon} width={18} /></a>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
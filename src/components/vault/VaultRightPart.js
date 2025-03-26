import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Info from '../Info'
import MintGdcForm from '../mint/MintGdcForm'
import modal_img1_url from "../../assets/img/modal_img1.svg"

export default function VaultRightPart() {
    const [amount, setAmount] = useState("")
    const [show, setShow] = useState(false)
    const [detailShow, setDetailShow] = useState(true)
    const [btnTitle, setBtnTitle] = useState("Hide")

    const [show1, setShow1] = useState(false)
    const [detailShow1, setDetailShow1] = useState(true)
    const [btnTitle1, setBtnTitle1] = useState("Hide")

    const detailShowHandler = () => {
        if (detailShow) {
            setBtnTitle("Show")
            setDetailShow(false)
        } else {
            setBtnTitle("Hide")
            setDetailShow(true)
        }
    }
    const detailShowHandler1 = () => {
        if (detailShow1) {
            setBtnTitle1("Show")
            setDetailShow1(false)
        } else {
            setBtnTitle1("Hide")
            setDetailShow1(true)
        }
    }
    const amountHandler = (e) => {
        if (!e.target.value) {
            return setAmount("")
        }
        if (e.target.value.match("^[0-9]+(\.[0-9]*)?$")) {
            setAmount(e.target.value)
        }
    }
    const openModal = () => {
        setShow(true)
    }
    const closeModal = () => {
        setShow(false)
    }
    const openModal1 = () => {
        setShow1(true)
    }
    const closeModal1 = () => {
        setShow1(false)
    }

    return (
        <div className="radius-8 bg-trans p-4">
            <div className='font-18 bold-600 color-white py-2'>Position Summary</div>
            <div>
                <hr className='hr-3 border-dark-green' />
            </div>
            <div className='border-dash radius-8 p-3 mt-4'>
                <div>
                    <Info content="Lorem ipsum dolor sit amet consectetur lorem" />
                    <span className='ml-10 font-14 bold-600 color-white'>Auto Compounding</span>
                </div>
                <div className='font-14 bold-300 color-white'>
                    As you earn yield on Gloop, most of it is taken and used to increase your collateral to constantly leverage you down.  This allows our users to constantly feel safer as they allow their wealth to grow.
                </div>
            </div>
            <div className='d-flex v-center space-between mt-3'>
                <div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Deposit</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem111" />
                    </div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Total Debt (1 IOU = $1)</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem222" />
                    </div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Collateral Ratio</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem3333" />
                    </div>
                </div>
                <div className='text-end'>
                    <div className='font-16 bold-700 color-white my-3'>
                        0 ETH
                    </div>
                    <div className='font-16 bold-700 color-white my-3'>
                        0 IOU
                    </div>
                    <div className='font-16 bold-700 color-white my-3'>
                        0 %
                    </div>
                </div>
            </div>
            <div>
                <hr className='hr-1 border-dark-green' />
            </div>
            <div className='d-flex v-center space-between mt-3'>
                <div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >[Token] Price</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem111" />
                    </div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Liquidation Price</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem222" />
                    </div>
                </div>
                <div className='text-end'>
                    <div className='font-16 bold-700 color-white my-3'>
                        $ 0
                    </div>
                    <div className='font-16 bold-700 color-white my-3'>
                        $ 0
                    </div>
                </div>
            </div>
            <div>
                <hr className='hr-1 border-dark-green' />
            </div>
            <div className='d-flex v-center space-between mt-3'>
                <div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Compounded Rewards</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem111" />
                    </div>
                </div>
                <div className='text-end'>
                    <div className='font-16 bold-700 color-white my-3'>
                        0 [Token]
                    </div>
                </div>
            </div>
            <div className='desktop-flex space-between'>
                <div className='width-100 p-1'>
                    <Button className='gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2 w-100' onClick={openModal}>Repay</Button>
                </div>
                <div className='width-100 p-1'>
                    <Button className='gloop-btn-second font-16 bold-700 radius-8 bg-trans-0 border-white color-white p-10-25 my-2 w-100' onClick={openModal1}>Supply</Button>
                </div>
            </div>
            <Modal show={show} onHide={closeModal} centered className='buy_gloop_modal'>
                <Modal.Body className='p-4 radius-8 bg-trans1 border-dark w-100'>
                    <div className='font-18 bold-600 color-white'>Repay Debt</div>
                    <div>
                        <hr className='hr-3 border-dark-green' />
                    </div>
                    <div className='radius-8 border-2 border-dark-green p-3 mt-4'>
                        <div className='d-flex space-between v-center'>
                            <div className='font-16 bold-700 color-white'>Details</div>
                            <div className='radius-8 bg-trans px-3 py-2 font-14 bold-700 color-white cursur-pointer' onClick={detailShowHandler}>{btnTitle}</div>
                        </div>
                        <div className={`d-flex v-center space-between mt-2 ${!detailShow ? "d-none" : ""}`}>
                            <div>
                                <div className='font-16 bold-300 color-gray my-2'>
                                    <span className='mr-10' >Debt</span>
                                    <Info content="Lorem ipsum dolor sit amet consectetur lorem11155" />
                                </div>
                                <div className='font-16 bold-300 color-gray my-2'>
                                    <span className='mr-10' >IOU in Stability Pool</span>
                                    <Info content="Lorem ipsum dolor sit amet consectetur lorem22266" />
                                </div>
                            </div>
                            <div className='text-end'>
                                <div className='font-16 bold-700 color-white my-2'>
                                    15,000  IOU
                                </div>
                                <div className='font-16 bold-700 color-white my-2'>
                                    5,000  IOU
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='font-14 bold-400 color-gray mt-4 mb-2'>Repay Debt</div>
                    <div>
                        <MintGdcForm />
                    </div>

                    <div className='d-flex v-center space-between mt-3'>
                        <div>
                            <div className='font-16 bold-300 color-gray my-2'>
                                <span className='mr-10' >Unstaked IOU</span>
                                <Info content="Lorem ipsum dolor sit amet consectetur lorem111" />
                            </div>
                            <div className='font-16 bold-300 color-gray my-2'>
                                <span className='mr-10' >Remaining Debt</span>
                                <Info content="Lorem ipsum dolor sit amet consectetur lorem111" />
                            </div>
                        </div>
                        <div className='text-end'>
                            <div className='font-16 bold-700 color-white my-2'>
                                0 IOU
                            </div>
                            <div className='font-16 bold-700 color-white my-2'>
                                0 IOU
                            </div>
                        </div>
                    </div>
                    <div className='desktop-flex space-between'>
                        <div className='width-100 p-1'>
                            <Button className='gloop-btn-second font-16 bold-700 radius-8 bg-trans-0 border-white color-white p-10-25 my-2 w-100 '>Get IOU</Button>
                        </div>
                        <div className='width-100 p-1'>
                            <Button className='gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2 w-100' onClick={openModal}>Repay</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={show1} onHide={closeModal1} centered className='buy_gloop_modal'>
                <Modal.Body className='p-4 radius-8 bg-trans1 border-dark w-100'>
                    <div className='font-18 bold-600 color-white'>Supply Trove</div>
                    <div>
                        <hr className='hr-3 border-dark-green' />
                    </div>
                    <div className='radius-8 border-2 border-dark-green p-3 mt-4'>
                        <div className='d-flex space-between v-center'>
                            <div className='font-16 bold-700 color-white'>Details</div>
                            <div className='radius-8 bg-trans px-3 py-2 font-14 bold-700 color-white cursur-pointer' onClick={detailShowHandler1}>{btnTitle}</div>
                        </div>
                        <div className={`d-flex v-center space-between mt-2 ${!detailShow1 ? "d-none" : ""}`}>
                            <div>
                                <div className='font-16 bold-300 color-gray my-2'>
                                    <span className='mr-10' >Current Deposit</span>
                                    <Info content="Lorem ipsum dolor sit amet consectetur lorem11155" />
                                </div>
                                <div className='font-16 bold-300 color-gray my-2'>
                                    <span className='mr-10' >Liquidation Price</span>
                                    <Info content="Lorem ipsum dolor sit amet consectetur lorem22266" />
                                </div>
                                <div className='font-16 bold-300 color-gray my-2'>
                                    <span className='mr-10' >Current Collateral Ratio</span>
                                    <Info content="Lorem ipsum dolor sit amet consectetur lorem22266" />
                                </div>
                            </div>
                            <div className='text-end'>
                                <div className='font-16 bold-700 color-white my-2'>
                                    0  GLP
                                </div>
                                <div className='font-16 bold-700 color-white my-2'>
                                    $0,00
                                </div>
                                <div className='font-16 bold-700 color-white my-2'>
                                    0%
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='font-14 bold-400 color-gray mt-4 mb-2'>Deposit</div>
                    <div className='radius-8 bg-trans p-3 mt-3 desktop-flex space-between v-center'>
                        <div className='d-flex v-center my-1'>
                            <img src={modal_img1_url} width={29} className='mr-10' /><span className='font-18 bold-700 color-white mr-10'>0</span><span className='font-18 bold-400 color-gray mr-10'>GLP</span>
                        </div>
                        <div className='my-2 border-1 border-green1 color-green1 radius-8 text-center p-2 collateral_ratio'>
                            Collateral Ratio: 151.1%
                        </div>
                    </div>
                    <div className='d-flex v-center space-between mt-3'>
                        <div>
                            <div className='font-16 bold-300 color-gray my-2'>
                                <span className='mr-10' >New Liquidation Price (ETH)</span>
                                <Info content="Lorem ipsum dolor sit amet consectetur lorem111" />
                            </div>
                            <div className='font-16 bold-300 color-gray my-2'>
                                <span className='mr-10' >New Deposit Size</span>
                                <Info content="Lorem ipsum dolor sit amet consectetur lorem111" />
                            </div>
                        </div>
                        <div className='text-end'>
                            <div className='font-16 bold-700 color-white my-2'>
                                $ 1,116.50
                            </div>
                            <div className='font-16 bold-700 color-white my-2'>
                                0 GLP
                            </div>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <Button className='gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2 w-100'>Supply</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
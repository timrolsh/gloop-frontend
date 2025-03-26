import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Info from '../Info';
import vault_img8_url from "../../assets/img/vault_img8.svg";
import vault_img9_url from "../../assets/img/vault_img9.svg";
import gmi_img8_url from "../../assets/img/gmi_img8.svg";
import FromVault from './FromVault';
import ToVault from './ToVault';

export default function VaultLeftPart(props) {
    const [amount, setAmount] = useState("");
    const [show, setShow] = useState(false);
    const [detailShow, setDetailShow] = useState(true);
    const [btnTitle, setBtnTitle] = useState("Hide");
    const [replace, setReplace] = useState(true);

    const amountHandler = (e) => {
        if (!e.target.value) {
            return setAmount("");
        }
        if (e.target.value.match("^[0-9]+(\.[0-9]*)?$")) {
            setAmount(e.target.value);
        }
    }
    const detailShowHandler = () => {
        if(detailShow) {
            setBtnTitle("Show");
            setDetailShow(false)
        } else {
            setBtnTitle("Hide");
            setDetailShow(true)
        }
    }
    const openModal = () => {
        setShow(true);
    }
    const closeModal = () => {
        setShow(false);
    }

    return (
        <div className="radius-8 bg-trans p-4">
            <div className='d-flex v-center space-between'>
                <div className='font-18 bold-600 color-white'>Borrow</div>
                <div className='font-16 bold-700 color-white bg-trans radius-8 py-2 px-3'>20% APY</div>
            </div>
            <div>
                <hr className='hr-3 border-dark-green'/>
            </div>
            <div className='border-dash radius-8 p-3 mt-4'>
                <div>
                    <Info content="Lorem ipsum dolor sit amet consectetur lorem"/>
                    <span className='ml-10 font-14 bold-600 color-white'>IOU</span>
                </div>
                <div className='font-14 bold-300 color-white'>
                    The IOU token has a value of $1 of debt within the system and can't be traded outside Gloop. You can use it to mint our stablecoin (GDC) or you can deposit it a stability pool to get liquidation benefits.
                </div>
            </div>
            <div className='font-14 bold-300 color-gray mt-4'>
                ETH Deposit
            </div>
            <div className='radius-8 bg-trans p-3 mt-3 desktop-flex space-between v-center'>
                <div className='w-25-100 d-flex v-center my-1'>
                    <img src={props.asset_url} width={29} className='mr-10 rounded-circle'/><span className='font-18 bold-700 color-white mr-10'>20</span>
                    <Button className='max-btn font-12 bold-300 color-gray radius-8 border-gray border-1 p-2 mobile-show'>MAX</Button>
                </div>
                <div className='w-75-100 desktop-flex v-center flex-end my-2'>
                    <div className='mr-10'>
                        <input type="text" placeholder='Balance: [Amount]' className='buy_gloop_inputs' value={amount} onChange={(e) => amountHandler(e)} />
                    </div>
                    <Button className='max-btn font-12 bold-300 color-gray radius-8 border-gray border-1 p-2 desktop-show'>MAX</Button>
                </div>
            </div>
            <div className='font-14 bold-300 color-gray mt-4'>
                Borrowed Amount (1 IOU = $1)
            </div>
            <div className='radius-8 bg-trans p-3 mt-3 desktop-flex space-between v-center'>
                <div className='d-flex v-center my-1'>
                    <img src={vault_img9_url} width={29} className='mr-10'/><span className='font-18 bold-700 color-white mr-10'>20,000</span><span className='font-18 bold-400 color-gray mr-10'>IOU</span>
                </div>
                <div className='my-2 border-1 border-green1 color-green1 radius-8 text-center p-2 collateral_ratio'>
                    Collateral Ratio: 151.1%
                </div>
            </div>
            <div className='d-flex v-center space-between mt-3'>
                <div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Liquidation Reserve</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem111"/>
                    </div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Borrowing Fee</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem222"/>
                    </div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Total Debt</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem3333"/>
                    </div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Liquidation Price (ETH)</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem3333"/>
                    </div>
                </div>
                <div className='text-end'>
                    <div className='font-16 bold-700 color-white my-3'>
                        200 IOU
                    </div>
                    <div className='font-16 bold-700 color-white my-3'>
                        100 IOU <span className='font-12 bold-400 color-gray'>(0.50%)</span>
                    </div>
                    <div className='font-16 bold-700 color-white my-3'>
                        20,300.00 IOU
                    </div>
                    <div className='font-16 bold-700 color-white my-3'>
                        $ 1,116.50
                    </div>
                </div>
            </div>
            <div className='mt-2'>
                <Button className='gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2 w-100' onClick={openModal}>Borrow</Button>
            </div>
            <Modal show={show} onHide={closeModal} centered className='buy_gloop_modal'>
                <Modal.Body className='p-4 radius-8 bg-trans1 border-dark w-100'>
                    <div className='d-flex v-center space-between'>
                        <div className='d-flex v-center'>
                            <span className='font-18 bold-600 color-white mr-10'>IOU Utilization</span>
                            <Info content="Lorem ipsum dolor sit amet consectetur lorem11155"/>
                        </div>
                        <div className='font-16 bold-700 color-white radius-8 bg-trans desktop-show p-2'><span className='bold-400 color-gray'>Balance →</span> 50,000  IOU</div>
                    </div>
                    <div>
                        <hr className='hr-3 border-dark-green'/>
                    </div>
                    <div className='radius-8 border-2 border-dark-green p-3 mt-4'>
                        <div className='d-flex space-between v-center'>
                            <div className='font-16 bold-700 color-white'>Stability Pool Details</div>
                            <div className='radius-8 bg-trans px-3 py-2 font-14 bold-700 color-white cursur-pointer' onClick={detailShowHandler}>{btnTitle}</div>
                        </div>
                        <div className={`d-flex v-center space-between mt-2 ${ !detailShow ? "d-none" : ""}`}>
                            <div>
                                <div className='font-16 bold-300 color-gray my-2'>
                                    <span className='mr-10' >Liquidation Bonus</span>
                                    <Info content="Lorem ipsum dolor sit amet consectetur lorem11155"/>
                                </div>
                                <div className='font-16 bold-300 color-gray my-2'>
                                    <span className='mr-10' >Gloop APR</span>
                                    <Info content="Lorem ipsum dolor sit amet consectetur lorem22266"/>
                                </div>
                            </div>
                            <div className='text-end'>
                                <div className='font-16 bold-700 color-white my-2'>
                                    X %
                                </div>
                                <div className='font-16 bold-700 color-white my-2'>
                                    X %
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='font-14 bold-400 color-gray mt-4 mb-2'>IOU Deposit</div>
                    <div>
                        {
                            replace ? (
                                <FromVault/>
                            ) : (
                                <ToVault/>
                            )
                        }
                    </div>
                    <div className='text-center btn-swap'>
                        <img src={gmi_img8_url} width={48} className='cursur-pointer' onClick={()=>setReplace(!replace)}/>
                    </div>
                    <div>
                        {
                            replace ? (
                                <ToVault/>
                            ) : (
                                <FromVault/>
                            )
                        }
                    </div>
                    <div className='d-flex v-center space-between mt-3'>
                        <div>
                            <div className='font-16 bold-300 color-gray my-2 '>
                                <span className='mr-10' >GDC Price</span>
                                <Info content="Lorem ipsum dolor sit amet consectetur lorem111"/>
                            </div>
                            <div className='font-16 bold-300 color-gray my-2 v-center d-flex'>
                                <span className='mr-10' >GDC Minting Ratio</span>
                                <Info content="Lorem ipsum dolor sit amet consectetur lorem111"/>
                            </div>
                            <div className='font-16 bold-300 color-gray my-2 v-center d-flex'>
                                <span className='mr-10' >GLOOP Burned</span>
                                <Info content="Lorem ipsum dolor sit amet consectetur lorem111"/>
                            </div>
                            <div className='font-16 bold-300 color-gray my-2 v-center d-flex'>
                                <span className='mr-10' >Stability Pool Deposit</span>
                                <Info content="Lorem ipsum dolor sit amet consectetur lorem111"/>
                            </div>
                            <div className='font-16 bold-300 color-gray my-2 v-center d-flex'>
                                <span className='mr-10' >Stability Pool Share</span>
                                <Info content="Lorem ipsum dolor sit amet consectetur lorem111"/>
                            </div>
                        </div>
                        <div className='text-end'>
                            <div className='font-16 bold-700 color-white my-2'>
                                $1.00
                            </div>
                            <div className='font-16 bold-700 color-white my-2'>
                                100%
                            </div>
                            <div className='font-16 bold-700 color-white my-2'>
                                0 <span className='bold-400 color-gray'>($0)</span>
                            </div>
                            <div className='font-16 bold-700 color-white my-2'>
                                0 IOU
                            </div>
                            <div className='font-16 bold-700 color-white my-2'>
                                0  %
                            </div>
                        </div>
                    </div> 
                    <div className='mt-2'>
                        <Button className='gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2 w-100'>Confirm</Button>
                    </div> 
                </Modal.Body>
            </Modal>
        </div>
    )
}
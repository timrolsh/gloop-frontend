import React, { useState,useEffect} from 'react';
import Info from '../Info';
import { Button, Modal } from 'react-bootstrap';
import gloop_img5_url from "../../assets/img/gloop_img5.svg";

export default function GloopLeftPart() {
    const [show, setShow] = useState(false);
    const [amount, setAmount] = useState("");

    const amountHandler = (e) => {
        if (!e.target.value) {
            return setAmount("");
        }
        if (e.target.value.match("^[0-9]+(\.[0-9]*)?$")) {
            setAmount(e.target.value);
        }
    }
    const openModal = () => {
        setShow(true);
    }
    const closeModal = () => {
        setShow(false);
    }
    useEffect(() => {
    }, []);

    return (
        <div className="radius-8 bg-trans p-4 min-h-500">
            <div className='font-18 bold-600 color-white'>Contribute</div>
            <div>
                <hr className='hr-3 border-dark-green'/>
            </div>
            <div className='d-flex v-center space-between'>
                <div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >WL Allocation</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem111"/>
                    </div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >GBC Allocation</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem222"/>
                    </div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >High Tier Allocation</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem3333"/>
                    </div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Max Contribution</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem3333"/>
                    </div>
                </div>
                <div className='text-end'>
                    <div className='font-16 bold-700 color-white my-3'>
                        1
                    </div>
                    <div className='font-16 bold-700 color-white my-3'>
                        10
                    </div>
                    <div className='font-16 bold-700 color-white my-3'>
                        0
                    </div>
                    <div className='font-16 bold-700 color-white my-3'>
                        60,000 USDC
                    </div>
                </div>
            </div>
            <div>
                <hr className='hr-1 border-dark-green'/>
            </div>
            <div className='d-flex v-center space-between'>
                <div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Current Contribution</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem44"/>
                    </div>
                    <div className='font-16 bold-300 color-gray my-3 d-flex'>
                        <span className='mr-10' >Gloop Tokens</span>
                        <Info content="Lorem ipsum dolor sit amet consectetur lorem55"/>
                    </div>
                </div>
                <div>
                    <div className='font-16 bold-700 color-white my-3'>
                        5,000 USDC
                    </div>
                    <div className='font-16 bold-700 color-white my-3'>
                        416,666.667
                    </div>
                </div>
            </div>
            <div className='desktop-flex space-between'>
                <div className='width-100 p-1'>
                    <Button className='gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2 w-100' onClick={openModal}>Buy Gloop</Button>
                </div>
                <div className='width-100 p-1'>
                    <Button className='font-16 bold-700 radius-8 bg-trans-0 border-white color-white p-10-25 my-2 w-100 opacity-20'>Claim</Button>
                </div>
            </div>
            <Modal show={show} onHide={closeModal} centered className='buy_gloop_modal'>
                <Modal.Body className='p-4 radius-8 bg-trans1 border-dark w-100'>
                    <div className='font-18 bold-600 color-white'>Buy GLOOP</div>
                    <div>
                        <hr className='hr-3 border-dark-green'/>
                    </div>
                    <div className='font-14 bold-400 color-gray'>USDC Deposit</div>
                    <div className='radius-8 bg-trans p-3 mt-2 desktop-flex space-between v-center'>
                        <div className='w-25-100 d-flex v-center my-1'>
                            <img src={gloop_img5_url} width={29} className='mr-10'/><span className='font-18 bold-700 color-white mr-10'>0</span><span className='font-18 bold-400 color-gray mr-10'> USDC</span>
                            <Button className='max-btn font-12 bold-300 color-gray radius-8 border-gray border-1 p-2 mobile-show'>MAX</Button>
                        </div>
                        <div className='w-75-100 desktop-flex v-center flex-end my-2'>
                            <div className='mr-10'>
                                <input type="text" placeholder='Balance: [Amount]' className='buy_gloop_inputs' value={amount} onChange={(e) => amountHandler(e)} />
                            </div>
                            <Button className='max-btn font-12 bold-300 color-gray radius-8 border-gray border-1 p-2 desktop-show'>MAX</Button>
                        </div>
                    </div>
                    <div className='d-flex v-center space-between'>
                        <div>
                            <div className='font-16 bold-300 color-gray my-3'>
                                <span className='mr-10' >Gloop Acquired</span>
                                <Info content="Lorem ipsum dolor sit amet consectetur lorem111"/>
                            </div>
                        </div>
                        <div className='text-end'>
                            <div className='font-16 bold-700 color-white my-3'>
                                0 GLOOP
                            </div>
                        </div>
                    </div> 
                    <div className='mt-2'>
                        <Button className='gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2 w-100'>Buy</Button>
                    </div>   
                </Modal.Body>
            </Modal> 
        </div>
    )
}
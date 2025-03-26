
import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

import WalletBox from '~/components/onboarding/WalletBox'
import InviteBox from '~/components/onboarding/InviteBox'

export function ConnectWalletModal({ onClose = () => { } }) {

  return (
    <Modal show={true} onHide={onClose} centered className='wallet_connect_modal'>
      <Modal.Body className='py-5 px-3 radius-8 bg-black border-dark w-100 position-relative'>
        <div onClick={onClose} className='close-btn'>X</div>
        <div className='my-5'>
          <div className='text-center mb-4'>
            <div className='font-52 color-white bold-600'>Want to join the <span className='color-green'>Gloopers?</span></div>
            <div className='font-16 color-white bold-400 mt-3'>Begin your farming journey by completing the quests below.</div>
          </div>
          <div className='my-3'>
            <WalletBox onDisconnect={onClose} />
          </div>
          <div className='my-3'>
            <InviteBox />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

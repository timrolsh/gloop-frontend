import { useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap'
import close_img_url from "../../assets/img/close.svg"
import useAddReferrer from '~/stores/server/core/useAddReferrer'
import AsyncButton from '../AsyncButton'

import market_info from '../../assets/img/market-info.svg'
import useUserStore from '~/stores/client/user'

export default function AddReferral({ onClose = () => { } }) {
  const { mutate: redeem } = useAddReferrer()

  const userWalletAddress = useUserStore(state => state.walletAddress)

  const [redeemButtonLoading, setRedeemButtonLoading] = useState(false)
  const [referralWalletAddress, setReferralWalletAddress] = useState('')

  const handleReedem = () => {
    setRedeemButtonLoading(true)

    redeem(referralWalletAddress, {
      onSettled: () => {
        setRedeemButtonLoading(false)
      },
      onSuccess: () => {
        onClose()
        setReferralWalletAddress('')
      }
    })
  }

  const redeemButtonDisabledReason = useMemo(() => {

    if (!referralWalletAddress)
      return 'Please Fill Referrer’s Wallet Address'

    if (referralWalletAddress.length < 32)
      return 'Referrer’s Wallet Address Should Be Atleast 32 Characters'

    if (referralWalletAddress === userWalletAddress)
      return `Address can't Be It's Own Referrer`

  }, [referralWalletAddress])


  return (
    <Modal show={true} onHide={onClose} centered className='buy_gloop_modal'>
      <Modal.Body className='px-3 radius-8 bg-trans1 border-dark w-100' style={{ height: '340px' }}>
        <div ><img src={close_img_url} width={10} className='invite_modal_close' onClick={onClose} /></div>

        <div className='d-flex flex-column space-between h-100'>
          <div className='font-18 bold-500 color-white text-center'>Enter Referrer’s Wallet Address</div>


          <div className=' loop-info'>
            <div className='title'>
              <img src={market_info} width={14} className='me-2' />
              Referrer</div>
            <div className='mt-2'>Only one referrer can be set per address and is then forever locked. An address cannot be its own referrer.</div>
          </div>

          <div style={{ padding: '8px 18px' }} className='radius-8 bg-trans desktop-flex space-between v-center'>
            <input
              type="text"
              className={`buy_gmi_input flex-grow-1 font-18 bold-700 color-white mr-10`}
              value={referralWalletAddress}
              onChange={(e) => setReferralWalletAddress(e.target.value)}
              placeholder='Enter Wallet Address'
            />
          </div>

          {/* <OTPInput numberOfDigits={5} onOtpChange={setReferralWalletAddress} /> */}
          <div className='mt-2 text-center'>
            <AsyncButton onClick={handleReedem} loading={redeemButtonLoading} disabledreason={redeemButtonDisabledReason}>Add</AsyncButton>
          </div>
        </div>

      </Modal.Body>
    </Modal>
  )
}
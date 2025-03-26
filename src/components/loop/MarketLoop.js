import { useState } from 'react'
import { Button } from 'react-bootstrap'
import gloop_img9_url from "../../assets/img/gmi_img9.svg"
import market_info from '../../assets/img/market-info.svg'
import link_redirect from '../../assets/img/link-redirect.svg'
import dropdown_img from '../../assets/img/dropdown.svg'
import warning_market from '../../assets/img/warning-market.svg'
import WheelRange from './LevrageWheel'

export default function MarketLoop() {
  const [informationVisible, setInformationVisible] = useState(false)
  const [amount, setAmount] = useState("")
  const [leverageValue, setLeverageValue] = useState(5)
  const [depositAsset, setDepositAsset] = useState({
    image: gloop_img9_url,
    title: 'GMI',
    amount: '$1.02',
    maxApy: '100'
  })

  const amountHandler = (e) => {
    if (!e.target.value) {
      return setAmount("")
    }
    if (e.target.value.match("^[0-9]+(\.[0-9]*)?$")) {
      setAmount(e.target.value)
    }
  }

  return (
    <div className='market-loop'>
      <div className='mt-2 loop-info'>
        <div className='title'>
          <img src={market_info} width={14} className='me-2' />
          Loop!</div>
        <div className='mt-2'>Boost your yield by leveraging up to 10x. This feature automates the deposit and borrowing cycles until your targeted APY is reached.</div>
      </div>
      <div className='mt-4'>
        <div className='loop-input-title mb-2'>
          Market
        </div>
      </div>
      <div className='mt-4'>
        <div className='loop-input-title'>
          <span>Deposit</span>
          <span className='link-title'>Get {depositAsset.name}
            <img src={link_redirect} width={10} className='ms-1' />
          </span>
        </div>
        <div style={{ padding: '8px 18px' }} className='radius-8 bg-trans mt-2 desktop-flex space-between v-center'>
          <div className='w-25-100 d-flex v-center my-1'>
            <img src={depositAsset.image} width={29} className='mr-10' /><span className='font-18 bold-700 color-white mr-10'>0</span><span className='font-18 bold-400 color-gray mr-10'> {depositAsset.name}</span>
          </div>
          <div className='w-75-100 d-flex v-center flex-end my-2'>
            <div className='mr-10'>
              <input type="text" placeholder='Balance: 0' className='buy_gmi_input' value={amount} onChange={(e) => amountHandler(e)} />
            </div>
            <Button className='max-btn market font-12 bold-300 color-gray radius-4 border-gray border-1 px-1 py-1'>
              <span>MAX</span>
            </Button>
          </div>
        </div>
        <div className='no-balance-alert'>
          <span>
            <img src={warning_market} width={20} className='me-3' />
            No {depositAsset.name} balance.</span>{' '}
          <span className='get-gmi-link'>Get {depositAsset.name} Now</span>
        </div>
      </div>
      <div className='mt-4'>
        <div className='loop-input-title d-flex space-between mb-2'>
          <span>Leverage</span>
          <span className='leverage-value'>{leverageValue}x</span>
        </div>
        <WheelRange minValue={1.25} maxValue={10} initialValue={5} onChange={(val) => setLeverageValue(val)} />
      </div>
      <div className="mt-4 border-line"></div>
      <div className="information-card mt-4">
        <div className="toggler-bar" onClick={() => setInformationVisible(!informationVisible)}>
          <div>Informations</div>
          <div className='d-flex align-items-center' style={{ gap: '10px' }}>
            <div className='apy-rate'>50% APY</div>
            <img src={dropdown_img} width={13} className={`dropdown-icon ${informationVisible && 'rotate-180'}`} />
          </div>
        </div>
        {informationVisible && (
          <div className='mt-4'>
            <div className='information-detail-title'>Position</div>
            <div className='border-line my-3'></div>
            <div className='information-detail-items'>
              <div className='d-flex justify-content-between'>
                <span className='detail-title'>Health Factor</span>
                <span className='detail-value text-loop-primary'>0</span>
              </div>
              <div className='d-flex justify-content-between'>
                <span className='detail-title'>Deposit</span>
                <span className='detail-value'>0.00 GMI </span>
              </div>
              <div className='d-flex justify-content-between'>
                <span className='detail-title'>USDC Borrowed</span>
                <span className='detail-value'>$0.00</span>
              </div>
              <div className='d-flex justify-content-between'>
                <span className='detail-title'>Position Value</span>
                <span className='detail-value'>$0</span>
              </div>
              <div className='d-flex justify-content-between'>
                <span className='detail-title'>Est. Liquidation Price</span>
                <span className='detail-value'>$0.5</span>
              </div>
              <div className='d-flex justify-content-between'>
                <span className='detail-title'>Total Debt</span>
                <span className='detail-value'>0 USDC</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Button className='loop-btn-second mt-4 font-16 bold-700 radius-8 text-black p-10-25 my-1 w-100'>Loop It!</Button>
    </div>
  )
}
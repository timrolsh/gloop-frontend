import { useMemo, useState } from 'react'
import { Button } from 'react-bootstrap'
import usePortfolioStore from '~/stores/client/portfolio'
import { truncateAmount } from '~/utils/ui'

import env from '~/env'
import { createBigNumber } from '~/utils/math'

import Skeleton from '~/components/Skeleton'
import CollateralSwitch from '../collateral/CollateralSwtich'
import PositionWithdrawModal from './PositionWithdrawModal'
import PositionRepayDebtModal from './PositionRepayDebtModal'
import useBorrowStore from '~/stores/client/borrow'

// images
import back_img_url from '~/assets/img/back-icon.svg'
import AsyncButton from '../AsyncButton'
import PositionDepositModal from './PositionDepositModal'
import useGetConfigurations from '~/stores/server/core/useGetConfigurations'
import HealthFactor from '../health-factor/HealthFactor'

export default function PositionSingle() {

  const selectedPosition = usePortfolioStore((state) => state.selectedPosition)
  const setSelectedPosition = usePortfolioStore((state) => state.setSelectedPosition)
  const setActiveTab = useBorrowStore((state) => state.setActiveTab)
  const setSelectedMarket = useBorrowStore((state) => state.setSelectedMarket)

  const { data: configurationData, isLoading: isLoadingConfiguration } = useGetConfigurations({ token: selectedPosition })

  const LTV = configurationData?.lendFactor * 100

  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [depositVisible, setDepositVisible] = useState(false)
  const [repayVisible, setRepayVisible] = useState(false)

  const handleRedirectToBorrow = () => {
    setSelectedMarket(selectedPosition)
    setActiveTab('market')
  }

  const withdrawButtonDisabledReason = useMemo(() => {

    if (selectedPosition.userPoolBalance === env.EMPTY_VALUE)
      return 'Failed to Fetch Balance'

    if (createBigNumber(selectedPosition.userPoolBalance).lte(0))
      return 'Insufficient Funds'

  }, [selectedPosition.userPoolBalance])

  const repayButtonDisabledReason = useMemo(() => {

    if (selectedPosition.userBorrows === env.EMPTY_VALUE)
      return 'Failed to Fetch Borrow Amount'

    if (createBigNumber(selectedPosition.userBorrows).lte(0))
      return "Your Debt is 0"

  }, [selectedPosition.userBorrows])

  const collateralMode = useMemo(() => {
    return !['USDC'].includes(selectedPosition.name)
  }, [selectedPosition])

  const positionValue = useMemo(() => {

    if (selectedPosition.userPoolBalance === env.EMPTY_VALUE)
      return env.EMPTY_VALUE

    if (selectedPosition.price === env.EMPTY_VALUE)
      return `${truncateAmount(selectedPosition.userPoolBalance)} ${selectedPosition.name}`

    return `$${truncateAmount(createBigNumber(selectedPosition.price).mul(selectedPosition.userPoolBalance).toString(), 2)}`

  }, [selectedPosition])

  const borrowValue = useMemo(() => {

    if (selectedPosition.userBorrows === env.EMPTY_VALUE)
      return env.EMPTY_VALUE

    if (selectedPosition.price === env.EMPTY_VALUE)
      return `${truncateAmount(selectedPosition.userBorrows.toString())} ${selectedPosition.name}`

    return `$${truncateAmount(createBigNumber(selectedPosition.price).mul(selectedPosition.userBorrows).toString(), 2)}`

  }, [selectedPosition])

  return (
    <>
      <div className=''>
        <div className='font-18 bold-600 color-white py-2 cursor-pointer' onClick={() => setSelectedPosition(null)}>
          <img src={back_img_url} width={14} className='me-2' />
          Back</div>
        <div>
          <hr className='hr-3 border-dark-green' />
        </div>
        <div className="information-card position-information-card mt-4">
          <div className="align-items-center">
            <div className='d-flex align-items-center' style={{ gap: '10px' }}>
              <img src={selectedPosition.image} width={37} className='mr-8 to_gmi_dropdown_btn' />
              <div className='font-18 bold-700 color-white to_gmi_dropdown_btn1'>{selectedPosition.name}</div>
              <div className='info-price' title={selectedPosition.price}>${truncateAmount(selectedPosition.price, 2)}</div>
            </div>
            {/* <div className='d-flex align-items-center' style={{ gap: '10px' }}>
              <div className='apy-rate'>{selectedPosition.apy}% APY</div>
            </div> */}
          </div>
          <div className='mt-3'>
            <div className='border-line-position mb-4'></div>
            <div className='information-detail-items'>
              {
                collateralMode
                  ? <>
                    <div className='d-flex justify-content-between'>
                      <span className='detail-title'>Total Deposited</span>
                      <Skeleton loading={selectedPosition.userPoolBalance === env.EMPTY_VALUE} width='100px' height='auto'>
                        <span className='detail-value text-loop-primary' title={`${selectedPosition.userPoolBalance}`}>+{truncateAmount(selectedPosition.userPoolBalance, 2)} {selectedPosition.name}</span>
                      </Skeleton>
                    </div>
                    <div className='d-flex justify-content-between'>
                      <span className='detail-title'>Position Value</span>
                      <Skeleton loading={positionValue === env.EMPTY_VALUE} width='100px' height='auto'>
                        <span className='detail-value' >{positionValue}</span>
                      </Skeleton>
                    </div>
                    <div className='d-flex justify-content-between'>
                      <span className='detail-title'>Health Factor</span>
                      <HealthFactor increase={false} amount='0' token={{ address: env.USDC_TOKEN_ADDRESS, name: 'USDC' }} />
                    </div>
                    <div className='d-flex justify-content-between'>
                      <span className='detail-title'>LTV (Loan-To-Value)</span>
                      <Skeleton loading={isLoadingConfiguration} width='100px' height='auto'>
                        <span className='detail-value text-loop-primary'>{truncateAmount(LTV, 2)}%</span>
                      </Skeleton>
                    </div>
                    <div className='d-flex justify-content-between'>
                      <span className='detail-title'>Collateral</span>
                      <CollateralSwitch className='detail-value' token={selectedPosition} />
                    </div>
                  </>
                  :
                  <>
                    <div className='d-flex justify-content-between'>
                      <span className='detail-title'>Total Borrowed</span>
                      <Skeleton loading={selectedPosition.userBorrows === env.EMPTY_VALUE} width='100px' height='auto'>
                        <span className='detail-value text-loop-primary' title={`${selectedPosition.userBorrows.toString()}`}>+{truncateAmount(selectedPosition.userBorrows.toString())} {selectedPosition.name}</span>
                      </Skeleton>
                    </div>
                    <div className='d-flex justify-content-between'>
                      <span className='detail-title'>Borrow Value</span>
                      <Skeleton loading={borrowValue === env.EMPTY_VALUE} width='100px' height='auto'>
                        <span className='detail-value' >{borrowValue}</span>
                      </Skeleton>

                    </div>
                    <div className='d-flex justify-content-between'>
                      <span className='detail-title'>Health Factor</span>
                      <HealthFactor increase={false} amount='0' token={{ address: env.USDC_TOKEN_ADDRESS, name: 'USDC' }} />
                    </div>
                  </>
              }

            </div>
          </div>
          <div className='mt-4 d-flex'>
            {
              collateralMode
                ? <>
                  <AsyncButton disabledreason={withdrawButtonDisabledReason} className='gloop-btn-second font-16 bold-700 radius-8 bg-trans-0 border-white text-white color-white p-10 my-1 w-100 me-1' onClick={() => setWithdrawVisible(true)}>Withdraw</AsyncButton>
                  <Button className='loop-btn-second font-16 bold-700 radius-8 text-black p-10 my-1 w-100 ms-1' onClick={() => setDepositVisible(true)}>Deposit</Button>
                </>
                : <>
                  <Button className='gloop-btn-second font-16 bold-700 radius-8 bg-trans-0 border-white color-white p-10 my-1 w-100 me-1' onClick={handleRedirectToBorrow}>Borrow</Button>
                  <AsyncButton disabledreason={repayButtonDisabledReason} className='loop-btn-second font-16 bold-700 radius-8 text-black p-10 my-1 w-100 ms-1' onClick={() => setRepayVisible(true)}>Repay Debt</AsyncButton>
                </>
            }
          </div>
        </div>
      </div>

      {/* Position Withdraw Modal */}
      {withdrawVisible && <PositionWithdrawModal position={selectedPosition} onClose={() => setWithdrawVisible(false)} />}

      {/* Position Deposit Modal */}
      {depositVisible && <PositionDepositModal position={selectedPosition} onClose={() => setDepositVisible(false)} />}

      {/* Position Repay Debt Modal */}
      {repayVisible && <PositionRepayDebtModal position={selectedPosition} onClose={() => setRepayVisible(false)} />}


    </>
  )
}
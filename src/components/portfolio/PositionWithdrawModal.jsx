import { useMemo, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

import env from '~/env'
import { ValidationException } from '~/consts/exceptions'

import { createBigNumber } from '~/utils/math'
import { truncateAmount } from '~/utils/ui'

import useGetTotalBorrows from '~/stores/server/borrow/useGetTotalBorrows'
import useLendWithdraw from '~/stores/server/lend/useLendWithdraw'

import Skeleton from '../Skeleton'
import PriceInput from '../PriceInput'
import AsyncButton from '../AsyncButton'
import useGetTokensList from '~/stores/server/core/useGetTokensList'
import HealthFactor from '../health-factor/HealthFactor'
import market_info from '../../assets/img/market-info.svg'
import useGetHypotheticalHealthFactor from '~/stores/server/core/useGetHypotheticalHealthFactor'
import useGetMaxWithdrawal from '~/stores/server/borrow/useGetMaxWithdrawal'

export default function PositionWithdrawModal({ position, onClose = () => { } }) {

  const [withdrawDetaiVisible, setWithdrawDetailVisible] = useState(true)
  const [amount, setAmount] = useState("")
  const [buttonLoading, setButtonLoading] = useState(false)

  const tokenListQuery = useGetTokensList({})
  const { mutate: withdraw } = useLendWithdraw({ token: position })
  const totalBorrowsQuery = useGetTotalBorrows({})

  const newHealthFactorQuery = useGetHypotheticalHealthFactor({ token: position, collAmount: amount, collIncrease: false })
  const maxWithdrawAbleQuery = useGetMaxWithdrawal({ token: position })

  const handleMaxClicked = () => {
    setAmount(maxWithdrawAbleQuery.data?.toString() || '0')
  }

  const handleWithdraw = () => {

    if (!amount)
      return new ValidationException('Fill Withdraw Amount First')

    if (createBigNumber(amount.toString()).gt(maxWithdrawAbleQuery.data?.toString() || '0'))
      return new ValidationException('Withdraw Amount Is Greater than Available To Withdraw Amount')

    if (createBigNumber(newHealthFactorQuery.data).lt(100))
      return 'Withdraw is not allowed due to low Health Factor.'

    setButtonLoading(true)

    withdraw(amount, {
      onSettled: () => {
        setButtonLoading(false)
      },
      onSuccess: () => {
        setAmount('')
        onClose()
      }
    })
  }

  const size = useMemo(() => {

    if (position.userPoolBalance === env.EMPTY_VALUE)
      return env.EMPTY_VALUE

    let size = `${truncateAmount(position.userPoolBalance)} ${position.name}`

    if (position.price !== env.EMPTY_VALUE) {
      const sizeInUSD = createBigNumber(position.price).mul(position.userPoolBalance).toString()
      size += ` (≈$${truncateAmount(sizeInUSD, 2)})`
    }

    return size

  }, [position.userPoolBalance])

  const remainingSize = useMemo(() => {

    if (position.userPoolBalance === env.EMPTY_VALUE)
      return env.EMPTY_VALUE

    let wantToWithdraw = 0

    if (amount && parseFloat(amount) !== 0)
      wantToWithdraw = amount

    let remaining = createBigNumber(position.userPoolBalance).minus(wantToWithdraw).toString()
    remaining = createBigNumber(remaining).lt(0) ? 0 : remaining

    let returnValue = `${truncateAmount(remaining)} ${position.name}`

    if (position.price !== env.EMPTY_VALUE) {
      const remainingInUSD = createBigNumber(position.price).mul(remaining).toString()
      returnValue += ` (≈$${truncateAmount(remainingInUSD, 2)})`
    }

    return returnValue

  }, [position.userPoolBalance, amount])

  const buttonDisabledReason = useMemo(() => {

    if (!amount || createBigNumber(amount).lte(0))
      return 'Fill Withdraw Amount First'

    if (maxWithdrawAbleQuery.isLoading)
      return 'Calculating Max Withdrawal...'

    if (createBigNumber(amount.toString()).gt(maxWithdrawAbleQuery.data.toString() || '0'))
      return 'Requested Amount Is Greater Than Max Allowed'

    if (newHealthFactorQuery.isLoading)
      return 'Calculating Health Factor...'

    if (createBigNumber(newHealthFactorQuery.data).lt(100))
      return 'Withdraw is not allowed due to low Health Factor.'

  }, [amount, maxWithdrawAbleQuery, newHealthFactorQuery])

  return (
    <Modal show={true} onHide={onClose} centered className='buy_gloop_modal' dialogClassName='modal-custom-size'>
      <Modal.Body className='p-4 radius-8 bg-trans1 border-dark w-100'>
        <div className='font-18 bold-600 color-white'>Withdraw</div>
        <div>
          <hr className='hr-3 border-dark-green' />
        </div>

        <div className='mt-4 mb-4 loop-info'>
          <div className='title'>
            <img src={market_info} width={14} className='me-2' />
            Withdraw</div>
          <div className='mt-2'>Withdrawing collateral with an active borrow position can impact Health Factor. See the Details section to make sure your Health Factor remains above 100%</div>
        </div>

        <div className='radius-8 border-2 border-dark-green p-3 mt-4'>
          <div className='d-flex space-between v-center'>
            <div className='font-16 bold-700 color-white'>Details</div>
            <div className='radius-8 bg-trans px-3 py-2 font-14 bold-700 color-white cursur-pointer' onClick={() => setWithdrawDetailVisible(!withdrawDetaiVisible)}>{withdrawDetaiVisible ? 'Hide' : 'Show'}</div>
          </div>
          <div className={`d-flex v-center space-between mt-2 ${!withdrawDetaiVisible ? "d-none" : ""}`}>
            <div>
              <div className='font-16 bold-300 color-gray my-2'>
                <span className='mr-10' >Size</span>
                {/* <Info content="Lorem ipsum dolor sit amet consectetur lorem11155" /> */}
              </div>
            </div>
            <div className='text-end'>
              <Skeleton loading={size === env.EMPTY_VALUE} width='80px'>
                <div className='font-16 bold-700 color-white my-2'>
                  {size}
                </div>
              </Skeleton>
            </div>
          </div>
          <div className={`d-flex v-center space-between ${!withdrawDetaiVisible ? "d-none" : ""}`}>
            <div>
              <div className='font-16 bold-300 color-gray my-2'>
                <span className='mr-10' >Total Debt</span>
              </div>
            </div>
            <div className='text-end'>
              <Skeleton loading={totalBorrowsQuery.isLoading} width='80px'>
                <div className='font-16 bold-700 color-white my-2'>
                  ${truncateAmount(totalBorrowsQuery.data, 2)}
                </div>
              </Skeleton>
            </div>
          </div>
          <div className={`d-flex v-center space-between ${!withdrawDetaiVisible ? "d-none" : ""}`}>
            <div>
              <div className='font-16 bold-300 color-gray my-2'>
                <span className='mr-10' >Available to withdraw</span>
              </div>
            </div>
            <div className='text-end'>
              <Skeleton loading={maxWithdrawAbleQuery.isLoading} width='80px'>
                <div className='font-16 bold-700 color-white my-2'>
                  {truncateAmount(maxWithdrawAbleQuery.data)} {position.name}
                </div>
              </Skeleton>
            </div>
          </div>
          <div className={`d-flex v-center space-between ${!withdrawDetaiVisible ? "d-none" : ""}`}>
            <div>
              <div className='font-16 bold-300 color-gray my-2'>
                <span className='mr-10' >Health Factor</span>
              </div>
            </div>
            <div className='text-end'>
              <HealthFactor token={position} increase={false} amount={amount} />
            </div>
          </div>
        </div>
        <div className='font-14 bold-400 color-gray mt-4 mb-2'>Withdraw</div>
        <Skeleton loading={position.userPoolBalance === env.EMPTY_VALUE || maxWithdrawAbleQuery.isLoading}>
          <div style={{ padding: '8px 18px' }} className='radius-8 bg-trans mt-2 desktop-flex space-between v-center'>
            <div className='w-95-100 d-flex v-center my-1 mr-10'>
              {
                position
                  ? <>
                    <img src={position?.image} width={29} className='mr-10' /><PriceInput amount={amount} setAmount={setAmount} /> <span className='font-18 bold-400 color-gray mr-10'> {position?.name || ''}</span>
                  </>
                  : null
              }
            </div>
            <div className='w-5-100 d-flex v-center flex-end my-2'>

              <Button className='max-btn market font-12 bold-300 color-gray radius-4 border-gray border-1 px-1 py-1' onClick={handleMaxClicked}>
                <span>MAX</span>
              </Button>
            </div>
          </div>
        </Skeleton>
        <div className='d-flex v-center space-between mt-2'>
          <div>
            <div className='font-16 bold-300 color-gray my-2'>
              <span className='mr-10' >Remaining Size</span>
            </div>
          </div>
          <div className='text-end'>
            <Skeleton loading={remainingSize === env.EMPTY_VALUE} width='80px'>
              <div className='font-16 bold-700 color-white my-2'>
                {remainingSize}
              </div>
            </Skeleton>
          </div>
        </div>
        {/* <div className='d-flex v-center space-between mt-1'>
          <div>
            <div className='font-16 bold-300 color-gray my-2'>
              <span className='mr-10' >New Health Factor</span>
            </div>
          </div>
          <div className='text-end'>
            <Skeleton loading={newHealthFactorQuery.isLoading} width='80px'>
              <div className='font-16 bold-700 color-white my-2'>
                {truncateAmount(newHealthFactorQuery.data, 2)}%
              </div>
            </Skeleton>
          </div>
        </div> */}

        <div className='mt-2'>
          <AsyncButton onClick={handleWithdraw} loading={buttonLoading} disabledreason={buttonDisabledReason} className='mt-4'>Withdraw</AsyncButton>
        </div>
      </Modal.Body>
    </Modal >
  )
}
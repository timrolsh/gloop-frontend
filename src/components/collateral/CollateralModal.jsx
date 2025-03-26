import { useMemo, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import env from '~/env'
import useGetHypotheticalHealthFactor from '~/stores/server/core/useGetHypotheticalHealthFactor'
import { createBigNumber } from '~/utils/math'
import AsyncButton from '../AsyncButton'

import HealthFactor from '../health-factor/HealthFactor'
import useGetTotalBorrows from '~/stores/server/borrow/useGetTotalBorrows'
import useGetUserCollaterals from '~/stores/server/borrow/useGetUserCollaterals'

export default function CollateralModal({ token, collateralEnabled = true, isLoading = false, onSuccess = () => { }, onClose = () => { } }) {
  const newHealthFactorQuery = useGetHypotheticalHealthFactor({ token, collAmount: token.userPoolBalance, collIncrease: collateralEnabled, collateralModal: true })

  const totalBorrowsQuery = useGetTotalBorrows({})
  const userCollateralsQuery = useGetUserCollaterals({})

  const buttonDisabledReason = useMemo(() => {

    if (newHealthFactorQuery.isLoading || totalBorrowsQuery.isLoading || userCollateralsQuery.isLoading || newHealthFactorQuery.data === env.EMPTY_VALUE)
      return 'Calculating New Health Factor...'

    // If the user is going to disable their only collateral asset (i.e. pool.getCollateral(user) returns an array of length = 1)
    // then button is not disabled
    if (!collateralEnabled && createBigNumber(totalBorrowsQuery.data).lte(0) && userCollateralsQuery.data?.length === 1)
      return ''

    if (createBigNumber(newHealthFactorQuery.data).lt(100))
      return 'Collateral change is not allowed due to low Health Factor.'

  }, [newHealthFactorQuery, collateralEnabled, token, totalBorrowsQuery, userCollateralsQuery])

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Body className='p-4 radius-8 bg-trans1 border-dark d-flex flex-column gap-2'>
        <div className='font-18 bold-600 color-white'>{collateralEnabled ? 'Enable as Collateral' : 'Disable as Collateral'}</div>
        <div>
          <hr className='hr-3 border-dark-green' />
        </div>
        <div className='mt-2 mb-4 loop-info'>
          <div className='title'>Disabling/enabling this asset as collateral affects your borrowing power and Health Factor.</div>
        </div>
        <div className='radius-8 border-2 border-dark-green p-3'>
          <div className='d-flex space-between v-center'>
          </div>
          <div className={`d-flex flex-column mt-2`}>

            <div className='d-flex space-between'>
              <span className='font-16 bold-300 color-gray my-2' >Asset</span>
              <div className='font-16 bold-700 color-white my-2'>
                {token.name}
              </div>
            </div>

            <div className='d-flex space-between'>
              <span className='font-16 bold-300 color-gray my-2' >Health Factor</span>
              <HealthFactor token={token} increase={collateralEnabled} amount={token.userPoolBalance} collateralModal={true} />
            </div>

          </div>
        </div>
        <div className='flex-grow-1 p-1'>
          <AsyncButton disabledreason={buttonDisabledReason} loading={isLoading} className='gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2 w-100' onClick={onSuccess}>{collateralEnabled ? 'Enable' : 'Disable'}</AsyncButton>
        </div>
      </Modal.Body>
    </Modal>
  )
}
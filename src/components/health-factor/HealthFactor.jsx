import useGetHealthFactor from '~/stores/server/core/useGetHealthFactor'
import useGetHypotheticalHealthFactor from '~/stores/server/core/useGetHypotheticalHealthFactor'
import Skeleton from '../Skeleton'
import env from '~/env'

import RightArrowImage from '~/assets/img/right-arrow.png'
import { useMemo } from 'react'
import { createBigNumber } from '~/utils/math'
import InfinityIcon from '~/assets/img/infinity.png'
import useGetTotalBorrows from '~/stores/server/borrow/useGetTotalBorrows'
import useGetDebtRepayHypotheticalHealthFactor from '~/stores/server/core/useGetDebtRepayHypotheticalHealthFactor'
import { truncateAmount } from '~/utils/ui'

export default function HealthFactor({ token, increase, amount = '0', collateralModal = false, userWalletAddress = '' }) {

  const currentHealthFactorQuery = useGetHealthFactor({ token: { name: 'USDC', address: env.USDC_TOKEN_ADDRESS, }, amount: '0', userWalletAddress })
  const collateralHypotheticalHealthFactor = useGetHypotheticalHealthFactor({ token, collAmount: amount, collIncrease: increase, enabled: token.collateral, collateralModal, userWalletAddress })
  const debtRepayHypotheticalHealthFactorQuery = useGetDebtRepayHypotheticalHealthFactor({ amount, enabled: !token.collateral, userWalletAddress })
  const borrowHypotheticalHealthFactor = useGetHealthFactor({ token, amount, enabled: !token.collateral && !increase, userWalletAddress })

  const hypotheticalHealthFactorQuery = useMemo(() => {

    if (!token.collateral)
      return !increase ? borrowHypotheticalHealthFactor : debtRepayHypotheticalHealthFactorQuery

    return collateralHypotheticalHealthFactor
  }, [collateralHypotheticalHealthFactor, debtRepayHypotheticalHealthFactorQuery, borrowHypotheticalHealthFactor, increase, token])

  const hypotheticalHealthFactorColorClass = useMemo(() => {

    if (currentHealthFactorQuery.isLoading || currentHealthFactorQuery.data === env.EMPTY_VALUE || isNaN(currentHealthFactorQuery.data) || hypotheticalHealthFactorQuery.isLoading || hypotheticalHealthFactorQuery.data === env.EMPTY_VALUE)
      return 'color-white'

    const bigHypotheticalHF = createBigNumber(hypotheticalHealthFactorQuery.data)

    if (bigHypotheticalHF.gt(currentHealthFactorQuery.data))
      return 'color-green'

    if (bigHypotheticalHF.lt(100))
      return 'color-red'

    return 'color-white'

  }, [currentHealthFactorQuery, hypotheticalHealthFactorQuery])

  const displayCurrentHF = () => {
    return <>
      {
        currentHealthFactorQuery.data == Infinity
          ? <img src={InfinityIcon} alt="infinity" width={32} height={32} />
          : <span className='color-white font-bold font-16'>{truncateAmount(currentHealthFactorQuery.data, '0')}%</span>
      }
    </>
  }

  return (
    <Skeleton width='200px' loading={currentHealthFactorQuery.isLoading || currentHealthFactorQuery.data === env.EMPTY_VALUE || hypotheticalHealthFactorQuery.isLoading || hypotheticalHealthFactorQuery.data === env.EMPTY_VALUE}>

      {
        (!amount || amount === '0')
          ? displayCurrentHF()
          : <div className='d-flex flex-column align-items-end'>

            <div className='d-flex align-items-center' style={{ gap: '8px' }}>
              {displayCurrentHF()}
              <img src={RightArrowImage} alt="right-arrow" />
              {
                hypotheticalHealthFactorQuery.data == Infinity
                  ? <img src={InfinityIcon} alt="infinity" width={32} height={32} />
                  : <span className={`${hypotheticalHealthFactorColorClass} font-bold font-16`}>{truncateAmount(hypotheticalHealthFactorQuery.data || '0', 2)}%</span>
              }
            </div>
            <span className='color-gray font-14'>Liquidation at {`<100%`}</span>

          </div>
      }

    </Skeleton>

  )
}
import Skeleton from '../Skeleton'
import env from '~/env'
import { truncateAmount } from '~/utils/ui'
import useGetTotalBorrows from '~/stores/server/borrow/useGetTotalBorrows'
import useGetTotalCollateral from '~/stores/server/borrow/useGetTotalCollateral'
import HealthFactor from '../health-factor/HealthFactor'

export default function PortfolioOverall() {

  const totalBorrowsQuery = useGetTotalBorrows({})
  const totalCollateralQuery = useGetTotalCollateral({})

  return (
    <div className="my-4">
      <div className='overall-usdc-card bg-trans' style={{ padding: '12px' }}>

        <div className='d-flex' style={{ flexWrap: 'wrap' }}>
          <div className='position-information-card radius-8 p-3 m-2' style={{ width: '31%' }}>
            <div className='d-flex flex-column p-2 space-between' style={{ gap: '8px' }}>
              <div className='font-16 font-bold color-white'>Total Collat. Value</div>
              <Skeleton loading={totalCollateralQuery.isLoading}>
                <span className='font-16 font-bold color-white' title={`$${totalCollateralQuery?.data}`}>${truncateAmount(totalCollateralQuery.data, 2)}</span>
              </Skeleton>
            </div>
          </div>
          <div className='position-information-card radius-8 p-3 m-2' style={{ width: '31%' }}>
            <div className='d-flex flex-column p-2 space-between' style={{ gap: '8px' }}>
              <div className='font-16 font-bold color-white'>Total Borrows</div>
            </div>
            <Skeleton loading={totalBorrowsQuery.isLoading}>
              <span className='font-16 font-bold color-white px-2 pb-2'>${truncateAmount(totalBorrowsQuery?.data, 2)}</span>
            </Skeleton>
          </div>
          <div className='position-information-card radius-8 p-3 m-2' style={{ width: '31%' }}>
            <div className='d-flex flex-column p-2 space-between' style={{ gap: '8px' }}>
              <div className='font-16 font-bold color-white'>Health Factor</div>
              <HealthFactor increase={false} amount='0' token={{ address: env.USDC_TOKEN_ADDRESS, name: 'USDC' }} />
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
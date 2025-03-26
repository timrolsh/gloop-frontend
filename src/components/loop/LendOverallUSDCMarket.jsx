import { useMemo, useState } from 'react'
import Skeleton from '../Skeleton'
import dropdown_img from '../../assets/img/dropdown.svg'
import env from '~/env'
import { truncateAmount } from '~/utils/ui'
import useGetTokensList from '~/stores/server/core/useGetTokensList'
import useGetReserveFactorMantissa from '~/stores/server/core/useGetReserveFactorMantissa'
import useGetGloopStakersYieldFactor from '~/stores/server/core/useGetGloopStakersYieldFactor'
import useUserStore from '~/stores/client/user'
import AuthenticatedSection from '../AuthenticatedSection'
import ConnectWalletButton from '../wallet/ConnectWalletButton'

export default function LendOverallUSDCMarket() {

  const isAuthenticated = useUserStore((state) => state.isAuthenticated)

  const [informationVisible, setInformationVisible] = useState(isAuthenticated() ? false : true)
  const tokensList = useGetTokensList({})
  const reserveFactorQuery = useGetReserveFactorMantissa({})
  const stakersYieldRatioQuery = useGetGloopStakersYieldFactor({})

  const usdcToken = useMemo(() => {
    return (tokensList.data || []).find(x => x.name === 'USDC')
  }, [tokensList.data])

  return (
    <div className="my-4">
      <div className='overall-usdc-card bg-trans'>


        <div className="toggler-bar" onClick={() => setInformationVisible(!informationVisible)}>
          <div className='information-detail-title'>Overall USDC Market</div>
          <div className='d-flex align-items-center' style={{ gap: '10px' }}>
            <img src={dropdown_img} width={13} className={`dropdown-icon ${informationVisible && 'rotate-180'}`} />
          </div>
        </div>
        {informationVisible && (
          <div>
            <div className='border-line my-3'></div>

            <div className='d-flex' style={{ flexWrap: 'wrap' }}>
              <div className='position-information-card radius-8 p-3 m-2' style={{ width: '31%' }}>
                <div className='d-flex space-between v-center'>
                  <div className='p-2'>
                    <div className='font-16 bold-600 color-white'>Price</div>
                  </div>
                </div>
                <Skeleton loading={usdcToken?.price === env.EMPTY_VALUE}>
                  <span className='font-16 color-white px-2 pb-2' title={`$${usdcToken?.price}`}>${truncateAmount(usdcToken?.price, 2)}</span>
                </Skeleton>
              </div>
              <div className='position-information-card radius-8 p-3 m-2' style={{ width: '31%' }}>
                <div className='d-flex space-between v-center'>
                  <div className='p-2'>
                    <div className='font-16 bold-600 color-white'>Supply APY</div>
                  </div>
                </div>
                <Skeleton loading={!usdcToken || usdcToken?.supplyApy === env.EMPTY_VALUE}>
                  <span className='font-16 color-white px-2 pb-2'>{truncateAmount(usdcToken?.supplyApy, 2)}%</span>
                </Skeleton>
              </div>
              <div className='position-information-card radius-8 p-3 m-2' style={{ width: '31%' }}>
                <div className='d-flex space-between v-center'>
                  <div className='p-2'>
                    <div className='font-16 bold-600 color-white'>Borrow APY</div>
                  </div>
                </div>
                <Skeleton loading={!usdcToken || usdcToken?.borrowApy === env.EMPTY_VALUE}>
                  <span className='font-16 color-white px-2 pb-2'>{truncateAmount(usdcToken?.borrowApy, 2)}%</span>
                </Skeleton>
              </div>
              <div className='position-information-card radius-8 p-3 m-2' style={{ width: '31%' }}>
                <div className='d-flex space-between v-center'>
                  <div className='p-2'>
                    <div className='font-16 bold-600 color-white'>Available Liquidity</div>
                  </div>
                </div>
                <Skeleton loading={usdcToken?.availableLiquidity === env.EMPTY_VALUE}>
                  <span className='font-16 color-white px-2 pb-2' title={usdcToken?.availableLiquidity}>{truncateAmount(usdcToken?.availableLiquidity)}</span>
                </Skeleton>
              </div>
              <div className='position-information-card radius-8 p-3 m-2' style={{ width: '31%' }}>
                <div className='d-flex space-between v-center'>
                  <div className='p-2'>
                    <div className='font-16 bold-600 color-white'>Total Borrowed</div>
                  </div>
                </div>
                <Skeleton loading={!usdcToken || usdcToken?.totalBorrows === env.EMPTY_VALUE}>
                  <span className='font-16 color-white px-2 pb-2' title={usdcToken?.totalBorrows}>{truncateAmount(usdcToken?.totalBorrows)}</span>
                </Skeleton>
              </div>
              <div className='position-information-card radius-8 p-3 m-2' style={{ width: '31%' }}>
                <div className='d-flex space-between v-center'>
                  <div className='p-2'>
                    <div className='font-16 bold-600 color-white'>Utilization Rate</div>
                  </div>
                </div>
                <Skeleton loading={!usdcToken || usdcToken?.utilizationRate === env.EMPTY_VALUE}>
                  <span className='font-16 color-white px-2 pb-2'>{usdcToken?.utilizationRate}%</span>
                </Skeleton>
              </div>
              <div className='position-information-card radius-8 p-3 m-2' style={{ width: '31%' }}>
                <div className='d-flex space-between v-center'>
                  <div className='p-2'>
                    <div className='font-16 bold-600 color-white'>Pending Reserves</div>
                  </div>
                </div>
                <Skeleton loading={!usdcToken || usdcToken?.totalReserves === env.EMPTY_VALUE}>
                  <span className='font-16 color-white px-2 pb-2' title={`${usdcToken?.totalReserves} USDC`}>{truncateAmount(usdcToken?.totalReserves)} USDC</span>
                </Skeleton>
              </div>
              <div className='position-information-card radius-8 p-3 m-2' style={{ width: '31%' }}>
                <div className='d-flex space-between v-center'>
                  <div className='p-2'>
                    <div className='font-16 bold-600 color-white'>Reserve Factor</div>
                  </div>
                </div>
                <Skeleton loading={reserveFactorQuery.isLoading}>
                  <span className='font-16 color-white px-2 pb-2'>{reserveFactorQuery?.data}%</span>
                </Skeleton>
              </div>
              <div className='position-information-card radius-8 p-3 m-2' style={{ width: '31%' }}>
                <div className='d-flex space-between v-center'>
                  <div className='p-2'>
                    <div className='font-16 bold-600 color-white'>Gloop Staker Factor</div>
                  </div>
                </div>
                <Skeleton loading={stakersYieldRatioQuery.isLoading}>
                  <span className='font-16 color-white px-2 pb-2'>{stakersYieldRatioQuery?.data}%</span>
                </Skeleton>
              </div>
            </div>
          </div>

        )
        }
      </div>
    </div >
  )
}
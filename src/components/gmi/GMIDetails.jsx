import { truncateAmount } from '~/utils/ui'
import useGetGMIAPY from '~/stores/server/gmi/useGetGMIAPY'
import Skeleton from '../Skeleton'
import useGetGMIBalance from '~/stores/server/gmi/useGetGMIBalance'
import useGetGMITotalSupply from '~/stores/server/gmi/useGetGMITotalSupply'
import useGetTotalControlledValue from '~/stores/server/gmi/useGetTotalControlledValue'
import useGetGMIPrice from '~/stores/server/gmi/useGetGMIPrice'
import { useMemo } from 'react'
import { createBigNumber } from '~/utils/math'
import env from '~/env'
import { useAccount } from 'wagmi'
import AuthenticatedSection from '../AuthenticatedSection'

export default function GMIDetails() {

    const GMIAPYQuery = useGetGMIAPY({})
    const GMIBalanceQuery = useGetGMIBalance({})
    const GMITotalSupplyQuery = useGetGMITotalSupply({})
    const GMITotalControlledValueQuery = useGetTotalControlledValue({})
    const GMIPriceQuery = useGetGMIPrice({})
    const { isConnected } = useAccount()

    const totalValue = useMemo(() => {

        if (
            GMIPriceQuery.isLoading || !GMIPriceQuery.data || GMIPriceQuery.data === env.EMPTY_VALUE ||
            GMIBalanceQuery.isLoading || !GMIBalanceQuery.data || GMIBalanceQuery.data === env.EMPTY_VALUE
        ) {
            return env.EMPTY_VALUE
        }

        return createBigNumber(GMIPriceQuery.data?.toString()).mul(GMIBalanceQuery.data?.toString()).toString()
    }, [GMIPriceQuery, GMIBalanceQuery, isConnected])

    return (
        <div className="radius-8 bg-trans p-4 min-h-470 d-flex flex-column">
            <div className='d-flex v-center space-between'>
                <div className='font-18 bold-600 color-white'>GMI</div>
                <Skeleton loading={GMIAPYQuery.isLoading || GMIAPYQuery.data === env.EMPTY_VALUE} width='120px'>
                    <div className='font-16 bold-700 color-white bg-trans radius-8 py-2 px-3'>{truncateAmount(GMIAPYQuery.data, 2)}% APY</div>
                </Skeleton>
            </div>
            <div>
                <hr className='hr-3 border-dark-green' />
            </div>
            <div className='d-flex v-center space-between'>
                <div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >GMI Price</span>
                        {/* <Info content="Lorem ipsum dolor sit amet consectetur lorem111"/> */}
                    </div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >TVL</span>
                        {/* <Info content="Lorem ipsum dolor sit amet consectetur lorem222"/> */}
                    </div>
                    <div className='font-16 bold-300 color-gray my-3'>
                        <span className='mr-10' >Total Supply</span>
                        {/* <Info content="Lorem ipsum dolor sit amet consectetur lorem3333"/> */}
                    </div>
                </div>
                <div className='text-end'>
                    <Skeleton loading={GMIPriceQuery.isLoading || GMIPriceQuery.data === env.EMPTY_VALUE}>
                        <div title={`$${GMIPriceQuery.data}`} className='font-16 bold-700 color-white my-3'>
                            ${truncateAmount(GMIPriceQuery.data, 2)}
                        </div>
                    </Skeleton>
                    <Skeleton loading={GMITotalControlledValueQuery.isLoading}>
                        <div title={`$${GMITotalControlledValueQuery.data}`} className='font-16 bold-700 color-white my-3'>
                            ${truncateAmount(GMITotalControlledValueQuery.data, 2)}
                        </div>
                    </Skeleton>
                    <Skeleton loading={GMITotalSupplyQuery.isLoading}>
                        <div title={`${GMITotalSupplyQuery.data} GMI`} className='font-16 bold-700 color-white my-3'>
                            {truncateAmount(GMITotalSupplyQuery.data)} GMI
                        </div>
                    </Skeleton>
                </div>
            </div>
            <div>
                <hr className='hr-1 border-dark-green' />
            </div>
            <AuthenticatedSection className='flex-grow-1' height='200px'>
                <div className='d-flex v-center space-between'>
                    <div>
                        <div className='font-16 bold-300 color-gray my-3'>
                            <span className='mr-10' >Wallet</span>
                        </div>
                        <div className='font-16 bold-300 color-gray my-3 d-flex'>
                            <span className='mr-10' >Total Value</span>
                        </div>
                    </div>

                    <div className='text-end'>
                        <Skeleton loading={GMIBalanceQuery.isLoading || GMIBalanceQuery.data === env.EMPTY_VALUE} width='80px'>
                            <div title={`${GMIBalanceQuery.data} GMI`} className='font-16 bold-700 color-white my-3'>
                                {truncateAmount(GMIBalanceQuery.data)} GMI
                            </div>
                        </Skeleton>
                        <Skeleton loading={GMIBalanceQuery.isLoading || GMIPriceQuery.isLoading || totalValue === env.EMPTY_VALUE} width='80px'>
                            <div title={`$${totalValue}`} className='font-16 bold-700 color-white my-3'>
                                ${truncateAmount(totalValue, 2)}
                            </div>
                        </Skeleton>
                    </div>
                </div>
            </AuthenticatedSection>
        </div>
    )
}
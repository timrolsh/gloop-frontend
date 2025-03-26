import useGetTokensList from '~/stores/server/core/useGetTokensList'
import Skeleton from '../Skeleton'
import { truncateAmount } from '~/utils/ui'

// images
import GMIIcon from '~/assets/img/tokens/gmi.svg'
import useGetGMIBalance from '~/stores/server/gmi/useGetGMIBalance'
import env from '~/env'
import PriceInput from '../PriceInput'
import { useMemo } from 'react'
import useGetGMIPrice from '~/stores/server/gmi/useGetGMIPrice'
import { createBigNumber } from '~/utils/math'

export default function GMITokenDropdown({ amount, setAmount, withdrawal, estimatedAmountOut }) {

    const GMIbalanceQuery = useGetGMIBalance({})
    const GMIPriceQuery = useGetGMIPrice({})

    const dollarValue = useMemo(() => {

        if (GMIPriceQuery.isLoading)
            return 0

        const bigPrice = createBigNumber(GMIPriceQuery.data)
        const value = withdrawal ? amount : estimatedAmountOut

        if (!value || value === env.EMPTY_VALUE)
            return 0

        return (bigPrice.mul(value.toString())).toString()

    }, [GMIPriceQuery.data, amount, estimatedAmountOut])

    return (
        <div className="radius-8 bg-trans p-3 position-rel
            ative">
            <div className='d-flex v-center space-between'>
                <div style={{ minWidth: 0 }}>
                    {
                        !withdrawal
                            ? (
                                estimatedAmountOut
                                    ? <Skeleton loading={estimatedAmountOut === env.EMPTY_VALUE} width='200px' height='40px'>
                                        <div className='font-20 bold-700 color-white' title={estimatedAmountOut}>
                                            {estimatedAmountOut}
                                        </div>
                                    </Skeleton>
                                    : null
                            )
                            : <PriceInput amount={amount} setAmount={setAmount} />
                    }
                    <div className='mt-2'>
                        <div className='font-14 bold-300 color-gray mt-2' title={`$${dollarValue}`}>${truncateAmount(dollarValue, 2)}</div>
                    </div>
                </div>
                <div className='text-end'>
                    <div className='d-flex v-center1 flex-end'>
                        <img src={GMIIcon} width={22} className='mr-10 to_gmi_dropdown_btn' /><div className='font-20 bold-500 color-white to_gmi_dropdown_btn1'>GMI</div>
                    </div>
                    <div className='mt-2'>
                        <Skeleton loading={GMIbalanceQuery.isLoading || !GMIbalanceQuery.data || GMIbalanceQuery.data === env.EMPTY_VALUE}>
                            <div className='font-14 bold-300 color-gray' title={`${GMIbalanceQuery.data} GMI`}>Balance: {`${truncateAmount(GMIbalanceQuery.data, 4)} GMI`}</div>
                        </Skeleton>
                    </div>
                </div>
            </div>
        </div>
    )
}
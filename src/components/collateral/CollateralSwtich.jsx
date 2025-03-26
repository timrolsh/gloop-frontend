import { useEffect, useMemo, useState } from 'react'
import { Form } from 'react-bootstrap'
import CollateralModal from './CollateralModal'
import { enableCollateral } from '~/web3/borrowWeb3'
import useChangeCollateralEnableStatus from '~/stores/server/borrow/useChangeCollateralEnableStatus'
import { createBigNumber } from '~/utils/math'
import env from '~/env'
import useGetTokensList from '~/stores/server/core/useGetTokensList'


export default function CollateralSwitch({ token, label = '', className = '' }) {

  const [isChecked, setIsChecked] = useState(token.collateralEnabled)
  const [collateralModalVisible, setCollateralModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { data: tokens } = useGetTokensList({})

  const { mutate: disable } = useChangeCollateralEnableStatus({ token, enable: false })
  const { mutate: enable } = useChangeCollateralEnableStatus({ token, enable: true })

  const handleChangeStatus = (checked) => {

    setIsLoading(true)

    const operation = checked ? enable : disable

    operation({}, {
      onSuccess: () => {
        setIsChecked(checked)
        setCollateralModalVisible(false)
      },
      onSettled: () => {
        setIsLoading(false)
      },
      onError: () => {
        setIsChecked(!checked)
      },
    })
  }

  const borrowBalance = useMemo(() => {

    const borrowableTokens = (tokens || []).filter(x => x.borrowable && x.userBorrows !== env.EMPTY_VALUE)

    if (!borrowableTokens.length)
      return env.EMPTY_VALUE

    return borrowableTokens.map(x => x.userBorrows).reduce((accumulator, currentValue) => {
      return createBigNumber(accumulator).plus(currentValue).toString()
    }, 0)

  }, [tokens])

  const collateralAssets = useMemo(() => {
    return (tokens || []).filter(x => x.collateral && x.collateralEnabled)
  }, [tokens])


  // if (pool.getCollateral(user).length == 1 && pool.borrowBalance(asset, user) > 0) then disabling is not allowed.
  const isDisabled = useMemo(() => {
    return !token.collateral || isLoading
    // || borrowBalance === env.EMPTY_VALUE || (isChecked && collateralAssets.length <= 1 && createBigNumber(borrowBalance.toString()).gt(0))

  }, [isLoading, token, isChecked, borrowBalance, collateralAssets])

  useEffect(() => {
    setIsChecked(token.collateralEnabled)
  }, [token.collateralEnabled])

  return (
    <>
      <Form>
        <Form.Check
          type="switch"
          id="collateral-switch"
          label={label}
          className={`${className} collateral-switch`}
          disabled={isDisabled}
          checked={isChecked}
          onChange={() => setCollateralModalVisible(true)}
        />
      </Form>
      {
        collateralModalVisible
          ? <CollateralModal token={token} collateralEnabled={!isChecked} isLoading={isLoading} onSuccess={() => handleChangeStatus(!isChecked)} onClose={() => setCollateralModalVisible(false)} />
          : null
      }
    </>

  )
}
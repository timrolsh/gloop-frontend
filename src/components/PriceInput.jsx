import { useState, useMemo, useEffect } from 'react'
import { createBigNumber } from '~/utils/math'

export default function PriceInput({ amount, setAmount, onChange = () => { }, className = '' }) {

  const [localValue, setLocalValue] = useState(amount)

  const formatWithCommas = (val) => {
    const parts = val.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }

  const isValidNumber = (val) => {
    return val === '' || /^(?!0\d)\d*\.?\d*$/.test(val)
  }

  const emit = (val) => {
    setAmount(val)
    onChange(val)
  }

  const priceInputHandler = (e) => {
    const val = e.target.value.replace(/,/g, '') // Remove commas for internal handling

    if (isValidNumber(val)) {
      setLocalValue(val)// Update localValue to display all valid decimal values, even if it's zero

      try {
        const bigVal = createBigNumber(val)

        // Emit value only if it's greater than 0
        if (bigVal.gt(0))
          emit(val)

        // Emit empty string for zero
        // This will trigger "amount empty" alerts and disable action buttons
        else
          emit('')

      } catch (error) {
        // Handle non-valid values like '0.' or parsing errors
        // Emit empty string to maintain consistent behavior
        emit('')
      }
    }
  }

  const displayValue = useMemo(() => {
    return localValue ? formatWithCommas(localValue) : ''
  }, [localValue])

  useEffect(() => {
    setLocalValue(amount)
  }, [amount])

  return (
    <input
      type="text"
      className={`${className} buy_gmi_input price-input-font flex-grow-1 bold-700 color-white mr-10`}
      value={displayValue}
      onChange={priceInputHandler}
      placeholder='Enter Amount'
    />
  )
}
import React, { useState, useEffect } from 'react'

const WheelRange = ({ minValue, maxValue, onChange, initialValue }) => {
  const [value, setValue] = useState(initialValue || (minValue + maxValue) / 2) // Initialize value to midpoint

  useEffect(() => {
    if (onChange) {
      onChange(value)
    }
  }, [value, onChange])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <div className="wheel-range">
      <div className='wheel-range-fill wheel-range-bg' style={{ width: '100%' }}></div>
      <div className='wheel-range-fill' style={{ width: `calc(${((value - minValue) / (maxValue - minValue)) * 100}% ${(((value - minValue) / (maxValue - minValue)) * 100) > 50 ? '- 2px' : '+ 5px'})` }}></div>
      <input
        type="range"
        min={minValue}
        max={maxValue}
        value={value}
        step={0.25}
        onChange={handleChange}
        className="slider"
      />
    </div>
  )
}

export default WheelRange

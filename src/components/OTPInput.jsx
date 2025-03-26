import React, { useRef, useEffect, useState } from 'react'

function OTPInput({ numberOfDigits, onOtpChange }) {
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""))
  const otpBoxReference = useRef([])

  function handleChange(value, index) {
    let newArr = [...otp]
    newArr[index] = value
    setOtp(newArr)
    onOtpChange(newArr.join(''))

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus()
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus()
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus()
    }
  }

  return (
    <div className='d-flex justify-content-center my-2 color-white'>
      {otp.map((digit, index) => (
        <div key={index} className='radius-8 border-green border-1 p-2 m-2'>
          <input key={index} value={digit} maxLength={1}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
            ref={(reference) => (otpBoxReference.current[index] = reference)}
            className={`buy_gloop_inputs invite_code_input`}
          />
          <hr className='m-0 border-green border-1 opacity-100' />
        </div>
      ))}

    </div>
  )
}

export default OTPInput
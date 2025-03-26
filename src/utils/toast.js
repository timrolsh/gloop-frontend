import * as Sentry from "@sentry/react"
import toast from 'react-hot-toast'

// Function to get toast options based on screen size
export const getOptions = () => {
  return {
    duration: 4000,
    position: window.innerWidth > 640 ? 'bottom-left' : 'top-left',
    className: 'custom-toast',
  }
}

// Function to show error toast and optionally send to Sentry
export const toastError = (msg, options = {}, sendToSentry = true) => {
  options = Object.assign(getOptions(), options)

  if (msg && sendToSentry) {
    Sentry.captureMessage(msg.toString())
  }

  return toast.error(msg, options)
}

// Function to show success toast
export const toastSuccess = (msg, options = {}) => {
  options = Object.assign(getOptions(), options)
  return toast.success(msg, options)
}

// General toast function
const _toast = (msg, options = {}) => {
  options = Object.assign(getOptions(), options)
  return toast(msg, options)
}

// Function to show loading toast
export const toastLoading = (msg, options = {}) => {
  options = Object.assign(getOptions(), options, { duration: Infinity })
  return toast.loading(msg, options)
}

// Function to dismiss a specific toast
export const toastDismiss = (toastId) => {
  toast.dismiss(toastId)
}

export const toastInfo = (msg, options = {}) => {
  options = Object.assign(getOptions(), options)
  return toast(msg, options)
}

export const reopenToastLoading = (toastId, message, options = {}) => {
  toastDismiss(toastId)
  return toastLoading(message, options)
}

// Function to handle a promise with loading, success, and error toasts
export const toastPromise = (promise, loadingMessage, successMessage, errorMessage) => {
  const options = Object.assign({
    success: {
      duration: 4000,
    },
  }, getOptions())

  return toast.promise(
    promise,
    {
      loading: loadingMessage,
      success: () => successMessage,
      error: () => errorMessage,
    },
    options
  )
}

export default _toast

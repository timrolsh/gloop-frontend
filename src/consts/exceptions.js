import * as Sentry from "@sentry/react"
import { toastError } from '../utils/toast'

class BaseException extends Error {

  constructor(msg, details = {}, options = {}) {
    super(msg)

    Object.setPrototypeOf(this, BaseException.prototype)

    this.name = options.name || 'BaseException'
    this.sentryLogLevel = options.sentryLogLevel || 'error'
    this.sendToSentry = options.sendToSentry !== undefined ? options.sendToSentry : true
    this.sendToast = options.sendToast || false
    const stackLines = this.addStackTrace()
    this.details = { ...details, stackLines, issuedAt: new Date().toISOString() }

    if (this.sendToSentry)
      this.handleSendToSentry()

    if (this.sendToast)
      toastError(msg, {}, false)
  }

  handleSendToSentry() {
    Sentry.withScope((scope) => {
      scope.setLevel(this.sentryLogLevel)
      scope.setExtras(this.details)
      Sentry.captureException(this)
    })
  }

  addStackTrace() {
    const originalStack = new Error().stack || ''
    const stackLines = originalStack.split('\n')
    const relevantStackLine = stackLines[4] || ''

    this.stack = `${this.name}: ${this.message}\n    at ${relevantStackLine.trim()}`
    return stackLines
  }
}

class Web3Exception extends BaseException {
  constructor(msg, details = {}, options = {}) {
    super(msg, details, { name: 'Web3Exception', sentryLogLevel: 'fatal', ...options })
  }
}

class ApiException extends BaseException {
  constructor(msg, details = {}, options = {}) {
    super(msg, details, { name: 'ApiException', sentryLogLevel: 'fatal', ...options })
  }
}

class ValidationException extends BaseException {
  constructor(msg, details = {}, options = {}) {
    super(msg, details, { name: 'ValidationException', sentryLogLevel: 'info', sendToast: true, ...options })
  }
}

class ReactQueryException extends BaseException {
  constructor(msg, details = {}, options = {}) {
    super(msg, details, { name: 'ReactQueryException', sentryLogLevel: 'fatal', ...options })
  }
}

class ImplementationException extends BaseException {
  constructor(msg, details = {}, options = {}) {
    super(msg, details, { name: 'ImplementationException', sentryLogLevel: 'fatal', ...options })
  }
}

class UnknownException extends BaseException {
  constructor(msg, details = {}, options = {}) {
    super(msg, details, { name: 'UnknownException', sentryLogLevel: 'fatal', ...options })
  }
}

export {
  BaseException,
  Web3Exception,
  ApiException,
  ValidationException,
  ReactQueryException,
  ImplementationException,
  UnknownException
}

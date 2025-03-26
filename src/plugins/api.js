import axios from "axios"

import useUserStore from "~/stores/client/user"

import eventEmitter from '~/utils/emitter'
import Endpoint from './endpoint'
import { ApiException, ValidationException } from '~/consts/exceptions'
import env from '~/env'
import { events } from '~/consts/events'

const refreshUsersToken = async (role = 'USER', axiosInstance, err) => {
  const endpoint = Endpoint.getUrl(`${role.toLocaleLowerCase()}-refresh`)
  const refreshToken = getRefreshToken(role)

  const originalRequest = err.config

  try {
    const res = await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${refreshToken}` }, baseURL: env.API_URL })

    if (role === 'USER') {
      const store = useUserStore.getState()
      store.setUserTokens(res.data.data)
    }
    else {
      // const store = useAdminStore.getState()
      // store.setAdminTokens(res.data)
    }

    axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + res.data.accessToken
    return axiosInstance(originalRequest)

  } catch (e) {
    if (e && e?.response && (e?.response?.status === 401 || e?.response?.status === 403)) {
      eventEmitter.emit(events.Unauthorized, role)

      const message = 'Your Session Has Expired!'
      new ApiException(message, { error: e, role }, { sentryLogLevel: 'info', sendToast: true })
      return Promise.reject(message)
    }
    else {
      const message = 'Unable To Refresh Token'
      new ApiException(message, { error: e, role }, { sentryLogLevel: 'error' })
      return Promise.reject(message)
    }
  }
}

const getRefreshToken = (role) => {

  // if (role === 'ADMIN') {
  //   const adminStore = useAdminStore.getState()
  //   return adminStore?.adminTokens && adminStore?.adminTokens?.refreshToken ? adminStore?.adminTokens?.refreshToken : ''
  // }

  const userStore = useUserStore.getState()
  return userStore.userTokens && userStore.userTokens.refreshToken ? userStore.userTokens.refreshToken : ""

}

const getAccessToken = (role) => {

  // if (role === 'ADMIN') {
  //   const adminStore = useAdminStore.getState()
  //   return adminStore?.adminTokens && adminStore?.adminTokens?.accessToken ? adminStore?.adminTokens?.accessToken : ''
  // }

  const userStore = useUserStore.getState()
  return userStore.userTokens && userStore.userTokens.accessToken ? userStore.userTokens.accessToken : ""

}

export function useAxios(role) {
  const axiosInstance = axios.create({ baseURL: env.API_URL })

  axiosInstance.interceptors.request.use((config) => {

    const token = getAccessToken(role)

    if (token?.length)
      config.headers["Authorization"] = `Bearer ${token}`
    else
      delete config.headers["Authorization"]

    return config
  })

  axiosInstance.interceptors.response.use(
    (res) => {
      return res
    },
    async (err) => {
      const originalRequest = err.config
      const token = getRefreshToken(role)

      if (err?.response?.status === 401 && !originalRequest._retry) {

        if (token)
          return await refreshUsersToken(role, axiosInstance, err)
        else {
          eventEmitter.emit(events.Unauthorized, role)
          const message = 'Your Session Has Expired!'
          new ApiException(message, { error: err, role, token }, { sentryLogLevel: 'info', sendToast: true })
          return Promise.reject(message)
        }

      } else {

        const message = err?.response?.data?.message || err.message

        if (err?.response.status == 400)
          new ValidationException(message.user, { err, role }, { sendToast: true })
        else
          new ApiException(message.user, { err, role }, { sendToast: true })

        return Promise.reject(message.user)
      }
    }
  )

  return axiosInstance
}

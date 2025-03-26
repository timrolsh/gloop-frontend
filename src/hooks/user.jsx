import { useQueryClient } from '@tanstack/react-query'
import { useDisconnect } from 'wagmi'
import { useNavigate } from 'react-router-dom'

import { routes } from '~/consts/routes'
import useUserStore from '~/stores/client/user'
import { toastSuccess } from '~/utils/toast'

export const useUser = () => {

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { disconnectAsync } = useDisconnect()
  const reset = useUserStore((state) => state.reset)

  const logout = (callback = () => { }, silent) => {
    disconnectAsync()
      .then(res => {

        if (!silent)
          toastSuccess('Wallet Disconnected!')

        reset()
        queryClient.clear()
        // navigate(routes.Home.path)

        if (callback && typeof callback === 'function')
          callback()

      })
  }

  return {
    logout,
  }
}
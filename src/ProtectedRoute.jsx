import { Navigate } from "react-router-dom"
import { routes } from './consts/routes'
import eventEmitter from './utils/emitter'
import { events } from './consts/events'
import { useEffect, useState } from 'react'
import useUserStore from './stores/client/user'

export const ProtectedRoute = ({ route, children }) => {

  const storeIsAuthenticated = useUserStore((state) => state.isAuthenticated)


  useEffect(() => {
    const authStatus = storeIsAuthenticated()

    if (!authStatus) {
      eventEmitter.emit(events.Unauthorized)
    }
  }, [storeIsAuthenticated])

  if (route.locked || (route.authenticated && !storeIsAuthenticated())) {
    return <Navigate to={{ pathname: routes.Home.path }} />
  }

  return children
}
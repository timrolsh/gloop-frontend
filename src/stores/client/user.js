import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware' // Import StateStorage
import { cookieStorage } from './storage'
import { toastSuccess } from '~/utils/toast'

// Define your initial state
const initialState = {
  userTokens: {
    accessToken: '',
    refreshToken: '',
  },
  walletAddress: '',
}

export const USER_CACHE_KEY = 'app-user'

// Create your Zustand store
const useUserStore = create()(
  persist(
    // Use your custom storage adapter here
    (set, get) => ({
      ...initialState,
      setUserTokens: (userTokens) => set({ userTokens: userTokens }),
      setWalletAddress: (walletAddress) => set({ walletAddress }),
      reset: () => {
        cookieStorage.removeItem(USER_CACHE_KEY)
        set(initialState)
      },
      isAuthenticated: () => {
        const { userTokens } = get()
        return userTokens && userTokens.accessToken.length > 0
      },
      login: ({ walletAddress, userTokens }) => {
        const { setUserTokens, setWalletAddress } = get()

        setUserTokens(userTokens)
        setWalletAddress(walletAddress)
        toastSuccess('Welcome!')
      },
    }),
    {
      // Pass the custom storage adapter to the middleware
      name: USER_CACHE_KEY,
      storage: createJSONStorage(() => cookieStorage),
    },
  ),
)

export default useUserStore

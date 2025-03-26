import { create } from 'zustand'
import { getTokensList } from '~/web3/core'

// Define your initial state
const initialState = {
  selectedToken: getTokensList()[0],
  withdrawal: false
}
// Create your Zustand store
const useGmiStore = create()(
  // Use your custom storage adapter here
  (set, get) => ({
    ...initialState,
    setSelectedToken: (selectedToken) => set({ selectedToken }),
    setWithdrawal: (withdrawal) => set({ withdrawal }),
    reset: () => set(initialState),
  })
)

export default useGmiStore

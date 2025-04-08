import {create} from "zustand";

// Define your initial state
const initialState = {
  selectedPosition: null
};
// Create your Zustand store
const usePortfolioStore = create()(
  // Use your custom storage adapter here
  (set, get) => ({
    ...initialState,
    setSelectedPosition: (selectedPosition) => set({selectedPosition}),
    reset: () => set(initialState)
  })
);

export default usePortfolioStore;

import {create} from "zustand";

// Define your initial state
const initialState = {
  selectedMarket: null,
  activeTab: "market"
};
// Create your Zustand store
const useBorrowStore = create()(
  // Use your custom storage adapter here
  (set, get) => ({
    ...initialState,
    setSelectedMarket: (selectedMarket) => set({selectedMarket}),
    setActiveTab: (activeTab) => set({activeTab}),
    reset: () => set(initialState)
  })
);

export default useBorrowStore;

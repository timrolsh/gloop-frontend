import {create} from "zustand";
import {getTokensList} from "~/web3/core";

// Define your initial state
const initialState = {
  selectedToken: getTokensList().filter((x) => x.lendable)[0]
};
// Create your Zustand store
const useLendStore = create()(
  // Use your custom storage adapter here
  (set, get) => ({
    ...initialState,
    setSelectedToken: (selectedToken) => set({selectedToken}),
    reset: () => set(initialState)
  })
);

export default useLendStore;

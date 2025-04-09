import "@rainbow-me/rainbowkit/styles.css";
import {QueryClient} from "@tanstack/react-query";

import {http} from "wagmi";
import {mainnet} from "wagmi/chains";

import {getDefaultConfig} from "@rainbow-me/rainbowkit";

/* New API that includes Wagmi's createConfig and replaces getDefaultWallets and connectorsForWallets */
export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  }
});
export const queryClient = new QueryClient();

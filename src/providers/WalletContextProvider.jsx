import "@rainbow-me/rainbowkit/styles.css";
import {QueryClient} from "@tanstack/react-query";

import {http} from "wagmi";
import {arbitrum} from "wagmi/chains";

import {getDefaultConfig} from "@rainbow-me/rainbowkit";

/* New API that includes Wagmi's createConfig and replaces getDefaultWallets and connectorsForWallets */
export const config = getDefaultConfig({
  appName: "Gloop",
  projectId: "Gloop",
  chains: [arbitrum],
  transports: {
    [arbitrum.id]: http()
  }
});
export const queryClient = new QueryClient();

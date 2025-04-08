import {useMemo} from "react";
import {
  connectorsForWallets,
  RainbowKitProvider,
  darkTheme,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider
} from "@rainbow-me/rainbowkit";
import {
  trustWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet
} from "@rainbow-me/rainbowkit/wallets";
import {WagmiProvider, createConfig, http} from "wagmi";
import {arbitrum, bscTestnet} from "wagmi/chains";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {SiweMessage} from "siwe";

import {ApiException, Web3Exception} from "~/consts/exceptions";
import {useAxios} from "~/plugins/api";
import useUserStore from "~/stores/client/user";
import Endpoint from "~/plugins/endpoint";
import env from "~/env";

import "@rainbow-me/rainbowkit/styles.css";
import {connectWhiteList} from "~/consts/whitelist";

export const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, trustWallet]
    },
    {
      groupName: "Others",
      wallets: [rainbowWallet, coinbaseWallet, walletConnectWallet]
    }
  ],
  {
    appName: "Gloop",
    projectId: "0bbb35a4c90d81087cfc179e93fb4b8b"
  }
);

const chains = env.IS_MAINNET === "true" ? [arbitrum] : [bscTestnet];

export const config = createConfig({
  connectors,
  // storage: createStorage({ storage: cookieStorage }),
  chains,
  transports: {
    [bscTestnet.id]: http(env.TEST_RPC_URL),
    [arbitrum.id]: http(env.RPC_URL)
  }
});

const WalletContextProvider = ({children}) => {
  const queryClient = new QueryClient();
  const axios = useAxios();

  const userTokens = useUserStore((state) => state.userTokens);
  const login = useUserStore((state) => state.login);
  const reset = useUserStore((state) => state.reset);

  const authenticationStatus = useMemo(() => {
    return userTokens && userTokens.accessToken.length > 0 ? "authenticated" : "unauthenticated";
  }, [userTokens]);

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const url = Endpoint.getUrl("greeting");
      const response = await axios.get(url);
      return response.data.data;
    },
    createMessage: ({nonce, address, chainId}) => {
      const json = nonce;
      const statement = json.message;
      const _nonce = json.nonce;

      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: statement,
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: _nonce
      });
    },
    getMessageBody: ({message}) => {
      return message.prepareMessage();
    },
    verify: async ({message, signature}) => {
      const walletAddress = message.address;

      if (!connectWhiteList.includes(walletAddress)) {
        new Web3Exception(
          "Your wallet is not whiltelisted",
          {walletAddress, connectWhiteList},
          {sendToast: true}
        );
        return false;
      }

      const url = Endpoint.getUrl("user-login");
      const payload = {
        encodedSignature: signature,
        siweMessage: JSON.stringify(message)
      };

      try {
        const response = await axios.post(url, payload);

        const data = response.data.data;
        login({
          userTokens: {accessToken: data.accessToken, refreshToken: data.refreshToken},
          walletAddress: message.address
        });
        return true;
      } catch (error) {
        reset();
        new ApiException("Login Error", {payload}, {sendToast: true});
        return false;
      }
    },
    signOut: async () => {
      reset();
    }
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider
          enabled={true}
          adapter={authenticationAdapter}
          status={authenticationStatus}
        >
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#19FB80",
              accentColorForeground: "black",
              fontStack: "system"
            })}
            initialChain={chains[0]}
          >
            {children}
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletContextProvider;

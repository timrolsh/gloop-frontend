import {useAccount} from "wagmi";
import ConnectWalletButton from "~/components/wallet/ConnectWalletButton";
import useUserStore from "~/stores/client/user";
import Skeleton from "./Skeleton";

export default function AuthenticatedSection({className = "", height = "", children}) {
  const {isConnected} = useAccount();
  const userTokens = useUserStore((state) => state.userTokens);

  return (
    <>
      {!isConnected ? (
        <div className={`${className} authenticated-section`} style={{minHeight: height}}>
          <span className="authenticated-section-text">
            You Need to Connect Your Wallet To Access This Section
          </span>
          <ConnectWalletButton />
        </div>
      ) : (
        <Skeleton loading={!userTokens?.accessToken?.length} height={height}>
          {children}
        </Skeleton>
      )}
    </>
  );
}

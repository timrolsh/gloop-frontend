import {useEffect, useMemo, useState} from "react";
import {Button} from "react-bootstrap";
import gloop_img9_url from "../../assets/img/gmi_img9.svg";
import link_redirect from "../../assets/img/link-redirect.svg";
import dropdown_img from "../../assets/img/dropdown.svg";
import usdc_image from "../../assets/img/gloop_usdc.svg";
import gloop_image5 from "../../assets/img/gloop_img5.svg";

import Skeleton from "../Skeleton";
import {createBigNumber} from "~/utils/math";
import {truncateAmount} from "~/utils/ui";
import useGetDepositTokenBalance from "~/stores/server/lend/useGetDepositTokenBalance";
import useLendDeposit from "~/stores/server/lend/useLendDeposit";
import {ValidationException, Web3Exception} from "~/consts/exceptions";
import useGetConfigurations from "~/stores/server/core/useGetConfigurations";
import LendTokenDropdown from "./LendTokenDropdown";
import useLendStore from "~/stores/client/lend";
import {Tooltip} from "../Tooltip";
import env from "~/env";
import AsyncButton from "~/components/AsyncButton";
import PriceInput from "~/components/PriceInput";
import useUserStore from "~/stores/client/user";
import {getEffectiveUSDCBalance} from "~/web3/core";

export default function LendSupply() {
  const selectedToken = useLendStore((state) => state.selectedToken);
  const walletAddress = useUserStore((state) => state.walletAddress);
  const [effectiveBalance, setEffectiveBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const balanceQuery = useGetDepositTokenBalance({token: selectedToken});
  const configurationsQuery = useGetConfigurations({token: selectedToken});
  const {mutate: deposit} = useLendDeposit({token: selectedToken});

  const [informationVisible, setInformationVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const fetchEffectiveBalance = async () => {
      if (!walletAddress) return;
      setIsLoadingBalance(true);
      try {
        const balance = await getEffectiveUSDCBalance(walletAddress);
        setEffectiveBalance(balance);
      } catch (error) {
        console.error("Failed to fetch effective balance:", error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchEffectiveBalance();
  }, [walletAddress]);

  const handleMaxClicked = () => {
    setAmount(balanceQuery?.data?.toString());
  };

  const handleDeposit = () => {
    if (!balanceQuery.data)
      return new Web3Exception("Failed To Fetch Balance", {balanceQuery}, {sendToast: true});

    if (!amount) return new ValidationException("Fill Deposit Amount First");

    if (createBigNumber(amount).gt(maxSupply.toString()))
      return new ValidationException("Insufficient Funds");

    setButtonLoading(true);

    deposit(amount, {
      onSettled: () => {
        setButtonLoading(false);
      },
      onSuccess: () => {
        setAmount("");
      }
    });
  };

  const maxSupply = useMemo(() => {
    return Math.min(balanceQuery?.data); // configurationsQuery?.data?.lendFactor
  }, [balanceQuery]); // configurationsQuery

  const buttonDisabledReason = useMemo(() => {
    if (!balanceQuery.data) return "Failed To Fetch Balance";

    if (!amount) return "Fill Deposit Amount First";

    if (createBigNumber(amount.toString()).gt(maxSupply.toString())) return "Insufficient Funds";
  }, [amount, balanceQuery, maxSupply]);

  // Calculate New Supplied Value
  const newSuppliedValue = useMemo(() => {
    // Check if effectiveBalance is null/undefined, not if it's 0
    if (effectiveBalance === null || effectiveBalance === undefined) {
      return env.EMPTY_VALUE;
    }

    const tokenPrice = selectedToken?.price;
    if (!tokenPrice || isNaN(tokenPrice) || Number(tokenPrice) <= 0) {
      return env.EMPTY_VALUE;
    }

    // Determine the divisor based on token decimals, fallback to 10^6
    const tokenDecimals = selectedToken?.decimals;
    // Use 6 if tokenDecimals is not a number or is NaN
    const power = (typeof tokenDecimals === 'number' && !isNaN(tokenDecimals)) ? tokenDecimals : 6;
    const divisor = createBigNumber(10).pow(power);

    // Convert the current balance from raw format to user-friendly format
    const currentBalanceRaw = createBigNumber(effectiveBalance);
    const currentBalanceFormatted = divisor.isZero() ? currentBalanceRaw : currentBalanceRaw.div(divisor);

    // The new amount is already in user-friendly format, multiply by price to get USD value
    const newAmountFormatted = createBigNumber(amount || "0").mul(tokenPrice);
    
    // Add the formatted values together
    const totalSuppliedValue = currentBalanceFormatted.plus(newAmountFormatted);

    // console.log("New Supplied Value", totalSuppliedValue.toString()); // Optional: for debugging
    return totalSuppliedValue.toString();
  }, [effectiveBalance, selectedToken, amount]);

  return (
    <div className="marklendet-supply">
      <div className="mt-4">
        <div className="loop-input-title mb-2">Asset</div>
        <LendTokenDropdown />
      </div>
      <div className="mt-4">
        <div className="loop-input-title">
          <span>Supply</span>
          <Skeleton loading={balanceQuery.isLoading || balanceQuery.isFetching} width="100px">
            <span>{`Wallet Balance: ${truncateAmount(balanceQuery?.data?.toString())} ${
              selectedToken?.name || ""
            }`}</span>
          </Skeleton>
        </div>
        {selectedToken ? (
          <>
            <Skeleton
              loading={
                balanceQuery?.isLoading ||
                balanceQuery?.isFetching ||
                configurationsQuery.isLoading ||
                configurationsQuery.isFetching
              }
            >
              <div className="radius-8 bg-trans mt-2 d-flex space-between v-center p-3">
                <div className="d-flex" style={{gap: "8px"}}>
                  <img src={selectedToken?.image} width={29} />
                  <PriceInput amount={amount} setAmount={setAmount} className="font-12" />
                </div>

                <Button
                  className="max-btn market font-12 bold-300 color-gray radius-4 border-gray border-1 px-1 py-1"
                  onClick={handleMaxClicked}
                >
                  <span>MAX</span>
                </Button>
              </div>
            </Skeleton>
          </>
        ) : null}
      </div>
      <div className="mt-4 border-line"></div>
      <div className="information-card mt-4">
        <div className="toggler-bar" onClick={() => setInformationVisible(!informationVisible)}>
          <div>Supply Details</div>
          <div className="d-flex align-items-center" style={{gap: "10px"}}>
            <img src={dropdown_img} width={13} />
          </div>
        </div>
        {informationVisible && (
          <div className="mt-4">
            <div className="information-detail-items">
              <Skeleton loading={isLoadingBalance}>
                <div className="d-flex justify-content-between">
                  <span className="detail-title">Supplied Value</span>
                  <span className="detail-value">{truncateAmount(newSuppliedValue)} </span>
                </div>
              </Skeleton>
              <Skeleton loading={selectedToken.supplyApy === env.EMPTY_VALUE}>
                <div className="d-flex justify-content-between">
                  <span className="detail-title">Deposit APY</span>
                  <span className="detail-value">
                    {truncateAmount(selectedToken.supplyApy, 2)}%{" "}
                  </span>
                </div>
              </Skeleton>
            </div>
          </div>
        )}
      </div>
      <AsyncButton
        onClick={handleDeposit}
        loading={buttonLoading}
        disabledreason={buttonDisabledReason}
        className="mt-4"
      >
        Supply
      </AsyncButton>
    </div>
  );
}

import {useEffect, useMemo, useState} from "react";
import {Button} from "react-bootstrap";
import dropdown_img from "../../assets/img/dropdown.svg";
import Skeleton from "../Skeleton";
import {createBigNumber} from "~/utils/math";
import {truncateAmount} from "~/utils/ui";
import {ValidationException, Web3Exception} from "~/consts/exceptions";
import useGetWithdrawTokenBalance from "~/stores/server/lend/useGetWithdrawTokenBalance";
import useLendWithdraw from "~/stores/server/lend/useLendWithdraw";
import LendTokenDropdown from "./LendTokenDropdown";
import useLendStore from "~/stores/client/lend";
import env from "~/env";
import AsyncButton from "~/components/AsyncButton";
import PriceInput from "~/components/PriceInput";
import useUserStore from "~/stores/client/user";
import {getEffectiveUSDCBalance} from "~/web3/core";

export default function LendWithdraw() {
  const selectedToken = useLendStore((state) => state.selectedToken);
  const walletAddress = useUserStore((state) => state.walletAddress);
  const [effectiveBalance, setEffectiveBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const balanceQuery = useGetWithdrawTokenBalance({token: selectedToken});
  const {mutate: withdraw} = useLendWithdraw({token: selectedToken});

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
    if (balanceQuery?.data) {
      setAmount(balanceQuery.data.toString());
    }
  };

  const handleWithdraw = () => {
    const userBalance = balanceQuery?.data;

    if (!userBalance)
      return new Web3Exception("Failed To Fetch Balance", {balanceQuery}, {sendToast: true});

    if (!amount) return new ValidationException("Fill Withdraw Amount First");

    if (createBigNumber(amount).gt(userBalance.toString()))
      return new ValidationException("Withdraw Amount Is Greater Than Max Withdrawable Amount");

    setButtonLoading(true);

    withdraw(amount, {
      onSettled: () => {
        setButtonLoading(false);
      },
      onSuccess: () => {
        setAmount("");
      }
    });
  };

  const buttonDisabledReason = useMemo(() => {
    const userBalance = balanceQuery?.data;

    if (!userBalance) return "Failed To Fetch Balance";

    if (!amount) return "Fill Withdraw Amount First";

    if (createBigNumber(amount.toString()).gt(userBalance.toString()))
      return "Withdraw Amount Is Greater Than Max Withdrawable Amount";

    return null;
  }, [amount, balanceQuery]);

  // Calculate New Deposited Value
  const newDepositedValue = useMemo(() => {
    if (effectiveBalance === null || effectiveBalance === undefined) {
      return env.EMPTY_VALUE;
    }

    const currentBalance = createBigNumber(effectiveBalance);
    const withdrawAmount = createBigNumber(amount || "0").mul(selectedToken?.price || 0);
    
    return currentBalance.minus(withdrawAmount).toString();
  }, [effectiveBalance, selectedToken, amount]);

  return (
    <div className="marklendet-supply">
      <div className="mt-4">
        <div className="loop-input-title mb-2">Asset</div>
        <LendTokenDropdown />
      </div>
      <div className="mt-4">
        <div className="loop-input-title">
          <span>Withdraw</span>
          <Skeleton
            loading={balanceQuery?.isLoading || balanceQuery.isFetching}
            height="20px"
            width="100px"
          >
            <span>{`User's Pool Balance: ${truncateAmount(balanceQuery?.data?.toString())} ${
              selectedToken?.name
            }`}</span>
          </Skeleton>
        </div>
        {selectedToken ? (
          <>
            <Skeleton loading={balanceQuery?.isLoading || balanceQuery?.isFetching}>
              <div className="radius-8 bg-trans mt-2 d-flex space-between v-center p-3">
                <div className="d-flex" style={{gap: "8px"}}>
                  <img src={selectedToken?.image} width={29} alt="" />
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
          <div>Withdraw Details</div>
          <div className="d-flex align-items-center" style={{gap: "10px"}}>
            <img src={dropdown_img} width={13} alt="" />
          </div>
        </div>
        {informationVisible && (
          <div className="mt-4">
            <div className="information-detail-items">
              <Skeleton loading={isLoadingBalance}>
                <div className="d-flex justify-content-between">
                  <span className="detail-title">Deposited Value</span>
                  <span className="detail-value">{truncateAmount(newDepositedValue)} </span>
                </div>
              </Skeleton>
            </div>
          </div>
        )}
      </div>
      <AsyncButton
        onClick={handleWithdraw}
        loading={buttonLoading}
        disabledreason={buttonDisabledReason}
        className="mt-4"
      >
        Withdraw
      </AsyncButton>
    </div>
  );
}

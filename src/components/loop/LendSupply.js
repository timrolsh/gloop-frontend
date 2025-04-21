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

export default function LendSupply() {
  const selectedToken = useLendStore((state) => state.selectedToken);

  const balanceQuery = useGetDepositTokenBalance({token: selectedToken});

  const configurationsQuery = useGetConfigurations({token: selectedToken});
  const {mutate: deposit} = useLendDeposit({token: selectedToken});

  const [informationVisible, setInformationVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

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
    if (
      !selectedToken ||
      selectedToken.price === env.EMPTY_VALUE ||
      selectedToken.userPoolBalance === env.EMPTY_VALUE
    )
      return env.EMPTY_VALUE;

    return createBigNumber(selectedToken.userPoolBalance)
      .plus(createBigNumber(amount || "0").mul(selectedToken.price))
      .toString();
  }, [selectedToken, amount]);

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
              {/* <Skeleton loading={LendAPYQuery.isLoading}>
                <div className='d-flex justify-content-between'>
                  <span className='detail-title'>Supply APY</span>

                  <Tooltip placement='bottom-end' tooltipitem={
                    <div className='tooltip-body d-flex flex-column gap-2'>
                      <div className='d-flex justify-content-between'>
                        <span className='detail-title'>Base APY</span>
                        <span className='detail-value'>0%</span>
                      </div>
                      <div className='d-flex justify-content-between'>
                        <span className='detail-title'>Bonus APR</span>
                        <span className='detail-value'>0%</span>
                      </div>

                      <span style={{ color: '#fff', fontSize: '14px' }}>The Bonus APR will be distributed as ARB tokens. <a href={env.DOCS_URL}>Learn more.</a></span>
                    </div>

                  }>
                    <span className='detail-value primary-tooltip'>{LendAPYQuery?.data}%</span>
                  </Tooltip>

                </div>
              </Skeleton> */}

              <Skeleton loading={newSuppliedValue === env.EMPTY_VALUE}>
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

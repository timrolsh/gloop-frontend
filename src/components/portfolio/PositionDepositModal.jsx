import {useMemo, useState} from "react";
import {Button, Modal} from "react-bootstrap";

import market_info from "../../assets/img/market-info.svg";
import env from "~/env";
import {createBigNumber} from "~/utils/math";
import Skeleton from "../Skeleton";
import PriceInput from "../PriceInput";
import {ValidationException, Web3Exception} from "~/consts/exceptions";
import AsyncButton from "../AsyncButton";
import useGetDepositTokenBalance from "~/stores/server/lend/useGetDepositTokenBalance";
import useLendDeposit from "~/stores/server/lend/useLendDeposit";
import {truncateAmount, getTokenShortName} from "~/utils/ui";
import HealthFactor from "../health-factor/HealthFactor";

export default function PositionDepositModal({position, onClose = () => {}}) {
  const balanceQuery = useGetDepositTokenBalance({token: position});
  const {mutate: deposit} = useLendDeposit({token: position});

  const [withdrawDetaiVisible, setWithdrawDetailVisible] = useState(true);
  const [amount, setAmount] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleMaxClicked = () => {
    setAmount(balanceQuery?.data?.toString());
  };

  const handleDeposit = () => {
    if (!balanceQuery.data)
      return new Web3Exception("Failed To Fetch Balance", {balanceQuery}, {sendToast: true});

    if (!amount) return new ValidationException("Fill Deposit Amount First");

    if (createBigNumber(amount.toString()).gt(inputMax.toString()))
      return new ValidationException("Insufficient Funds");

    setButtonLoading(true);

    deposit(amount, {
      onSettled: () => {
        setButtonLoading(false);
      },
      onSuccess: () => {
        setAmount("");
        onClose();
      }
    });
  };

  const inputMax = useMemo(() => {
    return balanceQuery?.data;
  }, [balanceQuery]);

  const buttonDisabledReason = useMemo(() => {
    if (!balanceQuery.data) return "Failed To Fetch Balance";

    if (!amount) return "Fill Deposit Amount First";

    if (createBigNumber(amount.toString()).gt(inputMax.toString())) return "Insufficient Funds";
  }, [amount, balanceQuery, inputMax]);

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      className="buy_gloop_modal"
      dialogClassName="modal-custom-size"
    >
      <Modal.Body className="p-4 radius-8 bg-trans1 border-dark w-100">
        <div className="font-18 bold-600 color-white">Deposit</div>
        <div>
          <hr className="hr-3 border-dark-green" />
        </div>

        <div className="mt-4 mb-4 loop-info">
          <div className="title">
            <img src={market_info} width={14} className="me-2" />
            Deposit
          </div>
          <div className="mt-2">
            Deposit collateral to borrow USDC. Make sure your Health Factor remains above 100%.
          </div>
        </div>

        <div className="radius-8 border-2 border-dark-green p-3 mt-4">
          <div className="d-flex space-between v-center">
            <div className="font-16 bold-700 color-white">Details</div>
            <div
              className="radius-8 bg-trans px-3 py-2 font-14 bold-700 color-white cursur-pointer"
              onClick={() => setWithdrawDetailVisible(!withdrawDetaiVisible)}
            >
              {withdrawDetaiVisible ? "Hide" : "Show"}
            </div>
          </div>
          <div
            className={`d-flex v-center space-between mt-2 ${
              !withdrawDetaiVisible ? "d-none" : ""
            }`}
          >
            <div>
              <div className="font-16 bold-300 color-gray my-2">
                <span className="mr-10">Collateral</span>
              </div>
            </div>
            <div className="text-end">
              <div className="font-16 bold-700 color-green my-2">Enabled</div>
            </div>
          </div>
          <div className={`d-flex v-center space-between ${!withdrawDetaiVisible ? "d-none" : ""}`}>
            <div>
              <div className="font-16 bold-300 color-gray my-2">
                <span className="mr-10">Health Factor</span>
              </div>
            </div>
            <div className="text-end">
              <HealthFactor token={position} increase={true} amount={amount} />
            </div>
          </div>
        </div>

        <div className="w-100 mt-4 d-flex justify-content-between align-items-center">
          <div className="font-14 bold-400 color-gray"></div>
          <Skeleton
            loading={balanceQuery.isLoading || balanceQuery.isFetching}
            width="100px"
            height="20px"
          >
            <span className="font-14 bold-400 color-gray">{`Balance: ${truncateAmount(
              balanceQuery?.data?.toString()
            )} ${getTokenShortName(position.name || "")}`}</span>
          </Skeleton>
        </div>

        <Skeleton loading={position.userBorrows === env.EMPTY_VALUE}>
          <div
            style={{padding: "8px 18px"}}
            className="radius-8 bg-trans mt-2 desktop-flex space-between v-center"
          >
            <div className="w-95-100 d-flex v-center my-1 mr-10">
              {position ? (
                <>
                  <img src={position?.image} width={29} className="mr-10" alt={position?.name} />
                  <PriceInput amount={amount} setAmount={setAmount} />{" "}
                  <span className="font-18 bold-400 color-gray mr-10"> {getTokenShortName(position?.name || "")}</span>
                </>
              ) : null}
            </div>
            <div className="w-5-100 d-flex v-center flex-end my-2">
              <Button
                className="max-btn market font-12 bold-300 color-gray radius-4 border-gray border-1 px-1 py-1"
                onClick={handleMaxClicked}
              >
                <span>MAX</span>
              </Button>
            </div>
          </div>
        </Skeleton>
        <div className="mt-2">
          <AsyncButton
            onClick={handleDeposit}
            loading={buttonLoading}
            disabledreason={buttonDisabledReason}
            className="mt-4"
          >
            Deposit
          </AsyncButton>
        </div>
      </Modal.Body>
    </Modal>
  );
}

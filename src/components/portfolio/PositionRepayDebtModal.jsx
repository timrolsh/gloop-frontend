import {useMemo, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import env from "~/env";
import {createBigNumber} from "~/utils/math";
import {truncateAmount, getTokenShortName} from "~/utils/ui";
import Skeleton from "../Skeleton";
import PriceInput from "../PriceInput";
import {ValidationException} from "~/consts/exceptions";
import AsyncButton from "../AsyncButton";
import useRepayDebt from "~/stores/server/borrow/useRepayDebt";
import HealthFactor from "../health-factor/HealthFactor";
import useGetDepositTokenBalance from "~/stores/server/lend/useGetDepositTokenBalance";

export default function PositionRepayDebtModal({position, onClose = () => {}}) {
  const [repayDetailVisible, setRepayDetailVisible] = useState(true);
  const [amount, setAmount] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const {mutate: repay} = useRepayDebt({token: position});
  const balanceQuery = useGetDepositTokenBalance({token: position});

  const handleMaxClicked = () => {
    setAmount(position.userBorrows);
  };

  const handleRepay = () => {
    if (!amount) return new ValidationException("Fill Repay Amount First");

    if (createBigNumber(amount.toString()).gt(inputMax.toString()))
      return new ValidationException("Amount Is Greater Than Debt Size");

    setButtonLoading(true);

    repay(amount, {
      onSettled: () => {
        setButtonLoading(false);
      },
      onSuccess: () => {
        setAmount("");
        onClose();
      }
    });
  };

  const debt = useMemo(() => {
    if (position.userBorrows === env.EMPTY_VALUE) return env.EMPTY_VALUE;

    let debt = `${truncateAmount(position.userBorrows)} ${getTokenShortName(position.name)}`;

    if (position.price !== env.EMPTY_VALUE) {
      const debtInUSD = createBigNumber(position.price).mul(position.userBorrows).toString();
      debt += ` (≈$${truncateAmount(debtInUSD, 2)})`;
    }

    return debt;
  }, [position.userBorrows, position.name]);

  const remainingDebt = useMemo(() => {
    if (position.userBorrows === env.EMPTY_VALUE) return env.EMPTY_VALUE;

    let wantToRepay = 0;

    if (amount && parseFloat(amount) !== 0) wantToRepay = amount;

    let remaining = createBigNumber(position.userBorrows).minus(wantToRepay).toString();
    remaining = createBigNumber(remaining).lt(0) ? 0 : remaining;

    let returnValue = `${truncateAmount(remaining)} ${getTokenShortName(position.name)}`;

    if (position.price !== env.EMPTY_VALUE) {
      const remainingInUSD = createBigNumber(position.price).mul(remaining).toString();
      returnValue += ` (≈$${truncateAmount(remainingInUSD, 2)})`;
    }

    return returnValue;
  }, [position.userBorrows, position.name, amount]);

  const inputMax = useMemo(() => {
    return position.userBorrows;
  }, [position.userBorrows]);

  const buttonDisabledReason = useMemo(() => {
    if (!amount) return "Fill Repay Amount First";

    if (balanceQuery.isLoading) return "Fetching Balance...";

    if (createBigNumber(amount).gt(balanceQuery.data)) return "Insufficient Funds";

    if (createBigNumber(amount.toString()).gt(inputMax.toString()))
      return "Amount Is Greater Than Debt Size";
  }, [amount, inputMax]);

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      className="buy_gloop_modal"
      dialogClassName="modal-custom-size"
    >
      <Modal.Body className="p-4 radius-8 bg-trans1 border-dark w-100">
        <div className="font-18 bold-600 color-white">Repay Debt</div>
        <div>
          <hr className="hr-3 border-dark-green" />
        </div>
        <div className="radius-8 border-2 border-dark-green p-3 mt-4">
          <div className="d-flex space-between v-center">
            <div className="font-16 bold-700 color-white">Details</div>
            <div
              className="radius-8 bg-trans px-3 py-2 font-14 bold-700 color-white cursur-pointer"
              onClick={() => setRepayDetailVisible(!repayDetailVisible)}
            >
              {repayDetailVisible ? "Hide" : "Show"}
            </div>
          </div>
          <div
            className={`d-flex v-center space-between mt-2 ${!repayDetailVisible ? "d-none" : ""}`}
          >
            <div>
              <div className="font-16 bold-300 color-gray my-2">
                <span className="mr-10">Debt</span>
                {/* <Info content="Lorem ipsum dolor sit amet consectetur lorem11155" /> */}
              </div>
            </div>
            <div className="text-end">
              <Skeleton loading={debt === env.EMPTY_VALUE} width="80px">
                <div className="font-16 bold-700 color-white my-2">{debt}</div>
              </Skeleton>
            </div>
          </div>
          <div className={`d-flex v-center space-between ${!repayDetailVisible ? "d-none" : ""}`}>
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

        <div className="d-flex v-center mt-4 mb-2">
          <div className="font-14 bold-400 color-gray">Repay</div>
          <div className="w-100 d-flex justify-content-between align-items-center">
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
        <div className="d-flex v-center space-between mt-2">
          <div>
            <div className="font-16 bold-300 color-gray my-2">
              <span className="mr-10">Remaining Debt</span>
            </div>
          </div>
          <div className="text-end">
            <Skeleton loading={remainingDebt === env.EMPTY_VALUE} width="80px">
              <div className="font-16 bold-700 color-white my-2">{remainingDebt}</div>
            </Skeleton>
          </div>
        </div>
        {/* <div className='d-flex v-center space-between mt-1'>
          <div>
            <div className='font-16 bold-300 color-gray my-2'>
              <span className='mr-10' >New Health Factor</span>
            </div>
          </div>
          <div className='text-end'>
            <Skeleton loading={newHealthFactorQuery.isLoading} width='80px'>
              <div className='font-16 bold-700 color-white my-2'>
                {truncateAmount(newHealthFactorQuery.data, 2)}%
              </div>
            </Skeleton>
          </div>
        </div> */}

        <div className="mt-2">
          <AsyncButton
            onClick={handleRepay}
            loading={buttonLoading}
            disabledreason={buttonDisabledReason}
            className="mt-4"
          >
            Repay Debt
          </AsyncButton>
        </div>
      </Modal.Body>
    </Modal>
  );
}

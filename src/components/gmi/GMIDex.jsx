import GMITokenDropdown from "./GMITokenDropdown";

import DexTokensDropdown from "./DexTokensDropdown";
import useGmiStore from "~/stores/client/gmi";

import gmi_img8_url from "../../assets/img/gmi_img8.svg";
import {useMemo, useState} from "react";
import useGetTrasnferFee from "~/stores/server/gmi/useGetTrasnferFee";
import {truncateAmount} from "~/utils/ui";
import Skeleton from "../Skeleton";
import useGetDexSlippage from "~/stores/server/gmi/useGetDexSlippage";
import {ValidationException} from "~/consts/exceptions";
import AsyncButton from "../AsyncButton";
import useDexDeposit from "~/stores/server/gmi/useDexDeposit";
import useDexWithdraw from "~/stores/server/gmi/useDexWithdraw";
import env from "~/env";
import {createBigNumber} from "~/utils/math";
import useGetGMIBalance from "~/stores/server/gmi/useGetGMIBalance";
import useGetDepositTokenBalance from "~/stores/server/lend/useGetDepositTokenBalance";
import useGetLowestFeeToken from "~/stores/server/gmi/useGetDexLowestFeeToken";
import useGetGMIPrice from "~/stores/server/gmi/useGetGMIPrice";
import useGMXDeposit from "~/stores/server/gmi/useGMXDeposit";
import AuthenticatedSection from "../AuthenticatedSection";

export default function GMIDex() {
  const selectedToken = useGmiStore((state) => state.selectedToken);
  const withdrawal = useGmiStore((state) => state.withdrawal);
  const setWithdrawal = useGmiStore((state) => state.setWithdrawal);

  const [amount, setAmount] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const getTrasnferFeeQuery = useGetTrasnferFee({token: selectedToken, withdrawal, amount});
  const slippageQuery = useGetDexSlippage({});

  const GMIBalanceQuery = useGetGMIBalance({});
  const dexBalanceQuery = useGetDepositTokenBalance({token: selectedToken});
  const GMIPriceQuery = useGetGMIPrice({});
  const lowestDepositFeeTokenQuery = useGetLowestFeeToken({});

  const {mutate: deposit} = useDexDeposit({token: selectedToken});
  const {mutate: GMXDeposit} = useGMXDeposit({token: lowestDepositFeeTokenQuery.data});
  const {mutate: withdraw} = useDexWithdraw({token: selectedToken});

  const changeActiveTab = (withdrawal) => {
    clearForm();
    setWithdrawal(withdrawal);
  };

  const clearForm = () => {
    setAmount("");
  };

  const handleTransfer = () => {
    if (!amount) return new ValidationException("Fill Amount First");

    if (!slippageQuery.data) return new ValidationException("Slippage Is Required");

    if (withdrawal) {
      if (
        !GMIBalanceQuery.data ||
        GMIBalanceQuery.isLoading ||
        GMIBalanceQuery.data === env.EMPTY_VALUE
      )
        return new ValidationException("Failed To Calculate GMI Balance");

      if (createBigNumber(amount).gt(GMIBalanceQuery.data))
        return new ValidationException("Insufficient Funds");
    } else {
      if (
        !dexBalanceQuery.data ||
        dexBalanceQuery.isLoading ||
        dexBalanceQuery.data === env.EMPTY_VALUE
      )
        return new ValidationException(`Failed To Calculate ${selectedToken.name} Balance`);

      if (createBigNumber(amount).gt(dexBalanceQuery.data))
        return new ValidationException("Insufficient Funds");
    }

    setButtonLoading(true);

    const transfer = withdrawal ? withdraw : selectedToken.name === "USDC" ? GMXDeposit : deposit;

    transfer(
      {amount},
      {
        onSettled: () => {
          setButtonLoading(false);
        },
        onSuccess: () => {
          clearForm();
        }
      }
    );
  };

  const buttonDisabledReason = useMemo(() => {
    if (withdrawal) {
      if (
        !GMIBalanceQuery.data ||
        GMIBalanceQuery.isLoading ||
        GMIBalanceQuery.data === env.EMPTY_VALUE
      )
        return "Failed To Fetch Balance";

      if (createBigNumber(amount.toString()).gt(GMIBalanceQuery.data.toString()))
        return "Requested Amount Is Greater Than Supplied Amount";

      if (selectedToken.dexTotalSupply === env.EMPTY_VALUE) return "Fetching Total Supply...";

      if (createBigNumber(selectedToken.dexTotalSupply).lte(0)) return "Pool Is Empty";
    } else {
      if (
        !dexBalanceQuery.data ||
        dexBalanceQuery.isLoading ||
        dexBalanceQuery.data === env.EMPTY_VALUE
      )
        return "Failed To Fetch Balance";

      if (createBigNumber(amount.toString()).gt(dexBalanceQuery.data.toString()))
        return "Insufficient Funds";
    }

    if (!amount) return "Fill Amount First";

    if (!slippageQuery.data || slippageQuery.data === env.EMPTY_VALUE)
      return "Fetching Slippage...";
  }, [amount, slippageQuery.data, selectedToken, GMIBalanceQuery, dexBalanceQuery]);

  const feeAmount = useMemo(() => {
    return (Number(getTrasnferFeeQuery.data * amount) / 100).toFixed(4);
  }, [getTrasnferFeeQuery, amount]);

  const estimatedAmountOut = useMemo(() => {
    if (!amount) return;

    if (
      GMIPriceQuery.isLoading ||
      getTrasnferFeeQuery.isLoading ||
      (selectedToken.name !== "USDC" && selectedToken.dexPrice === env.EMPTY_VALUE)
    )
      return env.EMPTY_VALUE;

    const price = selectedToken.name === "USDC" ? 1 : selectedToken.dexPrice;
    const backup = createBigNumber(price).mul(amount.toString());

    return backup
      .div(GMIPriceQuery.data)
      .mul(100 - Number(getTrasnferFeeQuery.data))
      .div(100)
      .toString();
  }, [selectedToken, GMIPriceQuery, getTrasnferFeeQuery]);

  const estimatedAmountIn = useMemo(() => {
    if (!amount) return;

    if (
      GMIPriceQuery.isLoading ||
      getTrasnferFeeQuery.isLoading ||
      (selectedToken.name !== "USDC" && selectedToken.dexPrice === env.EMPTY_VALUE)
    )
      return env.EMPTY_VALUE;

    const price = selectedToken.name === "USDC" ? 1 : selectedToken.dexPrice;
    const backup = createBigNumber(amount).div(price.toString());

    return backup
      .mul(GMIPriceQuery.data)
      .mul(100 - Number(getTrasnferFeeQuery.data))
      .div(100)
      .toString();
  }, [selectedToken, GMIPriceQuery, getTrasnferFeeQuery]);

  return (
    <AuthenticatedSection height="500px">
      <div className="radius-8 bg-trans p-4 min-h-470">
        <div className="d-flex v-center space-between">
          <div className="w-100">
            <div
              className="font-18 bold-600 color-white text-center cursur-pointer py-2"
              onClick={() => changeActiveTab(false)}
            >
              Deposit
            </div>
            <hr className={`hr-3 border-dark-green ${!withdrawal ? "active_gmi_tab" : ""}`} />
          </div>
          <div className="w-100">
            <div
              className="font-18 bold-600 color-white text-center cursur-pointer py-2"
              onClick={() => changeActiveTab(true)}
            >
              Withdraw
            </div>
            <hr className={`hr-3 border-dark-green ${withdrawal ? "active_gmi_tab" : ""}`} />
          </div>
        </div>
        <div>
          <div>
            {!withdrawal ? (
              <DexTokensDropdown
                amount={amount}
                setAmount={setAmount}
                withdrawal={withdrawal}
                estimatedAmountIn={estimatedAmountIn}
              />
            ) : (
              <GMITokenDropdown
                amount={amount}
                setAmount={setAmount}
                withdrawal={withdrawal}
                estimatedAmountOut={estimatedAmountOut}
              />
            )}
          </div>
          <div className="text-center btn-swap">
            <img
              src={gmi_img8_url}
              width={48}
              className="cursur-pointer"
              onClick={() => changeActiveTab(!withdrawal)}
            />
          </div>
          <div>
            {withdrawal ? (
              <DexTokensDropdown
                amount={amount}
                setAmount={setAmount}
                withdrawal={withdrawal}
                estimatedAmountIn={estimatedAmountIn}
              />
            ) : (
              <GMITokenDropdown
                amount={amount}
                setAmount={setAmount}
                withdrawal={withdrawal}
                estimatedAmountOut={estimatedAmountOut}
              />
            )}
          </div>
          <div className="mt-4 d-flex flex-column" style={{gap: "8px"}}>
            <div className="d-flex space-between v-center">
              <div>
                <span className="mr-10 font-16 bold-300 color-gray">Fees</span>
              </div>
              <Skeleton loading={getTrasnferFeeQuery.isLoading} width="80px" height="20px">
                <div
                  title={`$${feeAmount} (${getTrasnferFeeQuery.data}%)`}
                  className="font-16 bold-700 color-white"
                >
                  {getTrasnferFeeQuery.data ? (
                    <span>
                      ${truncateAmount(feeAmount)} ({truncateAmount(getTrasnferFeeQuery.data, 2)}%)
                    </span>
                  ) : null}
                </div>
              </Skeleton>
            </div>
            {/* <div className='d-flex space-between v-center'>
                        <div>
                            <span className='mr-10 font-16 bold-300 color-gray' >Slippage</span>
                        </div>
                        <Skeleton loading={slippageQuery.isLoading} width='80px' height='20px'>
                            <div className='font-16 bold-700 color-white'>
                                {truncateAmount(slippageQuery.data)}%
                            </div>
                        </Skeleton>
                    </div> */}
            <div>
              <AsyncButton
                disabledreason={buttonDisabledReason}
                loading={buttonLoading}
                onClick={handleTransfer}
                className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2 w-100"
              >
                {withdrawal ? "Withdraw" : "Deposit"}
              </AsyncButton>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedSection>
  );
}

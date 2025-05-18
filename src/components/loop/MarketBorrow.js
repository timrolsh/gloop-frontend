import {useMemo, useState} from "react";
import BigNumber from "bignumber.js";
import gloop_img3_url from "../../assets/img/gmi_img3.svg";
import market_info from "../../assets/img/market-info.svg";
import dropdown_img from "../../assets/img/dropdown.svg";
import back_img_url from "../../assets/img/back-icon.svg";
import useBorrowStore from "~/stores/client/borrow";
import Skeleton from "../Skeleton";
import env from "~/env";
import {createBigNumber} from "~/utils/math";
import {truncateAmount} from "~/utils/ui";
import useGetHealthFactor from "~/stores/server/core/useGetHealthFactor";
import useGetConfigurations from "~/stores/server/core/useGetConfigurations";
import useGetMaxBorrowableValue from "~/stores/server/borrow/useGetMaxBorrowableValue";
import useBorrow from "~/stores/server/borrow/useBorrow";
import {ValidationException} from "~/consts/exceptions";
import AsyncButton from "~/components/AsyncButton";
import PriceInput from "~/components/PriceInput";
import useGetTokensList from "~/stores/server/core/useGetTokensList";
import HealthFactor from "../health-factor/HealthFactor";

export default function MarketBorrow() {
  const selectedMarket = useBorrowStore((state) => state.selectedMarket);
  const setSelectedMarket = useBorrowStore((state) => state.setSelectedMarket);


  const [informationVisible, setInformationVisible] = useState(true);
  const [amount, setAmount] = useState("");
  const amountPercentages = [25, 50, 75, 100];
  const [selectedAmountPercentage, setSelectedAmountPercentage] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  const healthFactorQuery = useGetHealthFactor({token: selectedMarket, amount});
  const configurationsQuery = useGetConfigurations({token: selectedMarket});
  const maxBorrowAbleQuery = useGetMaxBorrowableValue({});
  const tokenListQuery = useGetTokensList({});

  const {mutate: borrow} = useBorrow({token: selectedMarket});
  const handleBorrow = () => {
    if (!amount) return new ValidationException("Fill Borrow Amount First");

    if (createBigNumber(amount).gt(maxBorrowAble.toString()))
      return new ValidationException("Borrow Amount Is Greater Than Max Borrowable Amount");

    setButtonLoading(true);

    borrow(amount, {
      onSettled: () => {
        setButtonLoading(false);
      },
      onSuccess: () => {
        setAmount("");
      }
    });
  };

  const handleSetSelectedAmountPercentage = (item) => {
    // set the selected health factor
    setSelectedAmountPercentage(item);
    const percent = item === 100 ? 99 : item; // adds a little buffering room when 100% is selected

    const decimals = selectedMarket?.decimals;
    if (!decimals) {
      // Should not happen if selectedMarket is loaded, which maxBorrowAble depends on
      console.error("Selected market decimals not available for setting amount.");
      return;
    }
    // Hanlde changing amount value based on the selected health factor
    // Use dynamic decimals and ROUND_DOWN
    setAmount(createBigNumber(maxBorrowAble).mul(percent).div(100).toFixed(decimals, 1));
  };

  const borrowHealthy = useMemo(() => {
    return createBigNumber(healthFactorQuery?.data || 0).gte(100);
  }, [amount, healthFactorQuery]);

  const maxBorrowAble = useMemo(() => {
    if (
      !selectedMarket ||
      maxBorrowAbleQuery.isLoading ||
      maxBorrowAbleQuery.data === undefined ||
      // Indicates current borrows not loaded or zero
      selectedMarket.userBorrows === env.EMPTY_VALUE ||
      selectedMarket.availableLiquidity === undefined ||
      // Indicates available liquidity not loaded or zero
      selectedMarket.availableLiquidity === env.EMPTY_VALUE ||
      selectedMarket.decimals === undefined
    ) {
      return "0";
    }

    const decimals = selectedMarket.decimals;

    // 1. Max additional borrow based on Health Factor and current debt
    // maxBorrowAbleQuery.data is the total value one could borrow (from zero debt) to reach the HF limit (string, standard units).
    const maxTotalBorrowForHF = createBigNumber(maxBorrowAbleQuery.data);
    // selectedMarket.userBorrows is current debt (string, standard units).
    const currentUserBorrows = createBigNumber(
      selectedMarket.userBorrows === env.EMPTY_VALUE ? "0" : selectedMarket.userBorrows
    );

    let maxAdditionalBorrowBasedOnHF = maxTotalBorrowForHF.minus(currentUserBorrows);

    // 2. Available liquidity in the pool for the selected market (USDC)
    // selectedMarket.availableLiquidity (string, standard units).
    const availableLiquidityInPool = createBigNumber(
      selectedMarket.availableLiquidity === env.EMPTY_VALUE
        ? "0"
        : selectedMarket.availableLiquidity
    );

    // Determine the limiting factor: lesser of HF-based borrow or available pool liquidity
    let finalMaxBorrowAble = BigNumber.min(
      maxAdditionalBorrowBasedOnHF,
      availableLiquidityInPool
    );

    if (finalMaxBorrowAble.lte(0)) {
      return "0";
    }

    // Format to the token's decimals, rounding down (mode 1 for Decimal.js like libraries)
    return finalMaxBorrowAble.toFixed(decimals, 1);
  }, [maxBorrowAbleQuery.data, selectedMarket]);

  const buttonDisabledReason = useMemo(() => {
    if (!amount || createBigNumber(amount).lte(0)) return "Fill Borrow Amount First";

    if (createBigNumber(amount.toString()).gt(maxBorrowAble.toString()))
      return "Requested Amount Is Greater Than Max Borrowable Allowed";

    if (healthFactorQuery.isLoading) return "Calculating Health Factor...";

    if (!borrowHealthy) return "Health Factor Is Below 100%";
  }, [amount, borrowHealthy, healthFactorQuery, maxBorrowAble]);

  const usdcToken = useMemo(() => {
    if (tokenListQuery.isLoading || !tokenListQuery.data) return env.EMPTY_VALUE;

    return (tokenListQuery.data || []).find((x) => x.name === "USDC");
  }, [tokenListQuery.data]);

  const totalCollateralValue = useMemo(() => {
    if (tokenListQuery.isLoading || !tokenListQuery.data) return env.EMPTY_VALUE;

    const depositedTokens = (tokenListQuery.data || []).filter(
      (x) =>
        x.collateral &&
        x.userPoolBalance !== env.EMPTY_VALUE &&
        x.price !== env.EMPTY_VALUE &&
        createBigNumber(x.userPoolBalance.toString()).gt(0)
    );

    let totalCollertalUSD = createBigNumber(0);

    for (const token of depositedTokens) {
      const depositUSD = createBigNumber(token.userPoolBalance).mul(token.price).toString();
      totalCollertalUSD = totalCollertalUSD.plus(depositUSD);
    }

    return totalCollertalUSD.toString();
  }, [tokenListQuery.data]);

  const totalDebt = useMemo(() => {
    if (!usdcToken || usdcToken === env.EMPTY_VALUE) return env.EMPTY_VALUE;

    return createBigNumber(usdcToken.userBorrows.toString())
      .plus(amount || "0")
      .toString();
  }, [usdcToken, amount]);

  return (
    <>
      <div className="d-flex v-center space-between">
        <div className="w-100 cursur-pointer">
          <div
            className="font-18 bold-600 color-white cursor-pointer"
            onClick={() => setSelectedMarket(null)}
          >
            <img src={back_img_url} width={14} className="me-2" />
            Back
          </div>
          <hr className="hr-3 border-dark-green" />
        </div>
      </div>
      <div className="market-loop">
        <div className="mt-2 loop-info">
          <div className="title">
            <img src={market_info} width={14} className="me-2" />
            Borrow
          </div>
          <div className="mt-2">
            Borrow up to the LTV of your deposited collateral. See the Transaction Details section
            to make sure your Health Factor remains above 100%.
          </div>
        </div>

        {/* <div className='mt-4'>
          {
            createBigNumber(maxBorrowAble.toString() || '0').lte(0)
              ?
              <div className='no-balance-alert'>
                <span>
                  <img src={warning_market} width={20} className='me-3' />
                  Max Borrowable Is 0
                </span>
              </div>
              : null
          }

        </div> */}

        <div className="mt-4">
          <div className="loop-input-title">
            Borrowed
            {/* {
              createBigNumber(amount || 0).gt(0)
                ? <Skeleton loading={healthFactorQuery.isLoading || healthFactorQuery.isFetching || healthFactorQuery?.data === env.EMPTY_VALUE} height='20px' width='100px'>
                  <span>Health Factor: {healthFactorQuery.data}%</span>
                </Skeleton>
                : null
            } */}
          </div>

          <Skeleton
            loading={
              !selectedMarket.userPoolBalance ||
              selectedMarket.userPoolBalance === env.EMPTY_VALUE ||
              configurationsQuery.isLoading ||
              configurationsQuery.isFetching
            }
          >
            <div
              style={{padding: "8px 18px"}}
              className="radius-8 bg-trans mt-2 desktop-flex space-between v-center"
            >
              <div className="w-100 d-flex v-center my-1">
                <img src={gloop_img3_url} width={29} className="mr-10" />
                <PriceInput
                  amount={amount}
                  onChange={() => setSelectedAmountPercentage(null)}
                  setAmount={setAmount}
                />{" "}
                <span className="font-18 bold-400 color-gray">USDC</span>
              </div>
              {/* <div className='w-5-100 d-flex v-center flex-end my-2'>

                <Button className='max-btn market font-12 bold-300 color-gray radius-4 border-gray border-1 px-1 py-1' onClick={handleMaxClicked}>
                  <span>MAX</span>
                </Button>
              </div> */}
            </div>
          </Skeleton>

          <div className="health-factor-items">
            {amountPercentages.map((item, index) => (
              <div
                key={item}
                className={`health-factor-item ${selectedAmountPercentage === item && "active"}`}
                onClick={() => handleSetSelectedAmountPercentage(item)}
              >
                {item}% {index === amountPercentages.length - 1 && "(max)"}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 border-line"></div>
        <div className="information-card mt-4">
          <div className="toggler-bar" onClick={() => setInformationVisible(!informationVisible)}>
            <div>Transaction Details</div>
            <div className="d-flex align-items-center" style={{gap: "10px"}}>
              <Skeleton loading={selectedMarket.borrowApy === env.EMPTY_VALUE} width="100px">
                <div className="apy-rate">
                  {truncateAmount(selectedMarket.borrowApy, 2)}% Borrow APY
                </div>
              </Skeleton>
              <Skeleton loading={selectedMarket.supplyApy === env.EMPTY_VALUE} width="100px">
                <div className="apy-rate">
                  {truncateAmount(selectedMarket.supplyApy, 2)}% Supply APY
                </div>
              </Skeleton>
              <img src={dropdown_img} width={13} />
            </div>
          </div>
          {informationVisible && (
            <div className="mt-4">
              <div className="information-detail-title">Position</div>
              <div className="border-line my-3"></div>
              <div className="information-detail-items">
                <div className="d-flex justify-content-between">
                  <span className="detail-title">Health Factor</span>
                  <HealthFactor token={selectedMarket} increase={false} amount={amount} />
                </div>
                <div className="d-flex justify-content-between">
                  <span className="detail-title">USDC Borrowed</span>
                  <span className="detail-value">{truncateAmount(amount || "0")}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="detail-title">Total Collateral Value</span>
                  <Skeleton
                    loading={totalCollateralValue === env.EMPTY_VALUE}
                    width="80px"
                    height="30px"
                  >
                    <span className="detail-value">${truncateAmount(totalCollateralValue, 2)}</span>
                  </Skeleton>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="detail-title">Total Debt</span>
                  <Skeleton loading={totalDebt === env.EMPTY_VALUE} width="80px" height="30px">
                    <span className="detail-value">{truncateAmount(totalDebt, 2)} USDC</span>
                  </Skeleton>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="d-flex aligm-items-center gap-2 mt-4">
          {/* <AsyncButton onClick={handleDepositClicked} className='bg-trans-0 border-white text-white'>Deposit</AsyncButton> */}
          <AsyncButton
            onClick={handleBorrow}
            loading={buttonLoading}
            disabledreason={buttonDisabledReason}
          >
            Borrow
          </AsyncButton>
        </div>
      </div>
    </>
  );
}

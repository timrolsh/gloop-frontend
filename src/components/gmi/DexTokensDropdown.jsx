import {useMemo, useState} from "react";
import Info from "../Info";
import {Collapse, Table} from "react-bootstrap";

import Skeleton from "../Skeleton";
import useGmiStore from "~/stores/client/gmi";
import useGetDepositTokenBalance from "~/stores/server/lend/useGetDepositTokenBalance";
import env from "~/env";
import {truncateAmount} from "~/utils/ui";
import PriceInput from "../PriceInput";
import useGetTokensList from "~/stores/server/core/useGetTokensList";
import useGetLowestFeeToken from "~/stores/server/gmi/useGetDexLowestFeeToken";
import {createBigNumber} from "~/utils/math";

export default function DexTokensDropdown({
  amount,
  setAmount,
  withdrawal,
  estimatedAmountIn,
  onSelectedTokenChange = () => {}
}) {
  const setSelectedToken = useGmiStore((state) => state.setSelectedToken);
  const selectedToken = useGmiStore((state) => state.selectedToken);

  const tokenListQuery = useGetTokensList({});
  const balanceQuery = useGetDepositTokenBalance({token: selectedToken});

  const lowestDepositFeeTokenQuery = useGetLowestFeeToken({});
  const lowestWithdrawFeeTokenQuery = useGetLowestFeeToken({withdrawal: true});

  const dexTokens = useMemo(() => {
    return (tokenListQuery.data || []).filter((x) =>
      withdrawal ? x.dexWithdrawable : x.dexDepositable
    );
  }, [tokenListQuery.data]);

  const dollarValue = useMemo(() => {
    const price = selectedToken.name === "USDC" ? 1 : selectedToken.dexPrice;

    if (price === env.EMPTY_VALUE) return 0;

    const bigPrice = createBigNumber(price);
    const value = withdrawal ? estimatedAmountIn : amount;

    if (!value || value === env.EMPTY_VALUE) return 0;

    return bigPrice.mul(value).toString();
  }, [selectedToken, amount, estimatedAmountIn]);

  const [openDropDown, setOpenDropDown] = useState(false);

  const gmiDropDownHandler = () => {
    if (openDropDown) {
      setOpenDropDown(false);
    }
  };

  const handleChangeSelectedToken = (token) => {
    setSelectedToken(token);
    onSelectedTokenChange(token);
  };

  // const inputMax = useMemo(() => {
  //   return Math.min(balanceQuery?.data)
  // }, [balanceQuery])

  window.addEventListener("click", (e) => {
    if (
      e.target !== document.getElementById("tokenName") &&
      e.target !== document.getElementById("tokenImage")
    ) {
      gmiDropDownHandler();
    }
  });

  return (
    <Skeleton loading={tokenListQuery.isLoading} height="80px">
      <div className="radius-8 bg-trans p-3 position-relative">
        <div className="d-flex v-center space-between">
          <div style={{minWidth: 0}}>
            {withdrawal ? (
              estimatedAmountIn ? (
                <Skeleton
                  loading={estimatedAmountIn === env.EMPTY_VALUE}
                  width="200px"
                  height="40px"
                >
                  <div className="font-20 bold-700 color-white" title={estimatedAmountIn}>
                    {estimatedAmountIn}
                  </div>
                </Skeleton>
              ) : null
            ) : (
              <>
                <PriceInput amount={amount} setAmount={setAmount} />
              </>
            )}
            <div className="mt-2">
              <div className="font-14 bold-300 color-gray mt-2" title={`$${dollarValue}`}>
                ${truncateAmount(dollarValue, 2)}
              </div>
            </div>
          </div>
          <div className="text-end">
            <div className="d-flex v-center1 flex-end cursur-pointer">
              <img
                id="tokenImage"
                src={selectedToken?.image}
                width={22}
                className="mr-10"
                onClick={() => setOpenDropDown(!openDropDown)}
              />
              <div
                className="font-20 bold-500 color-white"
                id="tokenName"
                onClick={() => setOpenDropDown(!openDropDown)}
              >
                {selectedToken?.name}
              </div>
            </div>
            <div className="mt-2">
              <Skeleton
                loading={
                  balanceQuery.isLoading ||
                  !balanceQuery.data ||
                  balanceQuery.data === env.EMPTY_VALUE
                }
              >
                <div
                  className="font-14 bold-300 color-gray"
                  title={`$${balanceQuery.data} ${selectedToken.name}`}
                >
                  Balance: {`${truncateAmount(balanceQuery.data)} ${selectedToken.name}`}
                </div>
              </Skeleton>
            </div>
          </div>
        </div>
        <div>
          <Collapse in={openDropDown} className="gmi_dropdown">
            <div>
              <div className="p-3 bg-gray radius-8 gmi_dropdown_div">
                <Table borderless className="gmi_dropdown_table">
                  <thead>
                    <tr>
                      <th className="color-gray font-16 bold-300 text-start py-3">Asset</th>
                      <th className="color-gray font-16 bold-300 text-start py-3">Deposit Fee</th>
                      <th className="color-gray font-16 bold-300 text-start py-3">Withdraw Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!tokenListQuery.isLoading &&
                      dexTokens.length &&
                      dexTokens?.map((token) => (
                        <tr
                          key={token.name}
                          className="cursur-pointer"
                          onClick={() => handleChangeSelectedToken(token)}
                        >
                          <td className="border-left-radius-8 py-3">
                            <img src={token.image} width={22} className="mr-10" />
                            <span className="color-white font-16 bold-700 ">{token.name}</span>
                          </td>

                          {token.name === "USDC" ? (
                            <>
                              <td>
                                <Skeleton
                                  loading={
                                    lowestDepositFeeTokenQuery.isLoading ||
                                    lowestWithdrawFeeTokenQuery.data?.dexDepositFee ===
                                      env.EMPTY_VALUE
                                  }
                                  width="80px"
                                >
                                  <span
                                    className="color-white font-16 bold-600"
                                    title={`${lowestDepositFeeTokenQuery.data?.dexDepositFee}%`}
                                  >
                                    {truncateAmount(
                                      lowestDepositFeeTokenQuery.data?.dexDepositFee,
                                      2
                                    )}
                                    %
                                  </span>
                                </Skeleton>
                              </td>

                              <td>
                                <Skeleton
                                  loading={
                                    lowestWithdrawFeeTokenQuery.isLoading ||
                                    lowestWithdrawFeeTokenQuery.data?.dexWithdrawFee ===
                                      env.EMPTY_VALUE
                                  }
                                  width="80px"
                                >
                                  <span
                                    className="color-white font-16 bold-600"
                                    title={`${lowestWithdrawFeeTokenQuery.data?.dexWithdrawFee}%`}
                                  >
                                    {truncateAmount(
                                      lowestWithdrawFeeTokenQuery.data?.dexWithdrawFee,
                                      2
                                    )}
                                    %
                                  </span>
                                </Skeleton>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>
                                <Skeleton
                                  loading={token.dexDepositFee === env.EMPTY_VALUE}
                                  width="80px"
                                >
                                  <span
                                    className="color-white font-16 bold-600"
                                    title={`${token.dexDepositFee}%`}
                                  >
                                    {truncateAmount(token.dexDepositFee, 2)}%
                                  </span>
                                </Skeleton>
                              </td>

                              <td>
                                <Skeleton
                                  loading={token.dexWithdrawFee === env.EMPTY_VALUE}
                                  width="80px"
                                >
                                  <span
                                    className="color-white font-16 bold-600"
                                    title={`${token.dexWithdrawFee}%`}
                                  >
                                    {truncateAmount(token.dexWithdrawFee, 2)}%
                                  </span>
                                </Skeleton>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Collapse>
        </div>
      </div>
    </Skeleton>
  );
}

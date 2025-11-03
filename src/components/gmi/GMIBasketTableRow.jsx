import env from "~/env";
import {truncateAmount, getTokenShortName, getTokenBracketedPart} from "~/utils/ui";
import Skeleton from "../Skeleton";
import {useMemo} from "react";
import {createBigNumber} from "~/utils/math";
import {formatUnits, parseUnits} from "viem";

export default function GMIBasketTableRow({token, card}) {
  const current = useMemo(() => {
    if (
      !token.dexPrice ||
      token.dexPrice === env.EMPTY_VALUE ||
      !token.dexBankBalance ||
      token.dexBankBalance === env.EMPTY_VALUE ||
      !token.dexTotalControlledValue ||
      token.dexTotalControlledValue === env.EMPTY_VALUE
    )
      return env.EMPTY_VALUE;

    const bigPrice = createBigNumber(parseUnits(token.dexPrice, token.decimals).toString());
    const bigDexBankBalance = createBigNumber(
      parseUnits(token.dexBankBalance, token.decimals).toString()
    );
    const bigDexTotalControlledValue = createBigNumber(
      parseUnits(token.dexTotalControlledValue, token.decimals).toString()
    );

    const result = bigPrice
      .mul(bigDexBankBalance)
      .mul(100)
      .div(bigDexTotalControlledValue)
      .toString();
    return formatUnits(parseFloat(result), token.decimals);
  }, [token]);

  return (
    <>
      {!card ? (
        <tr className={`py-3 market-list-table-row`}>
          <td className="d-flex gap-3 align-items-center">
            <img src={token.image} width={37} className="mr-8 to_gmi_dropdown_btn" alt={token.name} />
            <div className="d-flex flex-column">
              <span className="color-white font-16 bold-600">{getTokenShortName(token.name)}</span>
              {getTokenBracketedPart(token.name) && (
                <span className="color-gray font-14">{getTokenBracketedPart(token.name)}</span>
              )}
            </div>
          </td>

          <td>
            <Skeleton loading={!token.dexPrice || token.dexPrice === env.EMPTY_VALUE}>
              <span className="color-white font-16 bold-600" title={`$${token.dexPrice}`}>
                ${truncateAmount(token.dexPrice, 2)}
              </span>
            </Skeleton>
          </td>

          <td>
            <Skeleton loading={token.dexBankBalance === env.EMPTY_VALUE} width="80px">
              <span className="color-white font-16 bold-600" title={`${token.dexBankBalance}`}>
                {truncateAmount(token.dexBankBalance)}
              </span>
            </Skeleton>
          </td>

          <td>
            <Skeleton loading={current === env.EMPTY_VALUE}>
              <span className="color-white font-16 bold-600" title={truncateAmount(current, 2)}>
                {truncateAmount(current, 2)}%
              </span>
            </Skeleton>
          </td>

          <td>
            <Skeleton loading={token.ratio === env.EMPTY_VALUE} width="80px">
              <span className="color-white font-16 bold-600">{token.ratio}%</span>
            </Skeleton>
          </td>

          <td>
            <Skeleton loading={token.dexDepositFee === env.EMPTY_VALUE} width="80px">
              <span className="color-white font-16 bold-600" title={`${token.dexDepositFee}%`}>
                {truncateAmount(token.dexDepositFee, 2)}%
              </span>
            </Skeleton>
          </td>

          <td>
            <Skeleton loading={token.dexWithdrawFee === env.EMPTY_VALUE} width="80px">
              <span className="color-white font-16 bold-600" title={`${token.dexWithdrawFee}%`}>
                {truncateAmount(token.dexWithdrawFee, 2)}%
              </span>
            </Skeleton>
          </td>
        </tr>
      ) : (
        <>
          <div className="d-flex flex-column" style={{gap: "8px"}}>
            <div className="d-flex space-between">
              <div className="color-gray font-14 bold-300  py-2">Asset</div>
              <div className="py-2 d-flex align-items-center" style={{gap: "8px"}}>
                <img src={token.image} width={22} alt={token.name} />
                <div className="d-flex flex-column">
                  <span className="color-white font-14 bold-700">{getTokenShortName(token.name)}</span>
                  {getTokenBracketedPart(token.name) && (
                    <span className="color-gray font-12">{getTokenBracketedPart(token.name)}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex space-between">
              <div className="color-gray font-14 bold-300  py-2">Price</div>

              <Skeleton
                loading={!token.dexPrice || token.dexPrice === env.EMPTY_VALUE}
                width="80px"
              >
                <span className="color-white font-14 bold-400" title={`$${token.dexPrice}`}>
                  ${truncateAmount(token.dexPrice, 2)}
                </span>
              </Skeleton>
            </div>

            <div className="d-flex space-between">
              <div className="color-gray font-14 bold-300  py-2">Available</div>

              <Skeleton loading={token.dexBankBalance === env.EMPTY_VALUE} width="80px">
                <span className="color-white font-16 bold-600" title={`${token.dexBankBalance}`}>
                  {truncateAmount(token.dexBankBalance)}
                </span>
              </Skeleton>
            </div>

            <div className="d-flex space-between">
              <div className="color-gray font-14 bold-300  py-2">Current</div>

              <Skeleton loading={token.dexBankBalance === env.EMPTY_VALUE} width="80px">
                <span
                  className="color-white font-14 bold-400"
                  title={`${token.dexBankBalance} ${token.name}`}
                >
                  {truncateAmount(token.dexBankBalance)} {token.name}
                </span>
              </Skeleton>
            </div>

            <div className="d-flex space-between">
              <div className="color-gray font-14 bold-300  py-2">Target</div>
              <Skeleton loading={token.ratio === env.EMPTY_VALUE} width="80px">
                <span className="color-white font-14 bold-400">{token.ratio}%</span>
              </Skeleton>
            </div>

            <div className="d-flex space-between">
              <div className="color-gray font-14 bold-300  py-2">Deposit Fee</div>
              <Skeleton loading={token.dexDepositFee === env.EMPTY_VALUE} width="80px">
                <span className="color-white font-14 bold-400" title={`${token.dexDepositFee}%`}>
                  {token.dexDepositFee}%
                </span>
              </Skeleton>
            </div>

            <div className="d-flex space-between">
              <div className="color-gray font-14 bold-300  py-2">Withdraw Fee</div>
              <Skeleton loading={token.dexWithdrawFee === env.EMPTY_VALUE} width="80px">
                <span className="color-white font-14 bold-400" title={`${token.dexWithdrawFee}%`}>
                  {token.dexWithdrawFee}%
                </span>
              </Skeleton>
            </div>
          </div>
          <div>
            <hr className="hr-1 border-dark-green" />
          </div>
        </>
      )}
    </>
  );
}

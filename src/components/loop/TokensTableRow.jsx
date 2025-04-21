import {useMemo} from "react";
import env from "~/env";
import {truncateAmount} from "~/utils/ui";
import Skeleton from "../Skeleton";
import {createBigNumber} from "~/utils/math";
import {DATAMODES} from "~/consts/enums";
import useGetTotalUnderlying from "~/stores/server/lend/useGetTotalUnderlying";

export default function CollateralTokensTableRow({token, displayHr, onRowClick, mode, isLoading}) {
  const handleRowClicked = () => {
    if (clickable) onRowClick(token);
  };

  const totalUnderlyingQuery = useGetTotalUnderlying({token});

  const clickable = useMemo(() => {
    return typeof onRowClick === "function";
  }, [onRowClick]);

  const supply = useMemo(() => {
    const result = {
      displayValue: env.EMPTY_VALUE,
      value: env.EMPTY_VALUE,
      convertedValue: env.EMPTY_VALUE
    };

    const value = mode === DATAMODES.BORROW ? totalUnderlyingQuery.data : token.userPoolBalance;

    if (value === env.EMPTY_VALUE || totalUnderlyingQuery.isLoading) return result;

    result.value = value;
    result.displayValue = `${truncateAmount(value)} ${token.name}`;
    if (token.price !== env.EMPTY_VALUE)
      result.convertedValue = createBigNumber(value).mul(token.price).toFixed(token.decimals);

    return result;
  }, [token.price, token.userPoolBalance, totalUnderlyingQuery]);

  const borrow = useMemo(() => {
    const result = {
      displayValue: env.EMPTY_VALUE,
      value: env.EMPTY_VALUE,
      convertedValue: env.EMPTY_VALUE
    };

    if (!token.borrowable) {
      result.displayValue = "N/A";
      return result;
    }

    const value = mode === DATAMODES.BORROW ? token.totalBorrows : token.userBorrows;

    if (value === env.EMPTY_VALUE) return result;

    result.value = value;
    result.displayValue = `${truncateAmount(value)} ${token.name}`;

    if (token.price !== env.EMPTY_VALUE)
      result.convertedValue = createBigNumber(value).mul(token.price).toFixed(token.decimals);

    return result;
  }, [token.price, token.totalBorrows, token.userBorrows]);

  return (
    <>
      <tr
        className={`py-3 market-list-table-row ${clickable ? "hoverable" : ""}`}
        onClick={handleRowClicked}
      >
        <td className="d-flex gap-3 align-items-center">
          <img src={token.image} width={37} className="mr-8 to_gmi_dropdown_btn" />
          <span className="color-white font-16 bold-600">{token.name}</span>
        </td>

        <td>
          <Skeleton loading={!token.price || token.price === env.EMPTY_VALUE}>
            <span className="color-white font-16 bold-600" title={`$${token.price}`}>
              ${truncateAmount(token.price)}
            </span>
          </Skeleton>
        </td>
        <td>
          <Skeleton loading={supply.displayValue == env.EMPTY_VALUE}>
            <div className="d-flex flex-column" style={{gap: "4px"}}>
              <span className="color-white font-16 bold-600" title={supply.displayValue}>
                {supply.displayValue}
              </span>
              {supply.convertedValue !== env.EMPTY_VALUE ? (
                <span className="color-gray font-14" title={`$${supply.convertedValue}`}>
                  ${truncateAmount(supply.convertedValue, 2)}
                </span>
              ) : null}
            </div>
          </Skeleton>
        </td>

        <td>
          <Skeleton loading={borrow.displayValue == env.EMPTY_VALUE}>
            <div className="d-flex flex-column" style={{gap: "4px"}}>
              <span className="color-white font-16 bold-600" title={borrow.displayValue}>
                {borrow.displayValue}
              </span>
              {borrow.convertedValue !== env.EMPTY_VALUE ? (
                <span className="color-gray font-14" title={`$${borrow.convertedValue}`}>
                  ${truncateAmount(borrow.convertedValue, 2)}
                </span>
              ) : null}
            </div>
          </Skeleton>
        </td>

        <td>
          <Skeleton loading={isLoading || token.supplyApy === env.EMPTY_VALUE}>
            <span className="apy-rate apy-rate font-16 bold-600">
              {token.supplyApy === env.EMPTY_VALUE
                ? "N/A"
                : `${truncateAmount(token.supplyApy, 2)}% APY`}
            </span>
          </Skeleton>
        </td>

        <td>
          <Skeleton
            loading={isLoading || (token?.borrowable && token.borrowApy === env.EMPTY_VALUE)}
          >
            <span className="apy-rate apy-rate font-16 bold-600">
              {token.borrowApy === env.EMPTY_VALUE
                ? "N/A"
                : `${truncateAmount(token.borrowApy, 2)}% APY`}
            </span>
          </Skeleton>
        </td>
      </tr>

      {displayHr ? (
        <tr>
          <td className="p-0" colSpan={6}>
            <hr className="hr-1 border-dark-green m-0" />
          </td>
        </tr>
      ) : null}
    </>
  );
}

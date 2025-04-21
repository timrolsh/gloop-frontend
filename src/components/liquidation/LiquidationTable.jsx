import {Table} from "react-bootstrap";
import useGetDebtPositions from "~/stores/server/liquidation/useGetDebtPositions";
import LiquidationTableRow from "./LiquidationTableRow";
import Skeleton from "~/components/Skeleton";
import usePositionLiquidate from "~/stores/server/liquidation/usePositionLiquidate";
import {useState} from "react";

export default function LiquidationTable() {
  const {data: positions, isLoading, isPlaceholderData, isError} = useGetDebtPositions();

  return (
    <div className="radius-8 bg-trans p-4 ">
      <div className="desktop-show">
        <Table borderless className="gmi_basket_table">
          <thead>
            <tr>
              <th className="color-gray font-14 bold-300">#</th>
              <th className="color-gray font-14 bold-300">Owner</th>
              <th className="color-gray font-14 bold-300">GM Market(s)</th>
              <th className="color-gray font-14 bold-300">Total Collateral Value</th>
              <th className="color-gray font-14 bold-300">USDC Debt</th>
              <th className="color-gray font-14 bold-300">Health Factor</th>
              <th className="color-gray font-14 bold-300">Liquidation Bonus</th>
              <th className="color-gray font-14 bold-300">Liquidate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8}>
                <hr className="hr-3 border-dark-green m-0" />
              </td>
            </tr>
            {!isLoading && !positions.length ? (
              <tr>
                <td className="color-white text-center" colSpan={8}>
                  <span>
                    {isError ? "Failed To Fetch Liquidation Data" : "No Liquidation Data Available"}
                  </span>
                </td>
              </tr>
            ) : (
              positions.length &&
              positions.map((position, index) =>
                isLoading || isPlaceholderData ? (
                  <tr key={index}>
                    <td colSpan={8}>
                      <Skeleton loading={true}>
                        <div></div>
                      </Skeleton>
                    </td>
                  </tr>
                ) : (
                  <LiquidationTableRow key={index} index={index} position={position} />
                )
              )
            )}
          </tbody>
        </Table>
      </div>
      <div className="mobile-show">
        {!isLoading && !positions.length ? (
          <span className="color-white text-center w-100 d-block">
            {isError ? "Failed To Fetch Liquidation Data" : "No Liquidation Data Available"}
          </span>
        ) : (
          positions.length &&
          positions.map((position, index) => (
            <Skeleton key={index} loading={isLoading || isPlaceholderData}>
              <LiquidationTableRow key={index} index={index} position={position} card={true} />
            </Skeleton>
          ))
        )}
      </div>
    </div>
  );
}

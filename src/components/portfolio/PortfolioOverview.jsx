import CollateralMarketsTable from "../loop/CollateralTokensTable";
import BorrowTokensTable from "../loop/BorrowTokensTable";
import usePortfolioStore from "~/stores/client/portfolio";
import {DATAMODES} from "~/consts/enums";

export default function PortfolioOverview() {
  const setSelectedPosition = usePortfolioStore((state) => state.setSelectedPosition);

  return (
    <div className="d-flex flex-column" style={{gap: "16px"}}>
      <div
        className="border-3-bottom border-dark-green color-white font-18 bold-600"
        style={{paddingBottom: "18px"}}
      >
        Collateral Deposits
      </div>

      <CollateralMarketsTable onRowClick={setSelectedPosition} mode={DATAMODES.PORTFOLIO} />

      <div
        className="border-3-bottom border-dark-green color-white font-18 bold-600"
        style={{paddingBottom: "18px"}}
      >
        USDC Borrows
      </div>

      <BorrowTokensTable onRowClick={setSelectedPosition} mode={DATAMODES.PORTFOLIO} />
    </div>
  );
}

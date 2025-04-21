import CollateralMarketsTable from "./CollateralTokensTable";
import BorrowTokensTable from "./BorrowTokensTable";
import useBorrowStore from "~/stores/client/borrow";
import {DATAMODES} from "~/consts/enums";
import usePortfolioStore from "~/stores/client/portfolio";

export default function MarketOverview() {
  const setSelectedMarket = useBorrowStore((state) => state.setSelectedMarket);
  const setActiveTab = useBorrowStore((state) => state.setActiveTab);
  const setSelectedPosition = usePortfolioStore((state) => state.setSelectedPosition);

  const handleCollateralRowClicked = (position) => {
    setActiveTab("portfolio");
    setSelectedPosition(position);
  };

  return (
    <div className="d-flex flex-column" style={{gap: "16px"}}>
      <div
        className="border-3-bottom border-dark-green color-white font-18 bold-600"
        style={{paddingBottom: "18px"}}
      >
        Collateral Markets
      </div>

      <CollateralMarketsTable onRowClick={handleCollateralRowClicked} mode={DATAMODES.BORROW} />

      <div
        className="border-3-bottom border-dark-green color-white font-18 bold-600"
        style={{paddingBottom: "18px"}}
      >
        Borrow Markets
      </div>

      <BorrowTokensTable onRowClick={setSelectedMarket} mode={DATAMODES.BORROW} />
    </div>
  );
}

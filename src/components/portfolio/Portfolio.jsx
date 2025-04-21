import PortfolioPositionSingle from "./PortfolioPositionSingle";
import PortfolioOverview from "./PortfolioOverview";
import usePortfolioStore from "~/stores/client/portfolio";

import market_info from "~/assets/img/market-info.svg";

export default function Portfolio() {
  const selectedPosition = usePortfolioStore((state) => state.selectedPosition);

  return (
    <>
      <div className="my-4 position-information-card loop-info bg-trans">
        <div className="title">
          <img src={market_info} width={14} className="me-2" />
          Health Factor
        </div>
        <div className="mt-2">
          If your health factor goes below 100%, a portion or all of your collateral could be seized
          by other users in a liquidation. To avoid this, supply more collateral or repay some or
          all of your borrow position.
        </div>
      </div>
      <div className="px-sm-4 pt-4 pb-4 bg-trans radius-8">
        {selectedPosition ? <PortfolioPositionSingle /> : <PortfolioOverview />}
      </div>
    </>
  );
}

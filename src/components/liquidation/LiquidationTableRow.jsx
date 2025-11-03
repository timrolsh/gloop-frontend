import {useMemo, useState} from "react";

import {partializeWalletAddress, truncateAmount} from "~/utils/ui";
import {createBigNumber} from "~/utils/math";

import AsyncButton from "~/components/AsyncButton";
import {LiquidationTotalCollateral} from "./LiquidationTotalCollateral";
import Skeleton from "../Skeleton";

//icons
import RoundUSDCIcon from "~/assets/img/tokens/roundUSDC.svg";
import useUserStore from "~/stores/client/user";
import useGetLiquidationBonus from "~/stores/server/liquidation/useGetLiquidationBonus";
import useGetUserCollateralValue from "~/stores/server/borrow/useGetTotalCollateral";
import LiquidateUserModal from "./LiquidateUserModal";

export default function LiquidationTableRow({position, index, card = false}) {
  // const isUserLiquidableQuery = useGetIsUserLiquidable({ borrowedAsset: position.borrowedAssetAddress, borrowerAddress: position.walletAddress })
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const liquidationBonusQuery = useGetLiquidationBonus({});
  const userTotalCollateralValueQuery = useGetUserCollateralValue({
    walletAddress: position.walletAddress
  });

  const [liquidateModalVisible, setLiquidateModalVisible] = useState(false);

  const HFColorClass = useMemo(() => {
    if (!position.healthFactor && position.healthFactor !== 0) return "color-gray";
    
    const bigRatio = createBigNumber(position.healthFactor.toString());

    if (bigRatio.lt(100)) return "color-red";
    else if (bigRatio.gte(100) && bigRatio.lte(125)) return "color-orange";

    return "color-green";
  }, [position]);

  const liquidateButtonDisabledReason = useMemo(() => {
    if (!isAuthenticated()) return "Please Connect Wallet First!";

    if (!position.healthFactor && position.healthFactor !== 0) 
      return "Health Factor Not Available";

    if (createBigNumber(position.healthFactor.toString()).gte(100))
      return "User Is Not Liquidatable";
  }, [position, isAuthenticated]);

  const handleLiquidate = () => {
    setLiquidateModalVisible(true);
  };

  return (
    <>
      {card ? (
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between">
            <div className="color-gray font-14 bold-300 py-2">#</div>
            <div className="color-white font-14 bold-600 py-2">{index + 1}</div>
          </div>

          <div className="d-flex justify-content-between">
            <div className="color-gray font-14 bold-300 py-2">Owner</div>
            <div className="color-white font-14 bold-600 py-2">
              {partializeWalletAddress(position.walletAddress)}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <div className="color-gray font-14 bold-300 py-2">GM Market(s)</div>
            <div className="color-white font-14 bold-600 py-2 d-flex justify-content-end align-items-center">
              <LiquidationTotalCollateral totalCollateralValue={position.totalCollateralValue} />
            </div>
          </div>

          <Skeleton loading={userTotalCollateralValueQuery.isLoading}>
            <div className="d-flex justify-content-between">
              <div className="color-gray font-14 bold-300 py-2">Total Collateral Value</div>
              <div
                className="color-white font-14 bold-600 py-2"
                title={`$${userTotalCollateralValueQuery.data}`}
              >
                ${truncateAmount(userTotalCollateralValueQuery.data, 2)}
              </div>
            </div>
          </Skeleton>

          <div className="d-flex justify-content-between">
            <div className="color-gray font-14 bold-300 py-2">USDC Debt</div>
            <div className="color-white font-14 bold-600 py-2" title={position.usdcDebt}>
              <div className="d-flex justify-content-end align-items-center" style={{gap: "12px"}}>
                <img src={RoundUSDCIcon} alt="" />
                <span className="color-white font-16 bold-700">
                  {truncateAmount(position.usdcDebt, 2)}
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <div className="color-gray font-14 bold-300 py-2">Health Factor</div>
            <div className={`${HFColorClass} font-14 bold-600 py-2`}>
              {position.healthFactor || position.healthFactor === 0 
                ? `${truncateAmount(position.healthFactor, 0)}%` 
                : "N/A"}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <div className="color-gray font-14 bold-300 py-2">Liquidation Bonus</div>
            <div
              className={`color-white font-14 bold-600 py-2`}
              title={`${liquidationBonusQuery.data}%`}
            >
              {truncateAmount(liquidationBonusQuery.data, 2)}%
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <div className="color-gray font-14 bold-300 py-2">Liquidate</div>
            <div className="color-white font-16 bold-600">
              <AsyncButton
                disabledreason={liquidateButtonDisabledReason}
                className={`${liquidateButtonDisabledReason ? "bg-white" : ""} p-6-12`}
                onClick={handleLiquidate}
              >
                Liquidate
              </AsyncButton>
            </div>
          </div>
          <div>
            <hr className="hr-1 border-dark-green" />
          </div>
        </div>
      ) : (
        <tr className="py-3">
          <td className="color-white font-16 bold-700">{index + 1}</td>
          <td className="color-white font-16 bold-700">
            {partializeWalletAddress(position.walletAddress)}
          </td>
          <td>
            <LiquidationTotalCollateral totalCollateralValue={position.totalCollateralValue} />
          </td>
          <Skeleton loading={userTotalCollateralValueQuery.isLoading}>
            <td
              className="color-white font-16 bold-700"
              title={`$${userTotalCollateralValueQuery.data}`}
            >
              ${truncateAmount(userTotalCollateralValueQuery.data, 2)}
            </td>
          </Skeleton>
          <td className="" title={`$${position.usdcDebt}`}>
            <div className="d-flex align-items-center" style={{gap: "12px"}}>
              <img src={RoundUSDCIcon} alt="" />
              <span className="color-white font-16 bold-700">
                {truncateAmount(position.usdcDebt, 2)}
              </span>
            </div>
          </td>
          {/* <Skeleton loading={healthFactorQuery.isLoading || ratio === env.EMPTY_VALUE}> */}
          <td className={`${HFColorClass} font-16 bold-700`}>
            {position.healthFactor || position.healthFactor === 0 
              ? `${truncateAmount(position.healthFactor, 0)}%` 
              : "N/A"}
          </td>
          {/* </Skeleton> */}
          <Skeleton loading={liquidationBonusQuery.isLoading}>
            <td className={`color-white font-16 bold-700`} title={`${liquidationBonusQuery.data}%`}>
              {truncateAmount(liquidationBonusQuery.data, 2)}%
            </td>
          </Skeleton>
          <td className="color-white font-16 bold-700">
            <AsyncButton
              disabledreason={liquidateButtonDisabledReason}
              className={`${liquidateButtonDisabledReason ? "bg-white" : ""} p-6-12`}
              onClick={handleLiquidate}
            >
              Liquidate
            </AsyncButton>
          </td>
        </tr>
      )}
      {liquidateModalVisible && (
        <LiquidateUserModal position={position} onClose={() => setLiquidateModalVisible(false)} />
      )}
    </>
  );
}

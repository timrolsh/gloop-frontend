import {useState} from "react";
import StakeGmi from "./StakeGmi";
import UnstakeGmi from "./UnstakeGmi";

export default function DashboardRightPart() {
  const [activeTab, setActiveTab] = useState("Stake GMI");

  return (
    <div className="radius-8 bg-trans px-4 pt-4 4 min-h-357">
      <div className="d-flex v-center space-between">
        <div className="w-100">
          <div
            className={`font-18 bold-600  text-center cursur-pointer ${
              activeTab == "Stake GMI" ? "color-white" : "color-white-50"
            }`}
            onClick={() => setActiveTab("Stake GMI")}
          >
            Stake GMI
          </div>
          <hr
            className={`hr-3 border-dark-green ${activeTab == "Stake GMI" ? "active_gmi_tab" : ""}`}
          />
        </div>
        <div className="w-100">
          <div
            className={`font-18 bold-600  text-center cursur-pointer ${
              activeTab == "Unstake GMI" ? "color-white" : "color-white-50"
            }`}
            onClick={() => setActiveTab("Unstake GMI")}
          >
            Unstake GMI
          </div>
          <hr
            className={`hr-3 border-dark-green ${
              activeTab == "Unstake GMI" ? "active_gmi_tab" : ""
            }`}
          />
        </div>
      </div>
      {activeTab == "Stake GMI" ? <StakeGmi /> : <UnstakeGmi />}
    </div>
  );
}

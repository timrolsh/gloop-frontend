import React, {useState} from "react";
import {Row, Col} from "react-bootstrap";
import AsyncButton from "~/components/AsyncButton";
import AuthenticatedSection from "../AuthenticatedSection";
import gloop_img1_url from "../../assets/img/gloop_img1.svg";

export default function StakingLeftPart() {
  const [selectedLockPeriod, setSelectedLockPeriod] = useState(14);
  const [stakeAmount, setStakeAmount] = useState("");

  const lockPeriods = [
    {
      days: 14,
      boost: 25,
      seconds: 14 * 24 * 60 * 60
    },
    {
      days: 28,
      boost: 50,
      seconds: 28 * 24 * 60 * 60
    },
    {
      days: 56,
      boost: 100,
      seconds: 56 * 24 * 60 * 60
    }
  ];

  const getBoostForPeriod = (days) => {
    const period = lockPeriods.find((p) => p.days === days);
    return period ? period.boost : 0;
  };

  return (
    <>
      <Row className="">
        <Col sm={12}>
          <div className="space-between align-items-center my-2 desktop-flex">
            <div className="mobile-show">
              <div className="mt-4 my-2 d-flex flex-column" style={{gap: "8px"}}>
                <AsyncButton
                  className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10 min-w-200"
                  onClick={() => {
                    // Handle staking logic
                    console.log(`Staking ${stakeAmount} GLOOP for ${selectedLockPeriod} days`);
                  }}
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                >
                  Stake GLOOP
                </AsyncButton>
              </div>
            </div>
            <div className="font-32 bold-700 color-white d-flex align-items-center my-4">
              Stake Tokens
            </div>

            <div className="desktop-show">
              <div className="my-2 d-flex" style={{gap: "8px"}}>
                <AsyncButton
                  className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10 min-w-200"
                  onClick={() => {
                    // Handle staking logic
                    console.log(`Staking ${stakeAmount} GLOOP for ${selectedLockPeriod} days`);
                  }}
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                >
                  Stake GLOOP
                </AsyncButton>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="overflow-hidden">
        <AuthenticatedSection height="500px">
          <Col sm={12} className="">
            <div className="mobile-show">
              <div
                className="radius-8 bg-trans px-4 pt-4 pb-4 d-flex flex-column"
                style={{gap: "24px"}}
              >
                {/* Amount Input */}
                <div className="d-flex flex-column" style={{gap: "8px"}}>
                  <label className="font-16 bold-500 color-white">Amount to Stake</label>
                  <div className="d-flex v-center border-1 border-gray radius-8 p-3">
                    <input
                      type="number"
                      className="buy_gloop_inputs flex-grow-1"
                      placeholder="0.0"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                    />
                    <div className="d-flex v-center" style={{gap: "8px"}}>
                      <img
                        src={gloop_img1_url}
                        width={24}
                        height={24}
                        className="radius-8"
                      />
                      <span className="font-16 bold-500 color-white">GLOOP</span>
                    </div>
                  </div>
                  <div className="d-flex space-between">
                    <span className="font-12 color-gray">Balance: 0 GLOOP</span>
                    <button
                      className="btn max-btn font-12 color-green"
                      onClick={() => setStakeAmount("0")} // Replace with actual balance
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Lock Period Selection */}
                <div className="d-flex flex-column" style={{gap: "16px"}}>
                  <label className="font-16 bold-500 color-white">Lock Period</label>
                  <div className="d-flex flex-column" style={{gap: "12px"}}>
                    {lockPeriods.map((period) => (
                      <div
                        key={period.days}
                        className={`border-1 radius-8 p-3 cursur-pointer staking-period-card ${
                          selectedLockPeriod === period.days
                            ? "border-green bg-trans2 selected"
                            : "border-gray"
                        }`}
                        onClick={() => setSelectedLockPeriod(period.days)}
                      >
                        <div className="d-flex space-between v-center">
                          <div>
                            <div className="font-16 bold-500 color-white">{period.days} Days</div>
                            <div className="font-14 color-gray">Lock for {period.days} days</div>
                          </div>
                          <div className="text-end">
                            <div className="font-16 bold-600 color-green">
                              +{period.boost}% Boost
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="border-1 border-gray radius-8 p-3 staking-summary-card">
                  <div className="font-16 bold-500 color-white mb-2">Staking Summary</div>
                  <div className="d-flex space-between mb-1">
                    <span className="font-14 color-gray">Amount:</span>
                    <span className="font-14 color-white">{stakeAmount || "0"} GLOOP</span>
                  </div>
                  <div className="d-flex space-between mb-1">
                    <span className="font-14 color-gray">Lock Period:</span>
                    <span className="font-14 color-white">{selectedLockPeriod} days</span>
                  </div>
                  <div className="d-flex space-between">
                    <span className="font-14 color-gray">Boost:</span>
                    <span className="font-14 color-green">
                      +{getBoostForPeriod(selectedLockPeriod)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="desktop-show bg-trans1 radius-8 p-4 my-2">
              <div className="d-flex flex-column" style={{gap: "24px"}}>
                {/* Amount Input */}
                <div className="d-flex flex-column" style={{gap: "8px"}}>
                  <label className="font-16 bold-500 color-white">Amount to Stake</label>
                  <div className="d-flex v-center border-1 border-gray radius-8 p-3">
                    <input
                      type="number"
                      className="buy_gloop_inputs flex-grow-1"
                      placeholder="0.0"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                    />
                    <div className="d-flex v-center" style={{gap: "8px"}}>
                      <img
                        src={gloop_img1_url}
                        width={24}
                        height={24}
                        className="radius-8"
                      />
                      <span className="font-16 bold-500 color-white">GLOOP</span>
                    </div>
                  </div>
                  <div className="d-flex space-between">
                    <span className="font-12 color-gray">Balance: 0 GLOOP</span>
                    <button
                      className="btn max-btn font-12 color-green"
                      onClick={() => setStakeAmount("0")} // Replace with actual balance
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Lock Period Selection */}
                <div className="d-flex flex-column" style={{gap: "16px"}}>
                  <label className="font-16 bold-500 color-white">Lock Period</label>
                  <div className="d-flex" style={{gap: "12px"}}>
                    {lockPeriods.map((period) => (
                      <div
                        key={period.days}
                        className={`border-1 radius-8 p-3 cursur-pointer flex-grow-1 staking-period-card ${
                          selectedLockPeriod === period.days
                            ? "border-green bg-trans2 selected"
                            : "border-gray"
                        }`}
                        onClick={() => setSelectedLockPeriod(period.days)}
                      >
                        <div className="text-center">
                          <div className="font-16 bold-500 color-white">{period.days} Days</div>
                          <div className="font-14 color-gray mb-2">Lock for {period.days} days</div>
                          <div className="font-16 bold-600 color-green">+{period.boost}% Boost</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="border-1 border-gray radius-8 p-3 staking-summary-card">
                  <div className="font-16 bold-500 color-white mb-3">Staking Summary</div>
                  <div className="d-flex space-between mb-2">
                    <span className="font-14 color-gray">Amount:</span>
                    <span className="font-14 color-white">{stakeAmount || "0"} GLOOP</span>
                  </div>
                  <div className="d-flex space-between mb-2">
                    <span className="font-14 color-gray">Lock Period:</span>
                    <span className="font-14 color-white">{selectedLockPeriod} days</span>
                  </div>
                  <div className="d-flex space-between">
                    <span className="font-14 color-gray">Boost:</span>
                    <span className="font-14 color-green">
                      +{getBoostForPeriod(selectedLockPeriod)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </AuthenticatedSection>
      </Row>
    </>
  );
}

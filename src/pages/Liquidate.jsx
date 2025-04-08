import {Row, Col, Container} from "react-bootstrap";
import SidebarSocial from "../components/SidebarSoical";

import leaderboard_img1_url from "../assets/img/leaderboard_img1.svg";
import LiquidationTable from "~/components/liquidation/LiquidationTable";
import Skeleton from "~/components/Skeleton";
import useGetLiquidationBonus from "~/stores/server/liquidation/useGetLiquidationBonus";
import {truncateAmount} from "~/utils/ui";

export default function Liquidate() {
  const liquidationBonusQuery = useGetLiquidationBonus({});

  return (
    <div>
      <SidebarSocial />
      <section>
        <Container className="mt-5 mb-3">
          <Row className="radius-8 bg-trans m-0 py-3 px-3 min-h-150">
            <Col sm={12} className="w-100">
              <div className="desktop-flex v-center">
                <div className="my-3 mr-20">
                  <img src={leaderboard_img1_url} width={62} />
                </div>
                <div className="color-white font-16 my-2">
                  Positions that don’t meet the minimum collateral requirements can be liquidated
                  for a profit by anyone!
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container className="mt-3 mb-2 d-flex flex-column gap-2">
          <div className="space-between align-items-center my-2 desktop-flex ">
            <div className="font-32 bold-700 color-white d-flex align-items-center my-2">
              Debt Positions
            </div>
          </div>

          <div className="d-flex space-between align-items-center">
            <span className="bg-trans1 radius-8 p-3 my-2 p-2 align-self-start">
              <span className="font-14 bold-300 color-gray">
                Call liquidate function if you see any addresses under 100%
              </span>
            </span>
            <Skeleton loading={liquidationBonusQuery.isLoading} width="160px">
              <span className="bg-trans1 radius-8 p-3 my-2 p-2 align-self-start">
                <span className="font-14 bold-300 color-gray">
                  Current Liquidation Bonus: {truncateAmount(liquidationBonusQuery.data, 2)}%
                </span>
              </span>
            </Skeleton>
          </div>
        </Container>
      </section>
      <section>
        <Container>
          <Row className="mt-3">
            <Col sm={12}>
              <div>
                <LiquidationTable />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <div className="ptb-50"></div>
      </section>
    </div>
  );
}

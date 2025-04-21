import {Table} from "react-bootstrap";
import GMIBasketTableRow from "./GMIBasketTableRow";
import useGetTokensList from "~/stores/server/core/useGetTokensList";
import {useMemo} from "react";

export default function GmiBasket() {
  const {isLoading, data: tokens} = useGetTokensList({});

  const basketTokens = useMemo(() => {
    return (tokens || []).filter((x) => x.basket);
  }, [tokens]);

  return (
    <div className="radius-8 bg-trans p-4 ">
      <div className="font-18 bold-700 color-white">GMI Basket</div>
      <div>
        <hr className="hr-3 border-dark-green" />
      </div>
      <div className="desktop-show">
        <Table borderless className="gmi_basket_table">
          <thead>
            <tr>
              <th className="color-gray font-16 bold-300  py-3">Asset</th>
              <th className="color-gray font-16 bold-300  py-3">Price</th>
              <th className="color-gray font-16 bold-300  py-3">Available</th>
              <th className="color-gray font-16 bold-300  py-3">Current</th>
              <th className="color-gray font-16 bold-300  py-3">Target</th>
              <th className="color-gray font-16 bold-300  py-3">Deposit Fee</th>
              <th className="color-gray font-16 bold-300  py-3">Withdraw Fee</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              basketTokens.length &&
              basketTokens.map((token, index) => <GMIBasketTableRow key={index} token={token} />)}
          </tbody>
        </Table>
      </div>
      <div className="mobile-show">
        <div className="d-flex flex-column" style={{gap: "12px"}}>
          {!isLoading &&
            basketTokens.length &&
            basketTokens.map((token, index) => (
              <GMIBasketTableRow key={index} token={token} card={true} />
            ))}
        </div>
      </div>
    </div>
  );
}

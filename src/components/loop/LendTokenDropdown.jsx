import {useMemo, useState} from "react";
import {Collapse} from "react-bootstrap";

import dropdown_img from "~/assets/img/dropdown.svg";
import Skeleton from "../Skeleton";
import env from "~/env";
import useLendStore from "~/stores/client/lend";
import useGetTokensList from "~/stores/server/core/useGetTokensList";
import {truncateAmount} from "~/utils/ui";

export default function MarketDropdown() {
  const selectedToken = useLendStore((state) => state.selectedToken);
  const setSelectedToken = useLendStore((state) => state.setSelectedToken);

  const tokenListQuery = useGetTokensList({});

  const [openDropDown, setOpenDropDown] = useState(false);

  const lendableTokens = useMemo(() => {
    return (tokenListQuery.data || []).filter((x) => x.lendable);
  }, [tokenListQuery.data]);

  const gmiDropDownHandler = () => {
    if (openDropDown) {
      setOpenDropDown(false);
    }
  };

  window.addEventListener("click", (e) => {
    if (
      e.target !== document.querySelector(".dropdown-btn") &&
      !document.querySelector(".dropdown-btn")?.contains(e.target)
    ) {
      gmiDropDownHandler();
    }
  });

  return (
    <Skeleton loading={tokenListQuery.isLoading || tokenListQuery.isFetching}>
      <div
        className={`radius-8 bg-trans p-3 position-relative market-dropdown-hero ${
          openDropDown && "active"
        }`}
      >
        <div onClick={() => setOpenDropDown(!openDropDown)} className="dropdown-btn">
          <div className="d-flex space-between align-items-center">
            <div className="d-flex align-items-center" style={{gap: "10px"}}>
              <img src={selectedToken?.image} width={37} className="mr-8 to_gmi_dropdown_btn" />
              <div className="dropdown-item-title bold-700 color-white to_gmi_dropdown_btn1">
                {selectedToken?.name}
              </div>
              <div className="info-price">{selectedToken?.amount}</div>
            </div>
            <div className="d-flex" style={{gap: "14px"}}>
              <Skeleton
                loading={!selectedToken || selectedToken.supplyApy === env.EMPTY_VALUE}
                width="100px"
              >
                <div className="apy-rate">
                  {truncateAmount(selectedToken.supplyApy, 2)}% Max APY
                </div>
              </Skeleton>
              <img
                src={dropdown_img}
                width={13}
                className={`dropdown-icon ${openDropDown && "rotate-180"}`}
              />
            </div>
          </div>
        </div>
        <div>
          <Collapse in={openDropDown} className="market-dropdown">
            <div className="w-100">
              <div
                className="p-3 bg-gloop-dark radius-8 gmi_dropdown_div d-flex flex-column"
                style={{gap: "4px"}}
              >
                {lendableTokens?.map((token) => (
                  <div
                    key={token.address}
                    className="d-flex space-between market-dropdown-item"
                    onClick={() => setSelectedToken(token)}
                  >
                    <div className="d-flex align-items-center" style={{gap: "10px"}}>
                      <img src={token.image} width={28} className="mr-8 to_gmi_dropdown_btn" />
                      <div className="dropdown-item-title bold-700 color-white to_gmi_dropdown_btn1">
                        {token.name}
                      </div>
                      <div className="info-price">{token.amount}</div>
                    </div>
                    <Skeleton
                      loading={!selectedToken || selectedToken.supplyApy === env.EMPTY_VALUE}
                      width="100px"
                    >
                      <div className="apy-rate">
                        {truncateAmount(selectedToken.supplyApy, 2)}% Max APY
                      </div>
                    </Skeleton>
                  </div>
                ))}
              </div>
            </div>
          </Collapse>
        </div>
      </div>
    </Skeleton>
  );
}

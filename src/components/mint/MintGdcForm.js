import {useState} from "react";
import {Collapse, Table} from "react-bootstrap";

import gmi_img3_url from "../../assets/img/gmi_img3.svg";
import gmi_img4_url from "../../assets/img/gmi_img4.svg";
import gmi_img5_url from "../../assets/img/gmi_img5.svg";
import gmi_img6_url from "../../assets/img/gmi_img6.svg";
import gmi_img7_url from "../../assets/img/gmi_img7.svg";
import mint_img2_url from "../../assets/img/mint_img2.svg";

export default function MintGdcForm() {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("IOU");
  const [selectedCoinImg, setSelectedCoinImg] = useState(mint_img2_url);
  const [amount, setAmount] = useState("");
  const amountHandler = (e) => {
    if (!e.target.value) {
      return setAmount("");
    }
    if (e.target.value.match("^[0-9]+(.[0-9]*)?$")) {
      setAmount(e.target.value);
    }
  };

  const gmiDropDownHandler = () => {
    if (openDropDown) {
      setOpenDropDown(false);
    }
  };
  window.addEventListener("click", (e) => {
    if (
      e.target !== document.querySelector(".gmi_dropdown_btn") &&
      e.target !== document.querySelector(".gmi_dropdown_btn1")
    ) {
      gmiDropDownHandler();
    }
  });
  return (
    <div className="radius-8 bg-trans p-3 position-relative">
      <div className="d-flex v-center space-between">
        <div>
          <div className="font-20 bold-700 color-white">
            <input
              type="text"
              placeholder="0.00"
              className="buy_gmi_inputs"
              value={amount}
              onChange={(e) => amountHandler(e)}
            />
          </div>
          <div className="font-14 bold-300 color-gray mt-2">$0.00</div>
        </div>
        <div className="text-end">
          <div className="d-flex v-center1 flex-end cursur-pointer">
            <img
              src={selectedCoinImg}
              width={22}
              className="mr-10 gmi_dropdown_btn"
              onClick={() => setOpenDropDown(!openDropDown)}
            />
            <div
              className="font-20 bold-500 color-white gmi_dropdown_btn1"
              onClick={() => setOpenDropDown(!openDropDown)}
            >
              {selectedCoin}
            </div>
          </div>
          <div className="font-14 bold-300 color-gray mt-2">Balance: [Amount]</div>
        </div>
      </div>
      <div>
        <Collapse in={openDropDown} className="gmi_dropdown">
          <div>
            <div className="p-3 bg-gray radius-8 gmi_dropdown_div">
              <Table borderless className="gmi_dropdown_table">
                <thead>
                  <tr>
                    <th className="color-gray font-16 bold-300 text-start py-3">Asset</th>
                    <th className="color-gray font-16 bold-300 text-center py-3">Deposit Fee</th>
                    <th className="color-gray font-16 bold-300 text-end py-3">Withdrawal Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className="cursur-pointer"
                    onClick={() => {
                      setSelectedCoin("GM ETH");
                      setSelectedCoinImg(gmi_img4_url);
                    }}
                  >
                    <td className="border-left-radius-8 py-3">
                      <img src={gmi_img4_url} width={22} className="mr-10" />
                      <span className="color-white font-16 bold-700 ">ETH GM</span>
                    </td>
                    <td className="color-white font-16 bold-400 text-center py-3">0.00%</td>
                    <td className="border-right-radius-8 color-white font-16 bold-400 text-end py-3">
                      0.00%
                    </td>
                  </tr>
                  <tr
                    className="cursur-pointer"
                    onClick={() => {
                      setSelectedCoin("GM BTC");
                      setSelectedCoinImg(gmi_img5_url);
                    }}
                  >
                    <td className="border-left-radius-8 py-3">
                      <img src={gmi_img5_url} width={22} className="mr-10" />
                      <span className="color-white font-16 bold-700 ">BTC GM</span>
                    </td>
                    <td className="color-white font-16 bold-400 text-center p-3">0.00%</td>
                    <td className="border-right-radius-8 color-white font-16 bold-400 text-end py-3">
                      0.00%
                    </td>
                  </tr>
                  <tr
                    className="cursur-pointer"
                    onClick={() => {
                      setSelectedCoin("GM ARB");
                      setSelectedCoinImg(gmi_img6_url);
                    }}
                  >
                    <td className="border-left-radius-8 py-3">
                      <img src={gmi_img6_url} width={22} className="mr-10" />
                      <span className="color-white font-16 bold-700 ">ARB GM</span>
                    </td>
                    <td className="color-white font-16 bold-400 text-center p-3">0.00%</td>
                    <td className="border-right-radius-8 color-white font-16 bold-400 text-end py-3">
                      0.00%
                    </td>
                  </tr>
                  <tr
                    className="cursur-pointer"
                    onClick={() => {
                      setSelectedCoin("GM SOL");
                      setSelectedCoinImg(gmi_img7_url);
                    }}
                  >
                    <td className="border-left-radius-8 py-3">
                      <img src={gmi_img7_url} width={22} className="mr-10" />
                      <span className="color-white font-16 bold-700 ">SOL GM</span>
                    </td>
                    <td className="color-white font-16 bold-400 text-center p-3">0.00%</td>
                    <td className="border-right-radius-8 color-white font-16 bold-400 text-end py-3">
                      0.00%
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
}

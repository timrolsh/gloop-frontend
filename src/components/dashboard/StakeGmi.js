import {useState} from "react";
import {Button} from "react-bootstrap";
import stake_gmi_img_url from "../../assets/img/stake_gmi_img.svg";

export default function StakeGmi() {
  const [amount, setAmount] = useState("");

  const amountHandler = (e) => {
    if (!e.target.value) {
      return setAmount("");
    }
    if (e.target.value.match("^[0-9]+(.[0-9]*)?$")) {
      setAmount(e.target.value);
    }
  };
  return (
    <div>
      <div className="font-14 bold-400 color-gray my-3">Stake</div>
      <div className="radius-8 bg-trans px-3 py-2 mt-2 desktop-flex space-between v-center">
        <div className="w-25-100 d-flex v-center my-1">
          <img src={stake_gmi_img_url} width={29} className="mr-10" />
          <span className="font-18 bold-700 color-white mr-10">0</span>
          <span className="font-18 bold-400 color-gray mr-10"></span>
          <Button className="max-btn font-12 bold-300 color-gray radius-8 border-gray border-1 p-2 mobile-show">
            MAX
          </Button>
        </div>
        <div className="w-75-100 desktop-flex v-center flex-end my-2">
          <div className="mr-10">
            <input
              type="text"
              placeholder="Staked: [Amount]"
              className="buy_gloop_inputs"
              value={amount}
              onChange={(e) => amountHandler(e)}
            />
          </div>
          <Button className="max-btn font-12 bold-300 color-gray radius-8 border-gray border-1 p-2 desktop-show">
            MAX
          </Button>
        </div>
      </div>
      <div className="d-flex v-center space-between mt-2">
        <div>
          <div className="font-16 bold-300 color-gray my-3">
            <span className="mr-10">Total GMI</span>
          </div>
          <div className="font-16 bold-300 color-gray my-3">
            <span className="mr-10">Total Points</span>
          </div>
        </div>
        <div>
          <div className="font-16 bold-700 color-white my-3">0</div>
          <div className="font-16 bold-700 color-white my-3">0</div>
        </div>
      </div>
      <div>
        <Button className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 mb-2 w-100 mt-m2">
          Stake GMI
        </Button>
      </div>
    </div>
  );
}

import {useState} from "react";
import {Button} from "react-bootstrap";
import Info from "../Info";
import MintGdcForm from "./MintGdcForm";

export default function MintGdc() {
  return (
    <div>
      <div className="border-dash radius-8 p-3 mt-2">
        <div>
          <Info content="Lorem ipsum dolor sit amet consectetur lorem" />
          <span className="ml-10 font-14 bold-600 color-white">Mint GDC</span>
        </div>
        <div className="font-14 bold-300 color-white mt-2">
          Deposit your staked IOU’s to mint GDC stablecoin. The remaining IOU’s will stay staked in
          the Stability Pool to benefit from liquidations and Gloop token rewards.
        </div>
      </div>
      <div className="font-16 bold-300 color-gray mt-4 mb-2">You send</div>
      <div>
        <MintGdcForm />
      </div>
      <div className="d-flex v-center space-between mt-3">
        <div>
          <div className="font-16 bold-300 color-gray my-3">
            <span className="mr-10">GDC Received</span>
            <Info content="Lorem ipsum dolor sit amet consectetur lorem111" />
          </div>
          <div className="font-16 bold-300 color-gray my-3">
            <span className="mr-10">GLOOP Burned</span>
            <Info content="Lorem ipsum dolor sit amet consectetur lorem222" />
          </div>
          <div className="font-16 bold-300 color-gray my-3">
            <span className="mr-10">Total Value</span>
            <Info content="Lorem ipsum dolor sit amet consectetur lorem3333" />
          </div>
        </div>
        <div className="text-end">
          <div className="font-16 bold-700 color-white my-3">0</div>
          <div className="font-16 bold-700 color-white my-3">
            0 <span className="bold-400">($0)</span>
          </div>
          <div className="font-16 bold-700 color-white my-3">$0</div>
        </div>
      </div>
      <div className="mt-2">
        <Button className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10-25 my-2 w-100">
          Mint GDC
        </Button>
      </div>
    </div>
  );
}

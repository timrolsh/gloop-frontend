import {useState} from "react";
import {Button} from "react-bootstrap";
export default function DiscordBox() {
  return (
    <div className="radius-8 border-green border-1 p-3 desktop-flex align-items-center space-between bg-dark1">
      <div className="color-white d-flex align-items-center font-18 bold-500">
        <div className="mr-10 px-3 py-2 bg-gray1 radius-8 color-green number_box">4</div>
        <div>Join the community on Discord</div>
      </div>
      <div className="my-2">
        <Button className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10 min-w-200">
          Connect Discord
        </Button>
      </div>
    </div>
  );
}

import {useMemo, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import close_img_url from "../../assets/img/close.svg";
import OTPInput from "~/components/OTPInput";
import useAddReferrer from "~/stores/server/core/useAddReferrer";
import AsyncButton from "../AsyncButton";
import useUserStore from "~/stores/client/user";
import {useAccount} from "wagmi";

export default function InviteBox() {
  const {mutate: redeem} = useAddReferrer();
  const {isConnected} = useAccount();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const [show, setShow] = useState(false);
  const [redeemButtonLoading, setRedeemButtonLoading] = useState(false);
  const [referralWalletAddress, setReferralWalletAddress] = useState("");

  const openModal = () => {
    setShow(true);
  };
  const closeModal = () => {
    setShow(false);
  };

  const handleReedem = () => {
    setRedeemButtonLoading(true);

    redeem(referralWalletAddress, {
      onSettled: () => {
        setRedeemButtonLoading(false);
      },
      onSuccess: () => {
        closeModal();
        setReferralWalletAddress("");
      }
    });
  };

  const openModalButtonDisabledReason = useMemo(() => {
    if (!isAuthenticated() || !isConnected) return "Please Connect Wallet First!";
  }, [isConnected, isAuthenticated]);

  const redeemButtonDisabledReason = useMemo(() => {
    if (!referralWalletAddress || referralWalletAddress.length < 32)
      return "Please Fill Referral Wallet Address";
  }, [referralWalletAddress]);

  return (
    <div className="radius-8 border-green border-1 p-3 desktop-flex align-items-center space-between bg-dark1">
      <div className="color-white d-flex align-items-center font-18 bold-500">
        <div className="mr-10 px-3 py-2 bg-gray1 radius-8 color-green number_box">2</div>
        <div>Add Referral Wallet Address</div>
      </div>
      <div className="my-2">
        <AsyncButton
          className="gloop-btn-primary font-16 bold-700 radius-8 bg-green border-green color-dark p-10 min-w-200"
          onClick={openModal}
          disabledreason={openModalButtonDisabledReason}
        >
          Add
        </AsyncButton>
      </div>
      <Modal show={show} onHide={closeModal} centered className="buy_gloop_modal">
        <Modal.Body className="px-3 radius-8 bg-trans1 border-dark w-100" style={{height: "200px"}}>
          <div>
            <img
              src={close_img_url}
              width={10}
              className="invite_modal_close"
              onClick={closeModal}
            />
          </div>

          <div className="d-flex flex-column space-between h-100">
            <div className="font-18 bold-500 color-white text-center">
              Enter Referral Wallet Address
            </div>

            <div
              style={{padding: "8px 18px"}}
              className="radius-8 bg-trans mt-2 desktop-flex space-between v-center"
            >
              <input
                type="text"
                className={`buy_gmi_input flex-grow-1 font-18 bold-700 color-white mr-10`}
                value={referralWalletAddress}
                onChange={(e) => setReferralWalletAddress(e.target.value)}
                placeholder="Enter Wallet Address"
              />
            </div>

            {/* <OTPInput numberOfDigits={5} onOtpChange={setReferralWalletAddress} /> */}
            <div className="mt-2 text-center">
              <AsyncButton
                onClick={handleReedem}
                loading={redeemButtonLoading}
                disabledreason={redeemButtonDisabledReason}
              >
                Add
              </AsyncButton>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

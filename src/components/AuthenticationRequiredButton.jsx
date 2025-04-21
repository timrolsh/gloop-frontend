import {events} from "~/consts/events";
import useUserStore from "~/stores/client/user";
import eventEmitter from "~/utils/emitter";
import {toastInfo} from "~/utils/toast";

export default function AuthenticationRequiredButton({
  onClick = () => {},
  className = "",
  children
}) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      toastInfo("Please connect wallet to use this feature");
      // eventEmitter.emit(events.Unauthorized)
    } else onClick();
  };

  return (
    <div className={className} onClick={handleOnClick}>
      {children}
    </div>
  );
}

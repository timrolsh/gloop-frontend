import {useMemo} from "react";
import {Button, OverlayTrigger} from "react-bootstrap";

export default function AsyncButton({
  onClick,
  children,
  disabledreason = "",
  loading = false,
  className = ""
}) {
  const handleOnClick = (e) => {
    e.preventDefault();

    if (isButtonDisabled) return;

    onClick(e);
  };

  const isButtonDisabled = useMemo(() => {
    return disabledreason || loading;
  }, [disabledreason, loading]);

  return (
    <OverlayTrigger
      trigger={disabledreason ? ["click", "focus", "hover"] : []}
      placement="bottom"
      overlay={
        <div className={`tooltip-body`} style={{color: "#fff"}}>
          {disabledreason}
        </div>
      }
    >
      <Button
        role="button"
        style={{pointerEvents: "all"}}
        disabled={isButtonDisabled}
        onClick={handleOnClick}
        className={`${className} async-button loop-btn-second font-16 bold-700 radius-8 text-black p-10-25 w-100`}
      >
        {loading ? (
          <div className="async-button-spinner spinner-border" role="status"></div>
        ) : (
          <>{children}</>
        )}
      </Button>
    </OverlayTrigger>
  );
}

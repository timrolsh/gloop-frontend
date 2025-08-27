import env from "~/env";
import {toastSuccess} from "./toast";

export const scalePoints = (points) => {
  if (!points || points === env.EMPTY_VALUE) return points;
  
  const numericPoints = parseFloat(points);
  if (isNaN(numericPoints)) return points;
  
  return Math.floor(numericPoints / 1000);
};

export const formatStakingBoost = (stakingBoost) => {
  if (!stakingBoost || stakingBoost === env.EMPTY_VALUE) return "0";
  
  const numericBoost = parseFloat(stakingBoost);
  if (isNaN(numericBoost) || numericBoost < 0) return "0";
  
  return numericBoost.toString();
};

export const truncateAmount = (amount, decimalCount = 4, formatWithCommas = true) => {
  if (amount === env.EMPTY_VALUE) return env.EMPTY_VALUE;

  if (parseFloat(amount) === 0) return amount;

  if (amount === "0.0") return "0";

  if (!amount) return "-";

  const [number, decimals] = amount.toString().split(".");

  const formattedNumber = formatWithCommas ? number.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : number;

  if (!decimals || decimals.length <= decimalCount) {
    return decimals ? `${formattedNumber}.${decimals}` : formattedNumber;
  }

  return `${formattedNumber}.${decimals.substring(0, decimalCount)}`;
};

export const partializeWalletAddress = (walletAddress) => {
  if (!walletAddress) return "";

  return `${walletAddress.toString().substring(0, 6)}...${walletAddress
    .toString()
    .substring(walletAddress.toString().length - 4)}`;
};

export const copyToClipboard = (text, onCopy = (text) => {}) => {
  var textField = document.createElement("textarea");
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand("copy");
  textField.remove();
  toastSuccess("Copied to clipboard");
  onCopy(text);
};

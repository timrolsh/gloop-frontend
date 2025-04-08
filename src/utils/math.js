import BigNumber from "bignumber.js";
import {ImplementationException} from "~/consts/exceptions";

// Configure the decimal places globally
BigNumber.config({DECIMAL_PLACES: 18, EXPONENTIAL_AT: 40});

export const createBigNumber = (value) => {
  if (!value) return new BigNumber(0);

  const stringValue = value.toString();

  try {
    return new BigNumber(stringValue);
  } catch (error) {
    new ImplementationException(`Invalid input for BigNumber`, {value, valueType: typeof value});
    return new BigNumber(0);
  }
};

export function bigSumBy(arr, func, returnAsString = true) {
  const sum = arr.reduce(
    (acc, item) => acc.plus(new BigNumber(func(item).toString())),
    new BigNumber(0)
  );
  return returnAsString ? sum.toString() : sum.toNumber();
}

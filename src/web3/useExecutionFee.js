import {ethers} from "ethers";
import {useEstimateFeesPerGas, useReadContract} from "wagmi";
import {GMX_DATA_STORE} from "~/consts/gmx";
import DataStore from "~/consts/abis/gmx/DataStore.json";

export function hashData(dataTypes, dataValues) {
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  const bytes = abiCoder.encode(dataTypes, dataValues);
  const hash = ethers.keccak256(ethers.getBytes(bytes));

  return hash;
}

export function hashString(string) {
  return hashData(["string"], [string]);
}

export const DEPOSIT_GAS_LIMIT_KEY = hashString("DEPOSIT_GAS_LIMIT");

export default function useExecutionFee(singleToken = true) {
  const gasLimitKey = hashData(["bytes32", "bool"], [DEPOSIT_GAS_LIMIT_KEY, singleToken]);
  const ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1 = hashString("ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1");
  const {data: gasFeeData} = useEstimateFeesPerGas();
  const {data} = useReadContract({
    abi: DataStore.abi,
    address: GMX_DATA_STORE,
    functionName: "getUint",
    args: [ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1],
    chainId: 42161
  });
  const {data: gasFee} = useReadContract({
    abi: DataStore.abi,
    address: GMX_DATA_STORE,
    functionName: "getUint",
    args: [gasLimitKey]
  });

  return ((data || 0n) + (gasFee || 0n)) * (gasFeeData?.maxFeePerGas || 0n);
}

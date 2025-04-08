import {readContract, waitForTransactionReceipt, writeContract} from "@wagmi/core";
import env from "~/env";

import GMIAbi from "~/consts/abis/GMI.json";
import erc20Abi from "~/consts/abis/MockERC20.json";
import {Web3Exception} from "~/consts/exceptions";
import {config} from "~/providers/WalletContextProvider";

import {reopenToastLoading, toastDismiss, toastLoading} from "~/utils/toast";
import {GMX_SYNTHETICS_ROUTER_ADDRESS, GMX_EXCHANGE_ROUTER_ADDRESS} from "~/consts/gmx";
import ExchangeRouter from "~/consts/abis/gmx/ExchangeRouter.json";

const getDexTokenPrice = async (token, roundUp = true) => {
  try {
    return await readContract(config, {
      abi: GMIAbi.abi,
      address: env.GMI_TOKEN_ADDRESS,
      functionName: "getPrice",
      args: [token.encodedName, roundUp]
    });
  } catch (error) {
    throw new Web3Exception(`Getting ${token.name} Price Failed`, {token, roundUp, error});
  }
};

const getDexTotalControlledValue = async (roundUp = false) => {
  try {
    return await readContract(config, {
      abi: GMIAbi.abi,
      address: env.GMI_TOKEN_ADDRESS,
      functionName: "totalControlledValue",
      args: [roundUp]
    });
  } catch (error) {
    throw new Web3Exception(`Getting Total Controlled Value Failed`, {roundUp, error});
  }
};

const getDexTotalSupply = async () => {
  try {
    return await readContract(config, {
      abi: GMIAbi.abi,
      address: env.GMI_TOKEN_ADDRESS,
      functionName: "totalSupply",
      args: []
    });
  } catch (error) {
    throw new Web3Exception(`Getting Total Supply Value Failed`, {error});
  }
};

const getTargetBalance = async (token, withdrawal, tokenValue, roundUp = true) => {
  try {
    return await readContract(config, {
      abi: GMIAbi.abi,
      address: env.GMI_TOKEN_ADDRESS,
      functionName: "targetBalance",
      args: [token.encodedName, withdrawal, tokenValue, roundUp]
    });
  } catch (error) {
    throw new Web3Exception(`Getting Target Balance for ${token.name} Failed`, {
      token,
      withdrawal,
      roundUp,
      error
    });
  }
};

const getTargetAmount = async (token) => {
  try {
    return await readContract(config, {
      abi: GMIAbi.abi,
      address: env.GMI_TOKEN_ADDRESS,
      functionName: "getTargetAmount",
      args: [token.encodedName]
    });
  } catch (error) {
    throw new Web3Exception(`Getting Target Amount for ${token.name} Failed`, {token, error});
  }
};

const getDexBankBalance = async (token) => {
  try {
    return await readContract(config, {
      abi: GMIAbi.abi,
      address: env.GMI_TOKEN_ADDRESS,
      functionName: "bankBalance",
      args: [token.encodedName]
    });
  } catch (error) {
    throw new Web3Exception(`Getting Bank Balance  for ${token.name} Failed`, {token, error});
  }
};

const getTransferFee = async (token, amount, withdrawal) => {
  try {
    return await readContract(config, {
      abi: GMIAbi.abi,
      address: env.GMI_TOKEN_ADDRESS,
      functionName: "calculateFee",
      args: [token.encodedName, amount, withdrawal]
    });
  } catch (error) {
    throw new Web3Exception(`Getting Transfer Fee for ${token.name} Failed`, {
      token,
      amount,
      withdrawal,
      error
    });
  }
};

const getGMIBalance = async (userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: GMIAbi.abi,
      address: env.GMI_TOKEN_ADDRESS,
      functionName: "balanceOf",
      args: [userWalletAddress]
    });
  } catch (error) {
    throw new Web3Exception(`Getting GMI Balance for ${userWalletAddress} Failed`, {
      userWalletAddress,
      error
    });
  }
};

const getDexSlippage = () => {
  return 6; // 6%
};

const dexApprove = async (token, amount) => {
  let toastId = toastLoading("Please Approve");

  try {
    const approvalHash = await writeContract(config, {
      abi: GMIAbi.abi,
      address: token.address,
      functionName: "approve",
      args: [env.GMI_TOKEN_ADDRESS, amount]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Approve Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: approvalHash});
    toastDismiss(toastId);

    return {hash: approvalHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Approve Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {amount, token, error},
      {sendToast: true}
    );
  }
};

const GMXApprove = async (amount) => {
  let toastId = toastLoading("Please Approve");

  try {
    const approvalHash = await writeContract(config, {
      abi: erc20Abi.abi,
      address: env.USDC_TOKEN_ADDRESS,
      functionName: "approve",
      args: [GMX_SYNTHETICS_ROUTER_ADDRESS, amount]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Approve Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: approvalHash});
    toastDismiss(toastId);

    return {hash: approvalHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Approve Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {amount, error},
      {sendToast: true}
    );
  }
};

const checkDexAllowance = async (token, userWalletAddress) => {
  const toastId = toastLoading("Checking Allowance...");

  try {
    const res = await readContract(config, {
      abi: GMIAbi.abi,
      address: token.address,
      functionName: "allowance",
      args: [
        userWalletAddress,
        token.name === "USDC" ? GMX_SYNTHETICS_ROUTER_ADDRESS : env.GMI_TOKEN_ADDRESS
      ]
    });

    toastDismiss(toastId);
    return res;
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Checking Dex Allowance Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {token, error},
      {sendToast: true}
    );
  }
};

const dexDeposit = async (token, amount, recipientAddress) => {
  let toastId = toastLoading("Please Sign Deposit Transaction");

  try {
    const depositHash = await writeContract(config, {
      abi: GMIAbi.abi,
      address: env.GMI_TOKEN_ADDRESS,
      functionName: "deposit",
      args: [token.encodedName, recipientAddress, amount, "1"]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Deposit Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: depositHash});
    toastDismiss(toastId);

    return {hash: depositHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Deposit Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {token, amount, recipientAddress, error},
      {sendToast: true}
    );
  }
};

const GMXDeposit = async (token, amount, encodedPayload, value) => {
  let toastId = toastLoading("Please Sign Deposit Transaction");
  try {
    const depositHash = await writeContract(config, {
      abi: ExchangeRouter.abi,
      address: GMX_EXCHANGE_ROUTER_ADDRESS,
      functionName: "multicall",
      args: [encodedPayload],
      value
    });

    toastId = reopenToastLoading(toastId, "Waiting For Deposit Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: depositHash});
    toastDismiss(toastId);

    return {hash: depositHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `GMX Deposit Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {token, amount, encodedPayload, value, error},
      {sendToast: true}
    );
  }
};

const dexWithdraw = async (token, amount, recipientAddress) => {
  let toastId = toastLoading("Please Sign Withdraw Transaction");

  try {
    const withdrawHash = await writeContract(config, {
      abi: GMIAbi.abi,
      address: env.GMI_TOKEN_ADDRESS,
      functionName: "withdraw",
      args: [token.encodedName, amount, recipientAddress, "1"]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Withdraw Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: withdrawHash});
    toastDismiss(toastId);

    return {hash: withdrawHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Withdraw Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {token, amount, recipientAddress, error},
      {sendToast: true}
    );
  }
};

const buildQuery = (startTime) => `{
  _0x47c031236e19d024b42f8AE6780E44A573170703_lte_start_of_period: collectedMarketFeesInfos(
      orderBy:timestampGroup
      orderDirection:desc
      where: {
        marketAddress: "0x47c031236e19d024b42f8ae6780e44a573170703"
        period: "1h"
        timestampGroup_lte: ${startTime}
      },
      first: 1
  ) {
      cumulativeFeeUsdPerPoolValue
  }

  _0x47c031236e19d024b42f8AE6780E44A573170703_recent: collectedMarketFeesInfos(
      orderBy: timestampGroup
      orderDirection: desc
      where: {
        marketAddress: "0x47c031236e19d024b42f8ae6780e44a573170703"
        period: "1h"
      },
      first: 1
  ) {
      cumulativeFeeUsdPerPoolValue
  }

  _0x70d95587d40A2caf56bd97485aB3Eec10Bee6336_lte_start_of_period: collectedMarketFeesInfos(
    orderBy:timestampGroup
    orderDirection:desc
    where: {
      marketAddress: "0x70d95587d40a2caf56bd97485ab3eec10bee6336"
      period: "1h"
      timestampGroup_lte: ${startTime}
    },
    first: 1
  ) {
    cumulativeFeeUsdPerPoolValue
  }
  _0x70d95587d40A2caf56bd97485aB3Eec10Bee6336_recent: collectedMarketFeesInfos(
      orderBy: timestampGroup
      orderDirection: desc
      where: {
        marketAddress: "0x70d95587d40a2caf56bd97485ab3eec10bee6336"
        period: "1h"
      },
      first: 1
  ) {
      cumulativeFeeUsdPerPoolValue
  }

  _0x09400D9DB990D5ed3f35D7be61DfAEB900Af03C9_lte_start_of_period: collectedMarketFeesInfos(
    orderBy:timestampGroup
    orderDirection:desc
    where: {
      marketAddress: "0x09400d9db990d5ed3f35d7be61dfaeb900af03c9"
      period: "1h"
      timestampGroup_lte: ${startTime}
    },
    first: 1
  ) {
    cumulativeFeeUsdPerPoolValue
  }
  _0x09400D9DB990D5ed3f35D7be61DfAEB900Af03C9_recent: collectedMarketFeesInfos(
      orderBy: timestampGroup
      orderDirection: desc
      where: {
        marketAddress: "0x09400d9db990d5ed3f35d7be61dfaeb900af03c9"
        period: "1h"
      },
      first: 1
  ) {
      cumulativeFeeUsdPerPoolValue
  }

  _0xB686BcB112660343E6d15BDb65297e110C8311c4_lte_start_of_period: collectedMarketFeesInfos(
    orderBy:timestampGroup
    orderDirection:desc
    where: {
      marketAddress: "0xb686bcb112660343e6d15bdb65297e110c8311c4"
      period: "1h"
      timestampGroup_lte: ${startTime}
    },
    first: 1
  ) {
    cumulativeFeeUsdPerPoolValue
  }
  _0xB686BcB112660343E6d15BDb65297e110C8311c4_recent: collectedMarketFeesInfos(
      orderBy: timestampGroup
      orderDirection: desc
      where: {
        marketAddress: "0xb686bcb112660343e6d15bdb65297e110c8311c4"
        period: "1h"
      },
      first: 1
  ) {
      cumulativeFeeUsdPerPoolValue
  }
}
`;
const getGMIAPY = async (tokens) => {
  // if ratio has yet to be fetched from vaults
  if (tokens.some((x) => x.ratio === env.EMPTY_VALUE)) return env.EMPTY_VALUE;

  const startTime = Math.floor((new Date() - 7 * 3600 * 1000 * 24) / 1000);
  const URL = "https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/synthetics-arbitrum-stats/api";

  let response;
  try {
    response = await fetch(URL, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        query: buildQuery(startTime)
      })
    });
  } catch (err) {
    return env.EMPTY_VALUE;
  }

  const jsonData = await response.json();
  const data = jsonData?.data;
  const aprs = {};
  let total = 0;

  for (const token of tokens) {
    const x1 = data[`_${token.market}_lte_start_of_period`][0]["cumulativeFeeUsdPerPoolValue"];
    const x2 = data[`_${token.market}_recent`][0]["cumulativeFeeUsdPerPoolValue"];
    const income = x2 - x1;
    const year = Math.floor(365 / 7);
    const apr = (income * year) / 10 ** 26;
    aprs[token.market] = apr;
    total += (apr * token.ratio) / 100;
  }
  total *= 1.05; // add arb incentives
  return total / 100;
};

const getGMITotalSupply = async () => {
  try {
    return await readContract(config, {
      abi: erc20Abi.abi,
      address: env.GMI_TOKEN_ADDRESS,
      functionName: "totalSupply",
      args: []
    });
  } catch (error) {
    throw new Web3Exception(`Getting Total Supply Value of GMI Failed`, {error});
  }
};

const getTokenVaults = async (token) => {
  try {
    return await readContract(config, {
      abi: GMIAbi.abi,
      address: env.GMI_TOKEN_ADDRESS,
      functionName: "vaults",
      args: [token.encodedName]
    });
  } catch (error) {
    throw new Web3Exception(`Getting ${token.name} Vaults Failed`, {token, error});
  }
};

export {
  getDexTokenPrice,
  getDexTotalControlledValue,
  getDexTotalSupply,
  getTargetBalance,
  getTargetAmount,
  getTransferFee,
  getGMIBalance,
  getDexBankBalance,
  getDexSlippage,
  checkDexAllowance,
  dexApprove,
  dexDeposit,
  dexWithdraw,
  getGMIAPY,
  getGMITotalSupply,
  GMXApprove,
  GMXDeposit,
  getTokenVaults
};

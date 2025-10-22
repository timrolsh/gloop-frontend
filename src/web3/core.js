import {readContract, waitForTransactionReceipt, writeContract} from "@wagmi/core";
import {formatEther} from "viem";

import {config} from "~/providers/WalletContextProvider";
import {Web3Exception} from "~/consts/exceptions";
import env from "~/env";

// abis
import GMPriceOracle from "~/consts/abis/GMPriceOracle.json";
import lendingPoolAbi from "~/consts/abis/LendingPool.json";
import erc20Abi from "~/consts/abis/MockERC20.json";
import GMPointsAbi from "~/consts/abis/GMPoints.json";
import GMInterestRateModel from "~/consts/abis/GMInterestRateModel.json";

// images
import gmETHIcon from "~/assets/img/tokens/gmETH.svg";
import gmBTCIcon from "~/assets/img/tokens/gmBTC.svg";
import gmSOLIcon from "~/assets/img/tokens/gmSOL.svg";
import USDCIcon from "~/assets/img/gloop_usdc.svg";
import {reopenToastLoading, toastDismiss, toastLoading} from "~/utils/toast";
import {createBigNumber} from "~/utils/math";

const USDT = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";

const WSOL = "0x2bcC6D6CdBbDC0a4071e48bb3B969b06B3330c07";

const getTokensList = () => {
  return [
    {
      image: gmETHIcon,
      name: "GM: ETH/USD [WETH-USDC]",
      address: env.ETH_TOKEN_ADDRESS,
      price: env.EMPTY_VALUE,
      availableLiquidity: env.EMPTY_VALUE,
      utilizationRate: env.EMPTY_VALUE,
      totalReserves: env.EMPTY_VALUE,
      totalBorrows: env.EMPTY_VALUE,
      borrowApy: env.EMPTY_VALUE,
      supplyApy: env.EMPTY_VALUE,
      userPoolBalance: env.EMPTY_VALUE,
      userBorrows: env.EMPTY_VALUE,

      // Dex
      dexPrice: env.EMPTY_VALUE,
      dexTotalControlledValue: env.EMPTY_VALUE,
      dexTotalSupply: env.EMPTY_VALUE,
      dexBankBalance: env.EMPTY_VALUE,
      dexDepositFee: env.EMPTY_VALUE,
      dexWithdrawFee: env.EMPTY_VALUE,

      // Configs
      borrowable: false,
      lendable: false,
      collateral: true,
      collateralEnabled: false,
      dexWithdrawable: true,
      dexDepositable: true,
      basket: true,
      decimals: 18,
      market: "0x70d95587d40A2caf56bd97485aB3Eec10Bee6336",
      initialLongToken: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      initialShortToken: env.USDC_TOKEN_ADDRESS,
      ratio: env.EMPTY_VALUE,
      encodedName: "0x5745544800000000000000000000000000000000000000000000000000000000"
    },
    {
      image: gmBTCIcon,
      name: "GM: BTC/USD [WBTC-USDC]",
      address: env.BTC_TOKEN_ADDRESS,
      price: env.EMPTY_VALUE,
      availableLiquidity: env.EMPTY_VALUE,
      utilizationRate: env.EMPTY_VALUE,
      totalReserves: env.EMPTY_VALUE,
      totalBorrows: env.EMPTY_VALUE,
      borrowApy: env.EMPTY_VALUE,
      supplyApy: env.EMPTY_VALUE,
      userPoolBalance: env.EMPTY_VALUE,
      userBorrows: env.EMPTY_VALUE,

      // Dex
      dexPrice: env.EMPTY_VALUE,
      dexTotalControlledValue: env.EMPTY_VALUE,
      dexTotalSupply: env.EMPTY_VALUE,
      dexBankBalance: env.EMPTY_VALUE,
      dexDepositFee: env.EMPTY_VALUE,
      dexWithdrawFee: env.EMPTY_VALUE,

      // Configs
      borrowable: false,
      lendable: false,
      collateral: true,
      collateralEnabled: false,
      dexWithdrawable: true,
      dexDepositable: true,
      basket: true,
      decimals: 18,
      market: "0x47c031236e19d024b42f8AE6780E44A573170703",
      initialLongToken: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
      initialShortToken: env.USDC_TOKEN_ADDRESS,
      ratio: env.EMPTY_VALUE,
      encodedName: "0x5742544300000000000000000000000000000000000000000000000000000000"
    },
    {
      image: gmSOLIcon,
      name: "GM: SOL/USD [WSOL-USDC]",
      address: env.SOL_TOKEN_ADDRESS,
      price: env.EMPTY_VALUE,
      availableLiquidity: env.EMPTY_VALUE,
      utilizationRate: env.EMPTY_VALUE,
      totalReserves: env.EMPTY_VALUE,
      totalBorrows: env.EMPTY_VALUE,
      supplyApy: env.EMPTY_VALUE,
      borrowApy: env.EMPTY_VALUE,
      userPoolBalance: env.EMPTY_VALUE,
      userBorrows: env.EMPTY_VALUE,

      // Dex
      dexPrice: env.EMPTY_VALUE,
      dexTotalControlledValue: env.EMPTY_VALUE,
      dexTotalSupply: env.EMPTY_VALUE,
      dexBankBalance: env.EMPTY_VALUE,
      dexDepositFee: env.EMPTY_VALUE,
      dexWithdrawFee: env.EMPTY_VALUE,

      // Configs
      borrowable: false,
      lendable: false,
      collateral: true,
      collateralEnabled: false,
      dexWithdrawable: true,
      dexDepositable: true,
      basket: true,
      decimals: 18,
      market: "0x09400D9DB990D5ed3f35D7be61DfAEB900Af03C9",
      initialLongToken: WSOL,
      initialShortToken: env.USDC_TOKEN_ADDRESS,
      ratio: env.EMPTY_VALUE,
      encodedName: "0x534f4c0000000000000000000000000000000000000000000000000000000000"
    },
    {
      image: USDCIcon,
      name: "USDC",
      address: env.USDC_TOKEN_ADDRESS,
      price: env.EMPTY_VALUE,
      availableLiquidity: env.EMPTY_VALUE,
      utilizationRate: env.EMPTY_VALUE,
      totalReserves: env.EMPTY_VALUE,
      totalBorrows: env.EMPTY_VALUE,
      supplyApy: env.EMPTY_VALUE,
      borrowApy: env.EMPTY_VALUE,
      userPoolBalance: env.EMPTY_VALUE,
      userBorrows: env.EMPTY_VALUE,

      // Dex
      dexPrice: env.EMPTY_VALUE,
      dexTotalControlledValue: env.EMPTY_VALUE,
      dexTotalSupply: env.EMPTY_VALUE,
      dexBankBalance: env.EMPTY_VALUE,
      dexDepositFee: env.EMPTY_VALUE,
      dexWithdrawFee: env.EMPTY_VALUE,

      // Configs
      borrowable: true,
      lendable: true,
      collateral: false,
      collateralEnabled: false,
      dexWithdrawable: false,
      dexDepositable: true,
      basket: false,
      decimals: 6,
      encodedName: ""
    },
    {
      image: USDCIcon,
      name: "GM: SWAP-ONLY [USDC-USDT]",
      address: env.USDC_USDT_TOKEN_ADDRESS,
      price: env.EMPTY_VALUE,
      availableLiquidity: env.EMPTY_VALUE,
      utilizationRate: env.EMPTY_VALUE,
      totalReserves: env.EMPTY_VALUE,
      totalBorrows: env.EMPTY_VALUE,
      supplyApy: env.EMPTY_VALUE,
      borrowApy: env.EMPTY_VALUE,
      userPoolBalance: env.EMPTY_VALUE,
      userBorrows: env.EMPTY_VALUE,

      // Dex
      dexPrice: env.EMPTY_VALUE,
      dexTotalControlledValue: env.EMPTY_VALUE,
      dexTotalSupply: env.EMPTY_VALUE,
      dexBankBalance: env.EMPTY_VALUE,
      dexDepositFee: env.EMPTY_VALUE,
      dexWithdrawFee: env.EMPTY_VALUE,

      // Configs
      borrowable: false,
      lendable: false,
      collateral: false,
      collateralEnabled: false,
      dexWithdrawable: true,
      dexDepositable: true,
      basket: true,
      decimals: 18,
      market: "0xB686BcB112660343E6d15BDb65297e110C8311c4",
      initialLongToken: env.USDC_TOKEN_ADDRESS,
      initialShortToken: USDT,
      ratio: env.EMPTY_VALUE,
      encodedName: "0x555344432d555344542d53574150000000000000000000000000000000000000"
    }
  ];
};

const getTokenAvailableLiquidity = async (token) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "availableLiquidity",
      args: [token.address]
    });
  } catch (error) {
    throw new Web3Exception(`Getting ${token.name} Available Liquidity Failed`, {token, error});
  }
};

const getConfigurations = async (token) => {
  try {
    const [lendFactor, borrowFactor] = await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "configurations",
      args: [token.address]
    });
    return {lendFactor, borrowFactor};
  } catch (error) {
    throw new Web3Exception(`Failed to Fetch Configurations for ${token.name} Token`, {
      token,
      error
    });
  }
};

const getTokenPrice = async (token) => {
  try {
    return await readContract(config, {
      abi: GMPriceOracle.abi,
      address: env.ORACLE_ADDRESS,
      functionName: "getUnderlyingPrice",
      args: [token.address]
    });
  } catch (error) {
    throw new Web3Exception(`Getting ${token.name} Price Failed`, {token, error});
  }
};

const getTokenName = async (tokenAddress) => {
  try {
    return await readContract(config, {
      abi: erc20Abi.abi,
      address: tokenAddress,
      functionName: "name",
      args: []
    });
  } catch (error) {
    throw new Web3Exception(`Getting ${tokenAddress} Name Failed`, {tokenAddress, error});
  }
};

const getTokenSymbol = async (tokenAddress) => {
  try {
    return await readContract(config, {
      abi: erc20Abi.abi,
      address: tokenAddress,
      functionName: "symbol",
      args: []
    });
  } catch (error) {
    throw new Web3Exception(`Getting ${tokenAddress} Symbol Failed`, {tokenAddress, error});
  }
};

const getUserAssetBalance = async (token, userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: erc20Abi.abi,
      address: token.address,
      functionName: "balanceOf",
      args: [userWalletAddress]
    });
  } catch (error) {
    throw new Web3Exception(
      `Getting User Balance of ${token.name} Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {token, userWalletAddress, error}
    );
  }
};

const getPoolAssetBalance = async (token, userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "balanceOf",
      args: [token.address, userWalletAddress]
    });
  } catch (error) {
    throw new Web3Exception(
      `Getting Pool Balance of ${token.name} Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {token, userWalletAddress, error}
    );
  }
};

const getReserveFactorMantissa = async () => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "reserveFactor",
      args: []
    });
  } catch (error) {
    throw new Web3Exception(
      `Getting Reserve Factor Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {error}
    );
  }
};

const getTokenTotalReserves = async () => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "totalReserves",
      args: []
    });
  } catch (error) {
    throw new Web3Exception(`Getting Total Reserves Failed`, {error});
  }
};

const calculateHealthFactor = async (token, amount, userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "calculateHealthFactor",
      args: [token.address, userWalletAddress, amount]
    });
  } catch (error) {
    throw new Web3Exception(
      `Calculating ${token.name} Health Factor Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {token, amount, userWalletAddress, error}
    );
  }
};

const calculateHFAfterCollChange = async (token, userWalletAddress, collAmount, collIncrease) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "calculateHFAfterCollChange",
      args: [token.address, userWalletAddress, collAmount, collIncrease]
    });
  } catch (error) {
    throw new Web3Exception(
      `Calculating ${token.name} HF After CollChange Failed: ${
        error.shortMessage || "Unknown Reason!"
      }`,
      {token, userWalletAddress, collAmount, collIncrease, error}
    );
  }
};

const addReferrer = async (userWalletAddress) => {
  let toastId = toastLoading("Please Sign Referrer Transaction");

  try {
    const referralHash = await writeContract(config, {
      abi: GMPointsAbi.abi,
      address: env.GM_POINTS_CONTRACT_ADDRESS,
      functionName: "addReferrer",
      args: [userWalletAddress]
    });

    toastId = reopenToastLoading(toastId, "Waiting For Referrer Transaction Confirmation...");
    const receipt = await waitForTransactionReceipt(config, {hash: referralHash});
    toastDismiss(toastId);

    return {hash: referralHash, receipt};
  } catch (error) {
    toastDismiss(toastId);
    throw new Web3Exception(
      `Referrer Failed: ${error.shortMessage || "Uknown Reason!"}`,
      {userWalletAddress, error},
      {sendToast: true}
    );
  }
};

const getUserRefs = async (userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: GMPointsAbi.abi,
      address: env.GM_POINTS_CONTRACT_ADDRESS,
      functionName: "userRefs",
      args: [userWalletAddress]
    });
  } catch (error) {
    throw new Web3Exception(
      `Gettings User Refs Failed: ${error.shortMessage || "Uknown Reason!"}`,
      {userWalletAddress, error}
    );
  }
};

const getGloopStakersYieldFactor = async () => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "gloopStakersYieldFactor",
      args: []
    });
  } catch (error) {
    throw new Web3Exception(
      `Getting Gloop Stakers Yield Factor Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {error}
    );
  }
};

const getUtilizationRate = async (token, availableLiquidity, totalBorrows) => {
  try {
    const rate = await readContract(config, {
      abi: GMInterestRateModel.abi,
      address: env.GM_INTERESTRATE_ADDRESS,
      functionName: "utilizationRate",
      args: [availableLiquidity, totalBorrows]
    });

    return createBigNumber(formatEther(rate)).mul(100).toFixed(2);
  } catch (error) {
    throw new Web3Exception(`Getting ${token.name} Utilization Rate Failed`, {
      token,
      availableLiquidity,
      totalBorrows,
      error
    });
  }
};

const getEffectiveUSDCBalance = async (userWalletAddress) => {
  try {
    return await readContract(config, {
      abi: lendingPoolAbi.abi,
      address: env.LENDING_POOL_ADDRESS,
      functionName: "getEffectiveUSDCBalanceOf",
      args: [userWalletAddress]
    });
  } catch (error) {
    throw new Web3Exception(
      `Getting Effective USDC Balance Failed: ${error.shortMessage || "Unknown Reason!"}`,
      {userWalletAddress, error}
    );
  }
};

export {
  getConfigurations,
  getTokensList,
  getTokenPrice,
  getTokenAvailableLiquidity,
  getUserAssetBalance,
  getPoolAssetBalance,
  getReserveFactorMantissa,
  getTokenTotalReserves,
  calculateHealthFactor,
  calculateHFAfterCollChange,
  addReferrer,
  getGloopStakersYieldFactor,
  getUtilizationRate,
  getTokenName,
  getTokenSymbol,
  getUserRefs,
  getEffectiveUSDCBalance
};

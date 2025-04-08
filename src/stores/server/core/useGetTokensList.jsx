import {useQuery, useQueryClient} from "@tanstack/react-query";
import {formatEther, formatUnits, parseUnits, parseEther} from "viem";
import {queries} from "~/consts/queries";

import {
  getTokensList,
  getTokenPrice,
  getTokenAvailableLiquidity,
  getPoolAssetBalance,
  getUtilizationRate,
  getTokenTotalReserves
} from "~/web3/core";
import {
  getBorrowTokenAPY,
  getTokenTotalBorrow,
  getUserBorrowBalance,
  getCollateralEnabledStatus
} from "~/web3/borrowWeb3";

import useBorrowStore from "~/stores/client/borrow";
import usePortfolioStore from "~/stores/client/portfolio";
import useGmiStore from "~/stores/client/gmi";
import {
  getDexBankBalance,
  getDexTokenPrice,
  getDexTotalControlledValue,
  getDexTotalSupply,
  getTokenVaults,
  getTransferFee
} from "~/web3/GMIWeb3";
import env from "~/env";
import {getSupplyAPY} from "~/web3/LendWeb3";
import useLendStore from "~/stores/client/lend";
import {createBigNumber} from "~/utils/math";
import useUserStore from "~/stores/client/user";

const useGetTokensList = ({enabled = true}) => {
  const walletAddress = useUserStore((state) => state.walletAddress);

  const tryUpdateBorrowStore = (token) => {
    const {selectedMarket, setSelectedMarket} = useBorrowStore.getState();

    if (selectedMarket && selectedMarket.name === token.name) {
      setSelectedMarket(token);
    }
  };

  const tryUpdatePortflioStore = (token) => {
    const {selectedPosition, setSelectedPosition} = usePortfolioStore.getState();

    if (selectedPosition && selectedPosition.name === token.name) {
      setSelectedPosition(token);
    }
  };

  const tryUpdateGMIStore = (token) => {
    const {selectedToken, setSelectedToken} = useGmiStore.getState();

    if (selectedToken && selectedToken.name === token.name) {
      setSelectedToken(token);
    }
  };

  const tryUpdateLendStore = (token) => {
    const {selectedToken, setSelectedToken} = useLendStore.getState();

    if (selectedToken && selectedToken.name === token.name) {
      setSelectedToken(token);
    }
  };

  const tryUpdateClientStores = (token) => {
    tryUpdateBorrowStore(token);
    tryUpdatePortflioStore(token);
    tryUpdateLendStore(token);
    tryUpdateGMIStore(token);
  };

  const fetchPortfolioFields = async (token) => {
    if (!walletAddress) return token;

    try {
      const userPoolBalance = await getPoolAssetBalance(token, walletAddress);
      const formattedUserPoolBalance = formatUnits(userPoolBalance, token.decimals).toString();
      token.userPoolBalance = formattedUserPoolBalance;
    } catch (error) {}

    try {
      const userBorrows = await getUserBorrowBalance(token, walletAddress);
      const formattedBorrow = formatUnits(userBorrows, token.decimals).toString();
      token.userBorrows = formattedBorrow;
    } catch (error) {}

    return token;
  };

  const fetchBorrowFields = async (token) => {
    try {
      const price = await getTokenPrice(token);
      const formattedPrice = formatEther(price).toString();
      token.price = formattedPrice;
    } catch (error) {}

    try {
      const availableLiquidity = await getTokenAvailableLiquidity(token);
      const formattedAvailableLiquidity = formatUnits(
        availableLiquidity,
        token?.decimals
      ).toString();
      token.availableLiquidity = formattedAvailableLiquidity;
    } catch (error) {}

    try {
      const totalReserves = await getTokenTotalReserves();
      const formatedTotalReserves = formatUnits(totalReserves, token?.decimals).toString();
      token.totalReserves = formatedTotalReserves.toString();
    } catch (error) {}

    try {
      // Only USDC has total borrows and other are zero
      if (token?.borrowable) {
        const totalBorrows = await getTokenTotalBorrow(token);
        const formattedBorrow = formatUnits(totalBorrows, token?.decimals).toString();
        token.totalBorrows = formattedBorrow;
      } else {
        token.totalBorrows = "0";
      }
    } catch (error) {}

    if (token?.borrowable) {
      try {
        if (token.totalBorrows === env.EMPTY_VALUE || token.availableLiquidity === env.EMPTY_VALUE)
          throw new Error();

        token.borrowApy = await getBorrowTokenAPY(token);
      } catch (error) {}
    }

    try {
      if (token.collateral) {
        token.supplyApy = "0";
      } else {
        if (token.totalBorrows === env.EMPTY_VALUE || token.availableLiquidity === env.EMPTY_VALUE)
          throw new Error();

        const supplyApy = await getSupplyAPY(token);
        const formattedSupplyApy = formatEther(supplyApy);
        token.supplyApy = formattedSupplyApy;
      }
    } catch (error) {}

    try {
      const totalBorrows = parseUnits(token.totalBorrows, token.decimals);
      const availableLiquidity = parseUnits(token.availableLiquidity, token.decimals);
      token.utilizationRate = (
        await getUtilizationRate(token, availableLiquidity, totalBorrows)
      ).toString();
    } catch (error) {}

    if (walletAddress) {
      try {
        token.collateralEnabled = await getCollateralEnabledStatus(token, walletAddress);
      } catch (error) {}
    }

    return token;
  };

  const fetchDexFields = async (token) => {
    try {
      const price = await getDexTokenPrice(token);
      token.dexPrice = formatEther(price.toString()).toString();
    } catch (error) {}

    if (token.market) {
      try {
        const vaults = await getTokenVaults(token);
        const ratio = vaults[2];
        token.ratio = createBigNumber(ratio).div(10).toNumber();
      } catch (error) {}
    }

    try {
      const totalControlledValue = await getDexTotalControlledValue(false);
      token.dexTotalControlledValue = formatUnits(
        totalControlledValue.toString(),
        token.decimals
      ).toString();
    } catch (error) {}

    try {
      const totalSupply = await getDexTotalSupply();
      token.dexTotalSupply = formatUnits(totalSupply.toString(), token.decimals).toString();
    } catch (error) {}

    try {
      const bankBalance = await getDexBankBalance(token);
      token.dexBankBalance = formatUnits(bankBalance.toString(), token.decimals);
    } catch (error) {}

    try {
      const depositFee = await getTransferFee(token, parseEther("0.1"), false);
      token.dexDepositFee = createBigNumber(depositFee).div(100).toString();
    } catch (error) {}

    try {
      const withdrawFee = await getTransferFee(token, parseEther("0.1"), true);
      token.dexWithdrawFee = createBigNumber(withdrawFee).div(100).toString();
    } catch (error) {}
    return token;
  };

  const fetchTokenPropertiesParallel = async (tokens) => {
    const updatedTokens = await Promise.all(
      tokens.map(async (token) => {
        // Fetch Borrow and Portfolio, dexFields Fields in parallel
        const [borrowFields, portfolioFields, dexFields] = await Promise.all([
          fetchBorrowFields(token),
          fetchPortfolioFields(token),
          fetchDexFields(token)
        ]);

        const updatedToken = Object.assign(token, borrowFields, portfolioFields, dexFields);
        tryUpdateClientStores(updatedToken);
        return updatedToken;
      })
    );
    return updatedTokens;
  };

  const getQuery = async () => {
    const tokens = getTokensList();
    return await fetchTokenPropertiesParallel(tokens);
  };

  return useQuery({
    queryKey: [queries.GET_TOKENS_LIST, walletAddress || "unauthenticated"],
    queryFn: getQuery,
    enabled: enabled,
    placeholderData: getTokensList()
  });
};

export default useGetTokensList;

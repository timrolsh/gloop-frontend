import {formatEther} from "viem";
import useGetTokenName from "~/stores/server/core/useGetTokenName";
import useGetAPR from "~/stores/server/lend/useGetAPR";
import {truncateString} from "~/utils/truncateString";
import {truncateAmount} from "~/utils/ui";
import Skeleton from "../Skeleton";

import GloopToken from "~/assets/img/tokens/gloop.jpg";
import {createBigNumber} from "~/utils/math";
import useGetOraclePriceFeed from "~/stores/server/core/useGetOraclePriceFeed";
import {useMemo} from "react";
import env from "~/env";
import useGetGloopPrice from "~/stores/server/lend/useGetGloopPrice";

const RewardTokensTableRow = ({tokenAddress, totalUnclaimedReward}) => {
  const OraclePriceFeedAddressMapper = {
    "0x4d48d503ed04d50418C9aBF163b1168FF834E47c": "0xaD1d5344AaDE45F43E596773Bcc4c423EAbdD034" // GLOOP
  };

  // APR
  
  const {data: APR, isLoading: isLoadingAPR} = useGetAPR({
    rewardTokenAddress: tokenAddress
  });

  const tokenNameQuery = useGetTokenName({tokenAddress});
  const oraclePriceFeedQuery = useGetOraclePriceFeed({
    tokenAddress: OraclePriceFeedAddressMapper[tokenAddress],
    enabled: tokenAddress !== "0x4d48d503ed04d50418C9aBF163b1168FF834E47c"
  }); // if token is not Gloop
  const gloopPriceQuery = useGetGloopPrice({
    enabled: tokenAddress === "0x4d48d503ed04d50418C9aBF163b1168FF834E47c"
  }); // // if token is Gloop

  const unclaimedValue = useMemo(() => {
    const price =
      tokenAddress === "0x4d48d503ed04d50418C9aBF163b1168FF834E47c"
        ? gloopPriceQuery.data
        : oraclePriceFeedQuery.data;

    if (!price || isNaN(price) || Number(price) <= 0) {
      console.log("Price is invalid, returning EMPTY_VALUE");
      return env.EMPTY_VALUE;
    }

    if (!totalUnclaimedReward || totalUnclaimedReward === 0n) {
      console.log("No unclaimed rewards, returning 0");
      return "0";
    }

    const formatedUnclaimedReward = formatEther(totalUnclaimedReward);

    const result = createBigNumber(formatedUnclaimedReward).mul(price).toString();

    return result;
  }, [totalUnclaimedReward, oraclePriceFeedQuery, gloopPriceQuery, tokenAddress]);

  return (
    <tr key={tokenAddress}>
      <Skeleton loading={tokenNameQuery.isLoading}>
        <div className="d-flex" style={{gap: "8px"}}>
          <img id="tokenImage" src={GloopToken} width={22} height={22} />
          <td title={truncateString(tokenAddress)} className="color-gray font-14 bold-300">
            <a
              className="color-gray"
              href={`https://arbiscan.io/address/${tokenAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              GLOOP (GLOOP)
            </a>
          </td>
        </div>
      </Skeleton>
      <td className="color-gray font-14 bold-300">
        {truncateAmount(formatEther(totalUnclaimedReward.toString()).toString())}
      </td>
      <Skeleton loading={unclaimedValue === env.EMPTY_VALUE}>
        <td className="color-gray font-14 bold-300">
          <>${truncateAmount(unclaimedValue, 2)}</>
        </td>
      </Skeleton>
      <Skeleton loading={isLoadingAPR}>
        <td className="color-gray font-14 bold-300">
          <>{truncateAmount(APR, 2)}%</>
        </td>
      </Skeleton>
    </tr>
  );
};

export default RewardTokensTableRow;

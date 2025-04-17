import {formatEther} from "viem";
import useGetTokenName from "~/stores/server/core/useGetTokenName";
import useGetAPR from "~/stores/server/lend/useGetAPR";
import {truncateString} from "~/utils/truncateString";
import {truncateAmount} from "~/utils/ui";
import Skeleton from "../Skeleton";

import ARBIcon from "~/assets/img/tokens/arbitrum.svg";
import GloopToken from "~/assets/img/tokens/gloop.jpg";
import {createBigNumber} from "~/utils/math";
import useGetOraclePriceFeed from "~/stores/server/core/useGetOraclePriceFeed";
import {useMemo} from "react";
import env from "~/env";
import useGetGloopPrice from "~/stores/server/lend/useGetGloopPrice";

const RewardTokensTableRow = ({tokenAddress, totalUnclaimedReward}) => {
  const OraclePriceFeedAddressMapper = {
    "0xFF1CF3E391e012C47AcF3e153FC26fc7D9Ec94a4": "0xb2A824043730FE05F3DA2efaFa1CBbe83fa548D6", // FAKE ARB
    "0x1b9a9f26e553b10AC0d410f67A86A767a35CF162": "0xaD1d5344AaDE45F43E596773Bcc4c423EAbdD034" // GLOOP
  };

  const ImageMapper = {
    "FAKE ARB": ARBIcon,
    POOLG: GloopToken,
    GLOOP: GloopToken
  };
  // APR
  const {data: APR, isLoading: isLoadingAPR} = useGetAPR({
    rewardTokenAddress: tokenAddress
  });

  const tokenNameQuery = useGetTokenName({tokenAddress});
  const oraclePriceFeedQuery = useGetOraclePriceFeed({
    tokenAddress: OraclePriceFeedAddressMapper[tokenAddress],
    enabled: tokenAddress !== "0x1b9a9f26e553b10AC0d410f67A86A767a35CF162"
  }); // if token is not Gloop
  const gloopPriceQuery = useGetGloopPrice({
    enabled: tokenAddress === "0x1b9a9f26e553b10AC0d410f67A86A767a35CF162"
  }); // // if token is Gloop

  const unclaimedValue = useMemo(() => {
    const price =
      tokenAddress === "0x1b9a9f26e553b10AC0d410f67A86A767a35CF162"
        ? gloopPriceQuery.data
        : oraclePriceFeedQuery.data;

    if (!price) return env.EMPTY_VALUE;

    const formatedUnclaimedReward = formatEther(totalUnclaimedReward);
    return createBigNumber(formatedUnclaimedReward).mul(price).toString();
  }, [totalUnclaimedReward, oraclePriceFeedQuery, gloopPriceQuery, tokenAddress]);
  console.log(tokenNameQuery);

  return (
    <tr key={tokenAddress}>
      <Skeleton loading={tokenNameQuery.isLoading}>
        <div className="d-flex" style={{gap: "8px"}}>
          <img
            id="tokenImage"
            src={ImageMapper[tokenNameQuery.data?.symbol]}
            width={22}
            height={22}
          />
          <td title={truncateString(tokenAddress)} className="color-gray font-14 bold-300">
            <a
              className="color-gray"
              href={`https://arbiscan.io/address/${tokenAddress}`}
              target="_blank"
            >{`${tokenNameQuery.data?.name} (${tokenNameQuery.data?.symbol})`}</a>
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

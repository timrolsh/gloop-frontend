import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {useBlockNumber} from "wagmi";

import {queries} from "~/consts/queries";
import env from "~/env";
import useUserStore from "~/stores/client/user";
import {getAllUserRewards} from "~/web3/GMIncentivesWeb3";

const useGetAllUserRewards = ({enabled = true}) => {
  const walletAddress = useUserStore((state) => state.walletAddress);

  const {data: blockNumber} = useBlockNumber({
    watch: true,
    cacheTime: 4_000
  });

  const getData = async () => {
    if (!walletAddress) {
      const result = [];
      // console.log("All user rewards from chain (no wallet address):", result); // Optional: Log if needed
      return result;
    }

    // TODO remove this matrix filtering once old tokens are dropped after compliance period
    const rewardsMatrix = await getAllUserRewards(walletAddress);
    let finalResult;

    if (!rewardsMatrix) { // Handles null/undefined from the fetch function
      finalResult = env.EMPTY_VALUE;
      // console.log("All user rewards from chain (no data from API call):", finalResult);
      return finalResult;
    }

    // Check if the matrix is empty or if the first row (expected to contain addresses) is missing or empty.
    if (rewardsMatrix.length === 0 || !rewardsMatrix[0] || rewardsMatrix[0].length === 0) {
      finalResult = rewardsMatrix; // e.g., [], [[]], etc.
      // console.log("All user rewards from chain (empty or unfilterable matrix structure):", finalResult);
      return finalResult;
    }

    const inactiveAddresses = [
      "0x1b9a9f26e553b10AC0d410f67A86A767a35CF162",
      "0xFF1CF3E391e012C47AcF3e153FC26fc7D9Ec94a4"
    ].map(addr => addr.toLowerCase()); // Normalize for case-insensitive comparison

    const addressesInFirstRow = rewardsMatrix[0];

    // Create a boolean mask indicating which columns (tokens) to keep.
    // Addresses are converted to string and lowercased for robust comparison.
    const columnsToKeep = addressesInFirstRow.map(
      (addr) => !inactiveAddresses.includes(String(addr).toLowerCase())
    );

    // Check if there are any columns to keep after filtering.
    const hasAnyColumnToKeep = columnsToKeep.some(keep => keep);

    if (!hasAnyColumnToKeep) {
      finalResult = []; // All tokens/columns are filtered out.
      // console.log("All user rewards from chain (all tokens were filtered out):", finalResult);
      return finalResult;
    }

    // Reconstruct the matrix: for each row, filter its elements based on the columnsToKeep mask.
    finalResult = rewardsMatrix.map(row =>
      row.filter((_, columnIndex) => columnsToKeep[columnIndex])
    );
    
    // Log the final filtered data, as per user's placement of the console.log
    // console.log("All user rewards from chain", finalResult);
    return finalResult;
  };

  return useQuery({
    queryKey: [queries.GET_ALL_USER_REWARDS, walletAddress, blockNumber?.toString()],
    queryFn: getData,
    enabled: enabled,
    placeholderData: keepPreviousData
  });
};

export default useGetAllUserRewards;

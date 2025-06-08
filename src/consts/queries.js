export const queries = {
  // Core
  GET_CONFIGURATIONS: "get_configurations",
  GET_TOKENS_LIST: "get_tokens_list",
  GET_HEALTH_FACTOR: "get_health_factor",
  GET_HYPOTHETICAL_HEALTH_FACTOR: "get_hypothetical_health_factor",
  GET_DEBT_REPAY_HYPOTHETICAL_HEALTH_FACTOR: "get_debt_repay_hypothetical_health_factor",
  GET_RESERVE_FACTOR_MANTISSA: "get_reserve_factor_mantissa",
  GET_GLOOP_STAKERS_YIELD_FACTOR: "get_gloop_stakers_yield_factor",
  GET_UTILIZATION_RATE: "get_utilization_rate",
  GET_TOKEN_NAME: "get_token_name",
  GET_TOKEN_ORACLE_PRICE: "get_oracle_token_price",
  GET_TOTAL_TVL: "get_total_tvl",
  GET_TOTAL_BORROWED: "get_total_borrowed",
  GET_TOTAL_LENT: "get_total_lent",

  // Borrow
  GET_MAX_BORROWABLE_VALUE: "get_max_borrowable_value",
  GET_TOTAL_BORROWS: "get_token_total_borrows",
  GET_TOTAL_USER_COLLATERAL_VALUE: "get_total_user_collateral_value",
  GET_USER_COLLATERALS: "get_user_collaterals",
  GET_MAX_WITHDRAWAL: "get_max_withdrawal",

  // Lend
  GET_LEND_DEPOSIT_TOKEN_BALANCE: "get_lend_deposit_token_balance",
  GET_LEND_WITHDRAW_TOKEN_BALANCE: "get_lend_withdraw_token_balance",
  GET_USDC_OVERALL: "get_usdc_overall",
  GET_TOTAL_UNDERLYING: "get_total_underlying",
  GET_GLOOP_PRICE: "get_gloop_price",

  // Liquidation
  GET_DEBT_POSITIONS: "get_debt_positions",
  GET_IS_USER_LIQUIDABLE: "get_is_user_liquidable",
  GET_LIQUIDATION_BONUS: "get_liquidation_bonus",

  // Leaderboard
  GET_USER_DETAILS: "get_user_details",
  GET_LEADERBOARD: "get_leaderboard",
  GET_USER_REFS: "get_user_refs",

  // GMI
  GET_TARGET_BALANCE: "get_target_balance",
  GET_TARGET_AMOUNT: "get_target_amount",
  GET_TRANSFER_FEE: "get_transfer_fee",
  GET_GMI_BALANCE: "get_gmi_balance",
  GET_DEX_SLIPPAGE: "get_dex_slippage",
  GET_MIN_AMOUNT_OUT: "get_min_amount_out",
  GET_GMI_APY: "get_gmi_apy",
  GET_GMI_TOTAL_SUPPLY: "get_gmi_total_supply",
  GET_GMI_TOTAL_CONTROLLED_VALUE: "get_gmi_total_controlled_value",
  GET_GMI_PRICE: "get_gmi_price",
  GET_LOWEST_FEE_TOKEN: "get_lowest_fee_token",

  // Incentives
  GET_ALL_USER_REWARDS: "get_all_user_rewards",
  GET_APR: "get_apr"
};

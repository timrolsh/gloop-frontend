export class LeaderboardDTO {
  constructor(
    address = "",
    lendingUSDCPoints = "",
    borrowingUSDCPoints = "",
    totalEarnedPoints = "",
    stakingBoost = "",
    rank = ""
  ) {
    this.address = address;
    this.lendingUSDCPoints = lendingUSDCPoints;
    this.borrowingUSDCPoints = borrowingUSDCPoints;
    this.stakingBoost = stakingBoost;
    this.totalEarnedPoints = totalEarnedPoints;
    this.rank = rank;
  }
}

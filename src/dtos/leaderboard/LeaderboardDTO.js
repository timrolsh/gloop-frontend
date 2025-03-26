export class LeaderboardDTO {
  constructor(address = '', lendingUSDCPoints = '', borrowingUSDCPoints = '', totalEarnedPoints = '', referralBoost = '', rank = '') {
    this.address = address
    this.lendingUSDCPoints = lendingUSDCPoints
    this.borrowingUSDCPoints = borrowingUSDCPoints
    this.referralBoost = referralBoost
    this.totalEarnedPoints = totalEarnedPoints
    this.rank = rank
  }
}
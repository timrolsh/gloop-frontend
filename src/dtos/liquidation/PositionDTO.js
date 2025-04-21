export class PositionDTO {
  constructor(walletAddress = "", usdcDebt = "", totalCollateralValue = []) {
    this.walletAddress = walletAddress;
    this.usdcDebt = usdcDebt;
    this.totalCollateralValue = totalCollateralValue;
  }
}

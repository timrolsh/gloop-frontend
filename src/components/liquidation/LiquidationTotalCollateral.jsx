import { useMemo } from 'react'
import { createBigNumber } from '~/utils/math'

// icons
import roundedGmETHIcon from '~/assets/img/tokens/roundGmETH.svg'
import roundedGmBTCIcon from '~/assets/img/tokens/roundGmBTC.svg'
import roundedGmSOLIcon from '~/assets/img/tokens/roundGmSOL.svg'
import { ImplementationException } from '~/consts/exceptions'

export function LiquidationTotalCollateral({ totalCollateralValue }) {

  const getTokenImage = (collateral) => {

    switch (collateral.assetName) {
      case 'BTC':
        return roundedGmBTCIcon
      case 'ETH':
        return roundedGmETHIcon
      case 'SOL':
        return roundedGmSOLIcon

      default:
        throw ImplementationException('Uknonwn Collateral Token', { collateral })
    }

  }

  return (
    <div style={{ display: 'flex' }}>
      {
        totalCollateralValue.map((collateral, index) => (
          <img key={index} src={getTokenImage(collateral)} alt="" style={{ marginLeft: `${index === 0 ? '' : '-16px'}` }} />
        ))
      }
    </div>
  )

}
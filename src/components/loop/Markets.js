import MarketOverview from './MarketOverview'
import MarketBorrow from './MarketBorrow'
import useBorrowStore from '~/stores/client/borrow'
import AuthenticatedSection from '../AuthenticatedSection'


export default function Markets() {
  const selectedMarket = useBorrowStore((state) => state.selectedMarket)

  return (
    <>
      {
        selectedMarket ? (
          <AuthenticatedSection height='700px'>
            <div className="px-sm-4 pt-4 pb-4 bg-trans radius-8">
              <MarketBorrow />
            </div>

          </AuthenticatedSection>
        ) : (
          <div className="px-sm-4 pt-4 pb-4 bg-trans radius-8">

            <MarketOverview />
          </div>
        )
      }
    </>
  )
}
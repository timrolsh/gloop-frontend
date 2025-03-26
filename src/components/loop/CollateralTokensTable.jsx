import { Table } from 'react-bootstrap'
import TokensTableRow from './TokensTableRow'
import { useMemo } from 'react'
import useGetTokensList from '~/stores/server/core/useGetTokensList'
import { DATAMODES } from '~/consts/enums'
import { createBigNumber } from '~/utils/math'
import env from '~/env'

export default function CollateralTokensTable({ onRowClick, mode }) {

  const { data: tokens, isLoading } = useGetTokensList({})

  const collateralTokens = useMemo(() => {

    if (tokens.every(x => x.userPoolBalance === env.EMPTY_VALUE || x.userBorrows === env.EMPTY_VALUE)) // tokens are loading still
      return tokens.filter(x => x.collateral)

    if (mode === DATAMODES.PORTFOLIO) {
      return (tokens || []).filter(
        (x) => {
          return x.collateral && (createBigNumber(x.userPoolBalance).gt(0) || createBigNumber(x.userBorrows).gt(0))
        }
      )
    } else {
      return (tokens || []).filter(
        (x) => x.collateral
      )
    }
  }, [tokens, mode])

  return (
    <Table borderless className='market-list-table mb-0'>
      <thead >
        <tr>
          <th className='color-gray font-14 bold-300 px-2'>Asset</th>
          <th className='color-gray font-14 bold-300 px-2'>Price</th>
          <th className='color-gray font-14 bold-300 px-2'>Supply</th>
          <th className='color-gray font-14 bold-300 px-2'>Borrow</th>
          <th className='color-gray font-14 bold-300 px-2'>Supply APY</th>
          <th className='color-gray font-14 bold-300 px-2'>Borrow APY</th>
        </tr>
      </thead>
      <tbody>
        {
          !isLoading && collateralTokens.length ? collateralTokens.map((token, index) => (
            <TokensTableRow key={index} token={token} displayHr={index !== collateralTokens.length - 1} onRowClick={onRowClick} mode={mode} isLoading={isLoading} />
          ))
            :
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                <p className='color-gray1 font-14 bold-500 px-2'>You have no collateral token</p>
              </td>
            </tr>
        }
      </tbody>
    </Table>
  )
}
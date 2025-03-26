import { Table } from 'react-bootstrap'
import useGetTokensList from '~/stores/server/core/useGetTokensList'
import { useMemo } from 'react'
import TokensTableRow from './TokensTableRow'
import { DATAMODES } from '~/consts/enums'

export default function BorrowTokensTable({ onRowClick, mode }) {

  const { data: tokens, isLoading } = useGetTokensList({})

  const borrowableTokens = useMemo(() => {
   
    if (mode === DATAMODES.PORTFOLIO) {
      return (tokens || []).filter(x => x.borrowable  && (x.userPoolBalance !== "0" || x.userBorrows !== "0"))
    } else {
      return (tokens || []).filter(x => x.borrowable)
    }
  }, [tokens])

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
          !isLoading && borrowableTokens.length ? borrowableTokens.map((token, index) => (
            <TokensTableRow key={index} token={token} displayHr={index !== borrowableTokens.length - 1} onRowClick={onRowClick} mode={mode} />
          ))
          : 
          <tr>
            <td colSpan={6} style={{ textAlign: 'center' }}>
              <p className='color-gray1 font-14 bold-500 px-2'>You have no borrow token</p>
            </td>
          </tr>
          }
      </tbody>
    </Table>
  )
}
export const routes = {
  Home: { name: 'Home', path: '/', locked: false, authenticated: false },
  Dashboard: { name: 'Dashboard', path: '/dashboard', locked: false, authenticated: false },
  Gmi: { name: 'GMI', path: '/gmi', locked: false, authenticated: false },
  Leaderboard: { name: 'Leaderboard', path: '/leaderboard', locked: true, authenticated: false },
  Loop: { name: 'Loop', path: '/loop', locked: false, authenticated: false },
  Liquidate: { name: 'Liquidate', path: '/liquidate', locked: false, authenticated: false },
  Borrow: { name: 'Deposit/Borrow', path: '/borrow', locked: false, authenticated: false },
  Lend: { name: 'Lend USDC', path: '/lend', locked: false, authenticated: false },
  Stake: { name: 'GLOOP Staking', path: '/stake', locked: true, authenticated: false },
}
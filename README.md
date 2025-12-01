# Gloop Finance Frontend

## Overview

The Gloop Finance frontend is a React-based web app that provides the web UI for the Gloop Finance DeFi protocol on Arbitrum. [Gloop Finance](https://gloop.finance/) is a GMX yield optimizer offering two main features:

1. **GMI (GM Index Token)**: An ERC-20 index token that provides a curated basket of GMX market tokens (GM: BTC/USD, GM: ETH/USD, GM: SOL/USD, GM: SWAP-ONLY) with algorithmically optimized weights for optimal risk-return ratios.

2. **GM Lending/Borrowing Platform**: A decentralized, non-custodial lending and borrowing platform that enables users to leverage GM assets as collateral to borrow USDC, allowing for strategic leverage and yield optimization through "gLooping" (leveraged positions).

The frontend provides an intuitive interface for users to interact with all protocol features, including GMI token management, lending/borrowing operations, GLOOP staking, points program tracking, and liquidation monitoring, interacting with the [Gloop Finance backend](https://github.com/timrolsh/gloop-backend) to retrieve dynamic data.

## Tech Stack

- **React**
- **Create React App** with **CRACO**
- **TanStack React Query** Server state management and synchronization with backend API

### Web3 Integration

- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **RainbowKit** - Wallet connection UI components
- **[Ethers.js v6](https://docs.ethers.org/)** - Ethereum utilities and contract interaction

## Key Features

### GMI (GM Index Token) Interface

- **Deposit/Withdraw**: Users can deposit GM tokens (BTC, ETH, SOL, SWAP-ONLY) or USDC to mint GMI tokens
- **Token Basket View**: Display of current GMI composition and target weights
- **Fee Calculation**: Real-time fee calculation based on deposit/withdraw impact on index balance
- **Reflection Tracking**: Visual representation of protocol-owned liquidity growth

### GM Lending/Borrowing Platform

- **Lend USDC**: Supply USDC to earn lending APY and points
- **Deposit Collateral**: Deposit GM tokens (BTC, ETH, SOL) as collateral
- **Borrow USDC**: Borrow against collateral with configurable loan-to-value ratios
- **Portfolio Management**: View and manage all positions in a unified dashboard
- **Health Factor Monitoring**: Real-time health factor tracking with liquidation risk warnings
- **gLooping Interface**: Tools and information for manually looping GM assets

### GLOOP Staking

- **Stake GLOOP**: Deposit GLOOP tokens with optional lock periods (0, 14, 28, or 56 days)
- **Boost Visualization**: Display of points boost multipliers based on lock duration
- **Rewards Tracking**: Monitor staking rewards and eligibility for airdrops
- **Unstake Management**: Unstake tokens after lock period expiration

### Points Program

- **Leaderboard**: Real-time leaderboard showing user rankings and points earned
- **Points Breakdown**: Detailed view of points earned from lending, borrowing, and staking boosts
- **Dashboard**: Personal dashboard showing individual points, rank, and activity

### Liquidation Interface

- **Liquidation Candidates**: View positions at risk of liquidation sorted by health factor
- **Collateral Details**: Detailed breakdown of collateral assets and values
- **Liquidation Execution**: Interface for liquidators to execute liquidations

### Authentication

- **Wallet Connection**: Connect via RainbowKit supporting multiple wallet providers
- **SIWE Authentication**: Sign-In With Ethereum for backend authentication
- **Protected Routes**: Route protection requiring wallet connection

## Installation, Development, Production Build

```bash
# Using yarn package manager v1
yarn install

# Start development server
yarn start

# Build for production
yarn build
# The build output will be in the `build/` directory
```

## Environment Configuration

The application uses environment variables for configuration hardcoded in [src/env/index.js](./src/env/index.js). Key settings include:

## Deployment

The application is configured for deployment on Cloudflare Workers: See `wrangler.toml` for Workers configuration

Build artifacts are generated in the `build/` directory and can be deployed to any static hosting service.

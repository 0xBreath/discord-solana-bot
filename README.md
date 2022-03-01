# Discord Bot + Solana Wallet Integration

## Postgres Set-Up

Postgres connection guide is not included.
Reasons:

- OS specific installation and CLI
- localhost vs. cloud server
- Personal IDE (I use a VS Code extension to connect)

### Target ./server/scripts/db.sql to deploy a Postgres database

## User Flow

1. /connect-wallet in discord server with bot
2. pass wallet pubkey as the command argument "wallet"
3. bot responds with URL to register wallet
4. Navigate to URL the discord bot provides, connect a Solana wallet, sign a trx to prove ownership
5. Server creates User on the database with {discordId, walletPubkey, signed=true}

## How to Deploy

1. git clone https://github.com/0xBreath/discord-ts.git
2. Open 2 terminals (will be hosting 2 servers on localhost)
   - Terminal 1 runs the React app frontend to register a wallet
   - Terminal 2 runs the Discord client and Express/Postgres backend
3. Terminal 1:
   - cd ./src
   - yarn
   - yarn start
4. Terminal 2:
   - cd ./server
   - yarn
   - yarn start
5. Navigate to localhost:3001/users/<REGISTERED_WALLET_PUBKEY> to see User info stored on database

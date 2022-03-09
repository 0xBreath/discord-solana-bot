import { PublicKey, Keypair } from '@solana/web3.js';

export const SERVER_PORT = 3001;
export const LOGIN_PORT = 3000;

export const USER_ROUTE = `http://localhost:${SERVER_PORT}/users`;
export const LOGIN_ROUTE = `http://localhost:${LOGIN_PORT}/users`;

export const UPDATE_AUTH = "3KYRrm18pHpwt4r7trvwoCeUJ4osqKbmTooG4yWeqwm4";
export const CREATOR = "HyWarRXn1Wu5wHMhcypLSQ9QRkjiuytfMkazNRuV3caA";

export const MAINNET_URL = "https://withered-delicate-bird.solana-mainnet.quiknode.pro/59cfd581e09e0c25b375a642f91a4db010cf27f6/";
export const DEVNET_URL = "https://api.mainnet-beta.solana.com";

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
  
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
  
export const TOKEN_PROGRAM_ID = new PublicKey(
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
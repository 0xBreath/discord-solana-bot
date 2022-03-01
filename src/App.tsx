import "./App.css";
import React, { useMemo, useEffect, useState }  from 'react';

import Home from "./Home";

import * as anchor from "@project-serum/anchor";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import { createTheme, ThemeProvider } from "@material-ui/core";


const network = 'mainnet-beta' as WalletAdapterNetwork
const rpcHost = 'https://api.mainnet-beta.solana.com' 
const connection = new anchor.web3.Connection(rpcHost);
const txTimeout = 30000;

const theme = createTheme({
  palette: {
    
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#F5F5F5',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  overrides: {
      // MuiButtonBase: {
      //     root: {
      //         justifyContent: 'center',
      //     },
      // },
      MuiListItem:{
        root:{
          background: '#d9d9d9',
                padding: 0,
        }
      },
      MuiButton: {
          root: {
              textTransform: undefined,
              padding: '12px 16px',
          },
          startIcon: {
              marginRight: 8,
          },
          endIcon: {
              marginLeft: 8,
          },
      },
  },
});


const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [
        getPhantomWallet(),
        getSlopeWallet(),
        getSolflareWallet(),
        getSolletWallet({ network }),
        getSolletExtensionWallet({ network })
    ],
    []
  );

  return (
      <ThemeProvider theme={theme}>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true}>
              <WalletDialogProvider>
                <Home
                  connection={connection}
                  txTimeout={txTimeout}
                />
              </WalletDialogProvider>
            </WalletProvider>
          </ConnectionProvider>
      </ThemeProvider>
  );
};

export default App;

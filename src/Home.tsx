//import { useEffect, useState } from "react";
import { useState }  from 'react';
import styled from "styled-components";
import { Button, CircularProgress, Snackbar, makeStyles } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";
//import bs58 from 'bs58'

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

import {
  shortenAddress,
  signArbitraryMessage
} from "./solana";


const ConnectButton = styled(WalletDialogButton)``;
const Container = styled.div``;
const RegisterButton = styled(Button)``; 

export interface HomeProps {
  connection: anchor.web3.Connection;
  txTimeout: number;
}


const Home = (props: HomeProps) => {
  const [isRegister, setRegister] = useState(false); // true when user press REGISTER button
  const [isExists, setExists] = useState(false); // true when wallet already exists within database

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const wallet = useAnchorWallet();

  const onRegister = async () => {
    try {
      setRegister(true);
      if (wallet) {

        // wallet signs message => returns trx details
        // call backend to verify signature
        const trx = await signArbitraryMessage(wallet as anchor.Wallet)
        //console.log('trx = ', trx)

        const pubkey = trx.pubkey;
          console.log('pubkey: ', pubkey);
        const sig = trx.signature;
          console.log('sig: ', sig);
        const msg = trx.message;
          console.log('msg: ', msg);

        const route = `http://localhost:3001/users/${pubkey}`

        const payload = {
          pubkey: pubkey,
          signature: sig,
          message: msg
        }

        // verify User on backend 
        // verified = boolean verified user?
        const verified = await fetch(route, {
          method: 'PUT',
          headers: {
              'Content-Type':'application/json',
              'Accept':'application/json'
          },
          body: JSON.stringify(payload)
        })
        console.log('verified? = ', verified)

        try {
          // failed to verified signature
          if (!verified) {
            setAlertState({
              open: true,
              message: "Error: failed to verify wallet!. Please try again.",
              severity: 'error'
            })
          } 
          // signature verified, continue checks 
          else {
            console.log('user verified!')
            setAlertState({
              open: true,
              message: "Welcome to Eleriah! Registration succeeded.",
              severity: "success"
            })
          } 
        } 
        catch {
          setAlertState({
            open: true,
            message: `Error: User already registered!`,
            severity: "error"
          })         
        }

      } // end of if
    } 
    catch (error: any) {

      let message = error.msg || "Registration errored out! Please try again.";

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } 
    finally {
      setRegister(false);
    }
  }; // end of onRegister()
  

  const classes = useStyles()

  return (
    <main className={classes.cover}>
      {wallet && (
        <p>Wallet {shortenAddress(wallet.publicKey.toBase58() || "")}</p>
      )}

      <div className={classes.mintArea}>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <div className={classes.words}>
          <h1>Arrivant Discord Connection</h1>
          <br></br>
          <h3>Link a Solana wallet to your Discord ID.</h3>
          <br></br>
        </div>
      <Container>
        {!wallet ? (
          <ConnectButton className={classes.centerConnect}>connect wallet</ConnectButton>
        ) : (
          <>

          <RegisterButton
            className={classes.mint}
            disabled={isRegister}
            onClick={onRegister}
            variant="contained"
          >
            {
              isExists ? ("wallet already registered") 
              : isRegister ? (<CircularProgress/>) : ("register")
            }
          </RegisterButton>
          </>
        )}
      </Container>
      </div>

      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const useStyles = makeStyles(theme => ({
  words: {
    color: '#000',
    textAlign: 'center',
    fontSize: 20,
  },
  mint: {
    background: '#FFF',
    color: 'black',
    border: 3,
    borderRadius: 3,
    height: 70,
    width: 150,
    fontSize: 22,
    font: 'Helvetica',
    padding: '30px 30px',

    '&:disabled':{
      backgroundColor:'#11C8C5',
      color:'white',
      opacity:'0.5'
    },
    '&:hover': {
      backgroundColor: '#EC683E',
      boxShadow: '0 0 50px white',
      color: 'black'
    }
  },
  bar: {
    position: 'absolute',
    top: '80%'
  },
  soldOut: {
    color: 'whitesmoke'
  },
  cover: {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100%',
    position: 'absolute',
    margin: '0 auto',
    background: '#FFFFF3',
    fontFamily: 'copperplate'
  },
  progressBarClass: {
    transform:'translate(0%, 150%)',
    height:'10px',
    width:'500px',
    borderRadius:'50px',
    backgroundColor:'black'
  },
  centerConnect: {
    background: '#000',
    color: 'white',
    border: 0,
    borderRadius: 3,
    height: 100,
    width: 250,
    fontSize: 22,
    font: 'Monaco',
    padding: '30px 30px',

    '&:disabled':{
      backgroundColor:'#11C8C5',
      color:'white',
      opacity:'0.5'
    },
    '&:hover': {
      backgroundColor: '#76D4AA',
      boxShadow: '0 0 50px white',
      color: 'black'
    }
  },
  mintArea: {
    color: 'white',
    position: 'absolute', left: '50%', top: '20%',
    transform: 'translate(-50%, -50%)',
    fontSize: '60px',
    textAlign: 'center',
  },
  price: {
    fontSize: '25px',
    marginTop:'20px',
    fontFamily:'Courier New',
    justifyContent: "center",
    color: '#000',
    fontWeight: 'bold'
  },
  price1:{
    fontSize: '50px',
    color:'white',
    // display: "flex",
    position:'absolute',
    margin:'0 auto',
    top:'50%',
    left:'50%',
    transform:'translate(-50%,-400%)',
    fontFamily:'Lato',
    alignSelf:'center',
  
  },
  howManyRemaining:{
    fontSize:'25px',
    fontFamily:'Lato'
  },
  homeButton: {
    borderRadius: 3,
    background: 'linear-gradient(to right, #E7E9BB, #403B4A)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 45,
    width: 150,
    padding: '5px 5px',
    position: 'absolute', left: '10%', top: '10%',
    transform: 'translate(-50%, -50%)',
  }
}));

export default Home;

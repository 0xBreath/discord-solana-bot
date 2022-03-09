
import { programs } from '@metaplex/js';
const { Metadata } = programs.metadata;
import fetch from "node-fetch"
import {Connection, PublicKey} from '@solana/web3.js'
import base58 from 'bs58'
import {
    SERVER_PORT,
    USER_ROUTE,
    LOGIN_ROUTE,
    MAINNET_URL,
    DEVNET_URL,
    CREATOR,
    TOKEN_PROGRAM_ID
} from './constants'

const connection = new Connection(
    MAINNET_URL
);

// API fetch request for testing => replaced by POST/GET
export const makeUser = async (id: any, wallet: any) => {   
    const route = USER_ROUTE + `/${wallet}`;
    console.log('route: ', route)  

    const user = {
        wallet: wallet,
        discord: id,
        signed: 0
    }
  
    // POST user
    await fetch(route, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
        body: JSON.stringify(user)
    })

    // based on React app server/DNS
    const login = LOGIN_ROUTE + '/' + wallet;
    console.log('login: ', login)  
    
    return login
}

/*
    Put this function as middleware on server
    request:
    /users/:wallet/catch
*/
export const capture = async (wallet: string) => {
    console.log('capture wallet => ', wallet)

    const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, 
        {
            filters: [{
                dataSize: 165, // number of bytes
            },
            {
                memcmp: {
                    offset: 32, // number of bytes
                    bytes: wallet, // base58 encoded string
                },
            }],
        }
    );

    let mint: any;
    let validMints = [];
    let num = 0;

    for (let i = 0; i < accounts.length; i++) {
        let account = accounts[i].account;
        // @ts-ignore
        let balance = account.data["parsed"]["info"]["tokenAmount"]["amount"];

        // mint is an NFT
        if (balance == 1) {
            // @ts-ignore
            mint = account.data["parsed"]["info"]["mint"];

            const metadataKey = await Metadata.getPDA(new PublicKey(mint));
            const metadata = await Metadata.load(connection, metadataKey);
            const creator = metadata.data.data.creators[0].address;

            if (creator == CREATOR) {
                console.log('creator => ', creator)

                const data = await (await fetch(metadata.data.data.uri, {method: "Get"})).json()
                const symbol = data.symbol

                // verify on server...
                if (symbol == "FSG") {
                    num += 1;

                    console.log('Stargarden => ', metadata.data.data.name)
                    validMints.push(metadata.data.data.name)
                }
            }
        }
    }
    if (mint) {
        console.log(`Found ${num} Stargarden(s) for wallet: ${wallet}`)
        return validMints;
    }
    else {
        console.log(`No Stargardens found for wallet: ${wallet}`)
        return null;
    }
}
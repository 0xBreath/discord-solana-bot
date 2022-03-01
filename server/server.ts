// server dependencies
import express, { Router } from 'express'
import logger from 'morgan'
import db from './models'
import cors from 'cors'
//import * as users from './routes/users'

// discord dependencies
import { programs } from '@metaplex/js';
const { Metadata } = programs.metadata;
import {web3} from "@project-serum/anchor"
import base58 from 'bs58'
import fetch from "node-fetch"
import { Client, Intents } from 'discord.js'
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
import * as config from './config.json'
const port = config.postgres.port

const connection = new web3.Connection(
    "https://withered-delicate-bird.solana-mainnet.quiknode.pro/59cfd581e09e0c25b375a642f91a4db010cf27f6/"
    //'https://api.devnet.solana.com'
);

const ASSOCIATED_TOKEN_PROGRAM_ID = new web3.PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
  
const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
  
const TOKEN_PROGRAM_ID = new web3.PublicKey(
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);


/* ====================== EXPRESS ============================ */

// configure express
const app = express();
app.use(express.json())
app.use(cors())
app.options('/users', cors)
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev')); // log within console

// handle all default routes
app.get('/', (req: any, res: any) => {
    res.status(200).send({
        message: `Welcome to http://localhost:${port}`,
    })
})

// sync all models with database
db.sequelize.sync({ force: true }).then(() => {
    console.log("# Drop and re-sync database");
});

import UserRoutes from './routes/users'
UserRoutes(app);
app.listen(port, () =>
    console.log(`Server listening at http://localhost:${port}`)
);


/* ======================== DISCORD ============================ */

// listen for bot login
client.on("ready", () => {
    // @ts-ignore
    console.log(`Logged in as ${client.user.tag}!`)
})

// API fetch request for testing => replaced by POST/GET
const makeUser = async (id: any, wallet: any) => {   
    const route = `http://localhost:${port}/users/${wallet}`

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
    const login = `http://localhost:3000/users/${wallet}`

    // return URL to discord
    console.log('route: ', route)  
    console.log('login: ', login)  
    
    return login
}

const getAssets = async (user: string) => {
    const wallet = user
    console.log('wallet => ', wallet)

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

    let mint;
    let balance;
    let i = 0;
    let validMints: any = [];

    /*
    accounts.forEach(async (
        account: any
    ) => {
        balance = account.account.data["parsed"]["info"]["tokenAmount"]["amount"];
        if (balance >= 1) {
            i += 1;
            mint = account.account.data["parsed"]["info"]["mint"];
            //const data = await connection.getParsedAccountInfo(new web3.PublicKey(mint));
            //console.log('data => ', data.value.data)
            const metadataKey = await Metadata.getPDA(new web3.PublicKey(mint));
            const metadata = await Metadata.load(connection, metadataKey);
            //console.log('METADATA => ', metadata)
            const updateAuth = metadata.data.updateAuthority;
            //console.log('updateAuth => ', updateAuth)

            if (updateAuth == "DREwcQaLUrAA7byEtJ8e4gXfez4nzxgdhzhHpsT7gWZH") {
                validMints.push(metadata.data)
            }
        }
    });
    */

    for (let i = 0; i < accounts.length; i++) {
        let account = accounts[i].account;

        balance = account.data["parsed"]["info"]["tokenAmount"]["amount"];
        if (balance >= 1) {
            i += 1;
            mint = account.data["parsed"]["info"]["mint"];
            //const data = await connection.getParsedAccountInfo(new web3.PublicKey(mint));
            //console.log('data => ', data.value.data)
            const metadataKey = await Metadata.getPDA(new web3.PublicKey(mint));
            const metadata = await Metadata.load(connection, metadataKey);
            //console.log('METADATA => ', metadata)
            const updateAuth = metadata.data.updateAuthority;
            //console.log('updateAuth => ', updateAuth)

            if (updateAuth == "DREwcQaLUrAA7byEtJ8e4gXfez4nzxgdhzhHpsT7gWZH") {
                validMints.push(metadata.data)
            }
        }
    }
    if (validMints.length > 0) {
        console.log(`Found ${i} token account(s) for wallet: ${wallet}`)
        return validMints;
    }
    else {
        console.log(`No mints found for wallet: ${wallet}`)
        return null;
    }
}


  
// discord bot listens for command 'connect-wallet'
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    if (interaction.commandName === 'connect-wallet') {
        const discord = interaction.user.id
        const wallet = interaction.options.data[0].value
        console.log('discord = ', discord)
        console.log('wallet = ', wallet)
        const url = await makeUser(discord, wallet) 

        if (url) {
            // reply to user in server
            await interaction.reply({ 
                content: `${interaction.user} Follow this link to register a Solana wallet: ${url}`, 
                ephemeral: true 
            });
        }
        else {
            console.log('Failed to return link.')
        }
    }
});//end of interaction

// discord bot listens for command 'connect-wallet'
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    if (interaction.commandName === 'my-assets') {
        const discord = interaction.user.id

        console.log('MY ASSETS')
        
        const route = `http://localhost:${port}/users/discord/${discord}`
        const user = await (await fetch(route, {method: "Get"})).json()

        // call getAssets
        const data = await getAssets(user.wallet);
        console.log('DATA => ', data)
        /*
            TODO
            * get real assets from team
            * read game metadata (aurah)
            * read image
            * display top NFT as: image w/ metadata below
        */

        if (user) {
            // reply to user in server
            await interaction.reply({ 
                content: `${interaction.user} Here are your game assets:`, 
                ephemeral: true 
            });
        }
        else {
            console.log('Failed to return User from Discord ID.')
        }
    }
});//end of interaction


// Login to Discord with client's token
const token = config.discord.token
client.login(token);

export default app;
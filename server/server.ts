// server dependencies
import express, { Router } from 'express'
import logger from 'morgan'
import db from './models'
import cors from 'cors'
//import * as users from './routes/users'

// discord dependencies
import {makeUser, capture} from './helpers/functions'
import fetch from "node-fetch"
import { Client, Intents } from 'discord.js'
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
import * as config from './config.json'
import {
    USER_ROUTE,
    SERVER_PORT
} from './helpers/constants'

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
        message: `Welcome to ${USER_ROUTE}`,
    })
})

// sync all models with database
db.sequelize.sync({ force: true }).then(() => {
    console.log("# Drop and re-sync database");
});

import UserRoutes from './routes/users'
UserRoutes(app);
app.listen(SERVER_PORT, () =>
    console.log(`Server listening at ${USER_ROUTE}`)
);


/* ======================== DISCORD ============================ */

// listen for bot login
client.on("ready", () => {
    // @ts-ignore
    console.log(`Logged in as ${client.user.tag}!`)
})
  
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
  
    if (interaction.commandName === 'catch') {
        const discord = interaction.user.id
        
        const route = `http://localhost:${SERVER_PORT}/users/discord/${discord}`
        const user = await (await fetch(route, {method: "Get"})).json()

        // call getAssets
        const assets = await capture(user.wallet);
        console.log('assets => ', assets)

        try {
            if (user && assets) {
                // reply to user in server
                await interaction.reply({ 
                    content: `${interaction.user} Here are your game assets: ` + JSON.stringify(assets),
                    ephemeral: true 
                });
            }
        } catch {
            console.log('Failed to return User from Discord ID.')
        }
    }
});//end of interaction


// Login to Discord with client's token
const token = config.discord.token
client.login(token);

export default app;
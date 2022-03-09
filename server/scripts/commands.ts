import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import * as config from '../config.json'
const token = config.discord.token
const clientId = config.discord.clientId
const guildId = config.discord.guildId

const rest = new REST({ version: '9' }).setToken(token);

const commands = [
    {
        name: 'connect-wallet',
        description: 'Register a Solana wallet to your discord ID for the minigame.',
        options: [{
            "name": 'wallet',
            "description": 'Solana wallet address used in the minigame.',
            "type": 3,
            "required": true,
        }]
    },
    {
        name: 'catch',
        description: 'Attempt to catch an elusive Aurahma!',
    }
]; 

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
 
 
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
    
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );   
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

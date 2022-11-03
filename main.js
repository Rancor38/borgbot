const {Client, Events, GatewayIntentBits, Application} = require('discord.js')
require('dotenv').config()

const PORT = process.env.PORT || 3030;

const prefix = 'm'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
});

client.once(Events.ClientReady, () => {
    console.log('Ready!')
})

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return
    
    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()

    if (command === 'test') {
        message.channel.send('Bot is working!')
    }
    else if (command == 'ork') {
        message.channel.send('borg')
    }
})


client.login(process.env.token)
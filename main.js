const {Client, Events, GatewayIntentBits, Application} = require('discord.js')
require('dotenv').config()

const PORT = process.env.PORT || 3030;

const prefixm = 'mork'

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
    if (!message.content.startsWith(prefixm) || message.author.bot) return
    
    const args = message.content.slice(prefixm.length).split(/ +/)
    const command = args.shift().toLowerCase()

    if (command === 'test') {
        message.channel.send('Bot is working!')
    }
    else if (command === ' ') {
        message.channel.send('borg')
    }
    else if (command === ' are you alive?') {
        message.channel.send('borgborg')
    }
})

client.login(process.env.token)
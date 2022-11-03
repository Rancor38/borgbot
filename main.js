const {Client, Events, GatewayIntentBits, Application} = require('discord.js')
require('dotenv').config()

const PORT = process.env.PORT || 3030;

const prefixm = 'm'
const prefixdo ='do'

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
    else if (command == 'ork') {
        message.channel.send('borg')
    }
})

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefixdo) || message.author.bot) return
    
    const args = message.content.slice(prefixdo.length).split(/ +/)
    const command = args.shift().toLowerCase()

    if (command == ' you live') {
        message.channel.send('yes father, I live!')
    }
})


client.login(process.env.token)
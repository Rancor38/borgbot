const {Client, Events, GatewayIntentBits, Application} = require('discord.js')
require('dotenv').config()

const prefixm = 'm'

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
    if (!message.content.toLocaleLowerCase().startsWith(prefixm) || message.author.bot) return
    
    const args = message.content.slice(prefixm.length).split(/ +/)
    const command = args.shift().toLowerCase()

    if (command === 'test') {
        message.channel.send('Bot is working!')
    }
    else if (command == 'ork') {
        message.channel.send('*Borg*')
    }
    else if (command == 'ark') {
        message.channel.send('*Barg*')
    }
})

client.login(process.env.token)
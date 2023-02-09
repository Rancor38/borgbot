const {Client, Events, GatewayIntentBits, Application} = require('discord.js')
require('dotenv').config()

const mork = 'mork'

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
    // console.log(message.content.toLocaleLowerCase().split(" "))
    if (message.author.bot) return
    
    // const args = message.content.slice(prefixm.length).split(/ +/)
    // console.log(args)
    // const command = args.shift().toLowerCase()

    if (message.content.toLocaleLowerCase().split(" ").includes('mark')) {
        message.channel.send('*barg*')
    }
    if (message.content.toLocaleLowerCase().split(" ").includes(mork)) {
        message.channel.send('*borg*')
    }
})

client.login(process.env.token)
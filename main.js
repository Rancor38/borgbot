const { Client, Events, GatewayIntentBits, Application } = require('discord.js')
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config()
const fetch = require("node-fetch");
const apiController = require('./controllers/apiController');
const { response } = require('express');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use("/api/generate", apiController )

const commands = ['borgbot', 'borgbot,', 'mork', 'mark', 'zak']

function includeWords(str, arr) {
    const words = str.toLowerCase().split(/[^\w]+/); // split the string into lowercase words
    for (let i = 0; i < arr.length; i++) { // loop over the array of words
      if (words.includes(arr[i].toLowerCase())) { // check if the word is included in the string
        return true; // if found, return true
      }
    }
    return false; // if not found, return false
}
  
function removeBorgbot(str) {
    const arr = str.split('borgbot');
    if (arr[arr.length - 1] === '') {
      // If the last element is an empty string, remove it
      arr.pop();
    }
    return arr.join('borgbot');
  }
  

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
    //if the bot wrote the message, ignore
    if (message.author.bot) {
        return
    }
    //if the messages doesn't include a command, ignore
    if (!includeWords(message.content, commands)) {
        return
    }
    
    const args = message.content
    // console.log(args + " is args")
    const command = args.toLowerCase()

    if (command.includes("test")) {
        message.channel.send('Bot is working!')
    }
    else if (command.includes('mork')) {
        message.channel.send('*borg*')
    }
    else if (command.includes('mark')) {
        message.channel.send('*barg*')
    }
    else if (command.includes('zak')) {
        message.channel.send('*balg*')
    }
    else if (command === 'borgbot' || 'borgbot,') {
        // console.log("borghit " + args)
            const PROMPT = "Respond to the following prompt using only a randomly selected series of words from the following array (the response can repeat words from the array multiple times) array: [mork, mork, mork, mork, mork, Mork, mork Mork, MORK, borg, borg, borg, borg, borg, Barg, BARG, balg]. Prompt: " + removeBorgbot(args)
            // console.log(PROMPT + " is PROMPT");
            const raw = JSON.stringify({
                model: "text-davinci-003",
                prompt: PROMPT,
                temperature: 0.5,
                max_tokens: 15,
                n: 3,
            });
        
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: raw,
                redirect: "follow",
            };
        
            try {
                fetch("https://api.openai.com/v1/completions", requestOptions)
                  .then((response) => response.json())
                  .then((json) => {
                    message.channel.send(     
                              json.choices[0].text
                      )
                  });
              } catch (error) {
                console.error(error);
              }
    }
})

client.login(process.env.token)
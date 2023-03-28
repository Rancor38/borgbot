const {
    Client,
    Events,
    GatewayIntentBits,
    Application,
} = require("discord.js");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const fetch = require("node-fetch");
const { includeWords, removeBorgbot } = require("./lib/functions");
const {
    convertToGold,
} = require("./applications/pigCoinApp")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const commands = ["borgbot", "borgbot,", "mork", "mark", "zak", "pigcoins", 'bottest'];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once(Events.ClientReady, () => {
    console.log("Borgbot is ready, firing on all cylinders, Brrrrrrrr!");
});

client.on("messageCreate", (message) => {
    //if the bot wrote the message, ignore
    if (message.author.bot) {
        return;
    }
    //if the messages doesn't include a command, ignore
    if (!includeWords(message.content, commands)) {
        return;
    }

    const args = message.content;
    // console.log(args + " is args")
    const command = args.toLowerCase();

    if (command.includes("bottest")) {
        message.channel.send("Bot is working!");
    } else if (command.includes("mork")) {
        message.channel.send("*borg*");
    } else if (command.includes("mark")) {
        message.channel.send("*barg*");
    } else if (command.includes("zak")) {
        message.channel.send("*balg*");
    } else if (command.includes("pigcoins")) {
        const quantity = message.content.split(' ')[1]
        if (Number(quantity) > 0) {
            message.channel.send(convertToGold(quantity))
        }
        // console.log(quantity)
    } else if (command.includes("borgbot")) {
        // console.log("borghit " + args + " We got the regex")
        const PROMPT =
            "Respond to the following prompt using only a randomly selected series of words from the following array (the response can repeat words from the array multiple times) array: [mork, mork, mork, mork, mork, Mork, mork Mork, MORK, borg, borg, borg, borg, borg, Barg, BARG, balg]. Prompt: " +
            removeBorgbot(args);
        // console.log(PROMPT + " is PROMPT");
        const raw = JSON.stringify({
            model: "text-davinci-003",
            prompt: PROMPT,
            temperature: 0.5,
            max_tokens: 20,
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
                    message.channel.send(json.choices[0].text);
                });
        } catch (error) {
            console.error(error);
        }
    }
});

client.login(process.env.token);

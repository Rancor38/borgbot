const { Client, Events, GatewayIntentBits, Application } = require("discord.js")
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
require("dotenv").config()
const fetch = require("node-fetch")
const {
        includeWords,
        removeBorgbot,
        State,
        setPrompt,
} = require("./lib/functions")
const { convertToGold } = require("./applications/pigCoinApp")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//setting a list of valid commands
const commands = [
        "borgbot",
        "borgbot,",
        "mork",
        "mark",
        "zak",
        "pigcoins",
        "bottest",
]

const resetPrompt = "Respond to the following prompt using only a randomly selected series of words from the following array (the response can repeat words from the array multiple times, must use complete words, and can end in an exclaimation point) array: [mork, mork, mork, mork, mork, Mork, mork Mork, MORK, borg, borg, borg, borg, borg, Barg, BARG, balg]"

//setting an initial prompt
setPrompt(
        "prompt",
        resetPrompt
)

const client = new Client({
        intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
        ],
})

client.once(Events.ClientReady, () => {
        console.log("Borgbot is ready, firing on all cylinders, Brrrrrrrr!")
})

client.on("messageCreate", (message) => {
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

        if (command.includes("bottest")) {
                message.channel.send("Bot is working!")
        }
        if (command.includes("mork")) {
                message.channel.send("*borg*")
        }
        if (command.includes("mark")) {
                message.channel.send("*barg*")
        }
        if (command.includes("zak")) {
                message.channel.send("*balg*")
        }
        if (command.includes("pigcoins")) {
                const quantity = message.content.split(" ")[1]
                if (Number(quantity) > 0) {
                        message.channel.send(convertToGold(quantity))
                }
                // console.log(quantity)
        }
        if (command.includes("borgbot")) {
                if (args.includes("love you")) {
                        message.channel.send("I love you too, borg!")
                } else if (args.includes("--overdrive")) {
                        message.channel.send("**BORG BORG!!!! BORG BORG BARG!!! BORG BORG BORGBARG BARG BARG BARG!!!! BORG BORG BORG!!!! BORG BORG BORG BARG BARG BARG!!! BORG BORG BORG  BARG BARG!!!! BORG BORG BORG!! BORG BORG!!!! BORG BORG BARG!!! BORG BORG BORG BARG BORG!!!!  BARG BALG BARG BARG!!!! BORG BORG BORG!! BORG BORG!!!! BORG BORG !! BORG BORG BORG BARG! BARG BARG BARG BARG!! !! BORG BORG BARG!!! BORG BORG BORGBARG BARG BARG BARG!!!! BORG BORG BORG!!!! BORG BORG BORG BARG BARG BARG!!! BORG BORG BORG  BARG BARG!!!! BORG BORG BORG!! BORG BORG!! !! BORG BORG BARG!!! BORG BORG BORGBARG BARG BARG BARG!!!! BORG BORG BORG!!!! BORG BORG BORG BARG BARG BARG!!! BORG BORG BORG  BARG BARG!!!! BORG BORG BORG!! BORG BORG!!!! BORG BORG BARG!!! BORG BORG BORG BARG BORG!!!!  BARG BALG BARG BARG!!!! BORG BORG BORG!! BORG BORG!!!! BORG BORG !! BORG BORG BORG BARG! BARG BARG BARG BARG!! !! BORG BORG BARG!!! BORG BORG BORGBARG BARG BARG BARG!!!! BORG BORG BORG!!!! BORG BORG BORG BARG BARG BARG!!! BORG BORG BORG  BARG BARG!!!! BORG BORG BORG!! BORG BORG!!!! BORG BORG BARG!!! BORG BORG BORG BARG BORG!!!!  BARG BALG BARG BARG!!!! BORG BORG BORG!! BORG BORG!!!! BORG BORG !! BORG BORG BORG BARG! BARG BARG BARG BARG!!!! BORG BORG BORG!!! BORG BORG BORG!!! BORG BORG BARG!!! BORG BORG BORG BARG BORG!!!!  BARG BALG BARG BARG!!!! BORG BORG BORG!! BORG BORG!!!! BORG BORG !! BORG BORG BORG BARG! BARG BARG BARG BARG!!!! BORG BORG BORG!!! BORG BORG BORG!!** borg.")
                } else {
                        //if you use the override keyword, the prompt is set to equal the user's message with borgbot removed.
                        if (args.includes("--override")) {
                                setPrompt("prompt", removeBorgbot(args))
                        }
                        // console.log(args)
                        // console.log(State.prompt + " is PROMPT")
                        const raw = JSON.stringify({
                                model: "text-davinci-003",
                                prompt: State.prompt,
                                temperature: 0.5,
                                max_tokens: 50,
                                n: 3,
                        })

                        const requestOptions = {
                                method: "POST",
                                headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                                },
                                body: raw,
                                redirect: "follow",
                        }

                        try {
                                fetch(
                                        "https://api.openai.com/v1/completions",
                                        requestOptions
                                )
                                        .then((response) => response.json())
                                        .then((json) => {
                                                message.channel.send(
                                                        json.choices[0].text
                                                )
                                        })
                        } catch (error) {
                                console.error(error)
                        }
                        setPrompt("prompt", resetPrompt)
                }
        }
})

client.login(process.env.token)

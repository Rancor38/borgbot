const { Client, Events, GatewayIntentBits } = require("discord.js")
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
require("dotenv").config()
const fs = require('fs')
const fetch = require("node-fetch")
const { food, overdrive, help, reset, validCommands } = require("./data/index")
const {
        includeWords,
        removeBorgbot,
        State,
        setPrompt,
        selectRandomElement
} = require("./lib/functions")
const { convertToGold } = require("./applications/pigCoinApp")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//setting a list of valid commands
const commands = validCommands.commands

//food state
const foodData = food

const resetPrompt = reset.prompt

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
        }
        if (command.includes("addfood")) {
                const words = message.content.split(" ")
                const rest = words.slice(1)
                const newFood = rest.join(" ")
                if (String(newFood)) {
                        message.channel.send(`adding ${newFood}...`)
                        foodData.food.push(newFood)
                        
                }
                fs.writeFile(`./data/foodData.json`, JSON.stringify(foodData), (err) => {
                        if (err) throw err;
                        message.channel.send('Food added! mork.')
                })
        }
        if (command.includes("removefood")) {
                const words = message.content.split(" ")
                const rest = words.slice(1)
                const remFood = rest.join(" ")
                if (String(remFood)) {
                        message.channel.send(`removing ${remFood}...`)
                        foodData.food = foodData.food.filter(e => e !== remFood)
                }
                fs.writeFile(`./data/foodData.json`, JSON.stringify(foodData), (err) => {
                        if (err) throw err;
                        message.channel.send('Food removed! borg.')
                })
        }
        if (command.includes("showfood")) {
                if (foodData.food.length > 0) {
                        message.channel.send(foodData.food.toString().replace(/,/g, ', '))
                } else {
                        message.channel.send("There is no food, boss, but you could add some with 'addfood'")
                }
        }
        if (command.includes("borgbot")) {
                if (args.includes("love you")) {
                        message.channel.send("I love you too, borg!")
                } else if (args.includes("--overdrive")) {
                        message.channel.send(overdrive.message)
                } else if (args.includes("--sayfood")) {  //the food function for borgbot --food
                        const randomFood = selectRandomElement(foodData.food)
                        message.channel.send(randomFood.toString())
                } else if (args.includes("--help")) { //the help function to list current commands
                        message.channel.send(help.message)
                } 
                else {
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

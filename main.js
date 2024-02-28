const { Client, Events, GatewayIntentBits } = require("discord.js")
require("dotenv").config()
const fs = require("fs")
const {
        foodData,
        overdrive,
        help,
        reset,
        validCommands,
} = require("./data/index")
const {
        includeWords,
        removeBorgbot,
        State,
        setPrompt,
        selectRandomElement,
        getOpenAIResponse,
} = require("./lib/index")

const { convertToGold } = require("./applications/pigCoinApp")

//setting a list of valid commands
const commands = validCommands.commands

//setting a value to the initial prompt/reset prompt
const resetPrompt = reset.prompt

//setting an initial prompt
setPrompt("prompt", resetPrompt)

const client = new Client({
        intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
        ],
})

client.once(Events.ClientReady, () => {
        console.log(
                "Borgbot is ready for Discord, firing on all cylinders, Brrrrrrrr!"
        )
})

client.on("messageCreate", async (message) => {
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
        if (command.includes("chloe")) {
                message.channel.send("*bake*")
        }
        if (command.includes("hopper")) {
                message.channel.send("*You're still here?*")
        }
        if (command.includes("kat")) {
                message.channel.send("*prrrrrrrrrr* ♥")
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
                fs.writeFile(
                        `./data/foodData.json`,
                        JSON.stringify(foodData),
                        (err) => {
                                if (err) throw err
                                message.channel.send("Food added! mork.")
                        }
                )
        }
        if (command.includes("removefood")) {
                const words = message.content.split(" ")
                const rest = words.slice(1)
                const remFood = rest.join(" ")
                if (String(remFood)) {
                        message.channel.send(`removing ${remFood}...`)
                        foodData.food = foodData.food.filter(
                                (e) => e !== remFood
                        )
                }
                fs.writeFile(
                        `./data/foodData.json`,
                        JSON.stringify(foodData),
                        (err) => {
                                if (err) throw err
                                message.channel.send("Food removed! borg.")
                        }
                )
        }
        if (command.includes("showfood")) {
                if (foodData.food.length > 0) {
                        message.channel.send(
                                foodData.food.toString().replace(/,/g, ", ")
                        )
                } else {
                        message.channel.send(
                                "There is no food, boss, but you could add some with 'addfood'"
                        )
                }
        }
        if (command.includes("borgbot")) {
                if (args.includes("love you")) {
                        message.channel.send("I love you too, borg!")
                } else if (args.includes("--overdrive")) {
                        message.channel.send(overdrive.message)
                } else if (args.includes("--sayfood")) {
                        //the food function for borgbot --food
                        const randomFood = selectRandomElement(foodData.food)
                        message.channel.send(randomFood.toString())
                } else if (args.includes("--help")) {
                        //the help function to list current commands
                        message.channel.send(help.message)
                } else {
                        //if you use the override keyword, the prompt is set to equal the user's message with borgbot removed.
                        if (args.includes("--override")) {
                                setPrompt("prompt", removeBorgbot(args))
                        }
                        getOpenAIResponse(State.prompt, message.content)
                                .then((response) => {
                                        message.channel.send(response) // Sending the OpenAI response back as a Discord message
                                })
                                .catch((error) => {
                                        console.error(error) // Handle errors here
                                        message.channel.send(
                                                "Internal Server Error, I'm borked."
                                        ) // Sending an error message back
                                })
                }
                setPrompt("prompt", resetPrompt)
        }
})

client.login(process.env.token)

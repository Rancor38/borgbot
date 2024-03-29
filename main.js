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
	State,
	setPrompt,
	selectRandomElement,
	getOpenAIResponse,
	soundOfAnguish,
	manageFile,
	appendToSummary
} = require("./lib/index")

const { convertToGold } = require("./applications/pigCoinApp")
const { openAIContext } = require("./lib/openAIContext")
console.log(openAIContext())

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
		"Borgbot is ready for Discord, firing on all cylinders, Brrrrrrrrr!"
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
	if (command.includes("egg")) {
		message.channel.send("🥚")
	}
	if (command.includes("fire")) {
		message.channel.send("🔥🔥🔥")
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
		manageFile(
			"write",
			`./data/foodData.json`,
			JSON.stringify(foodData),
			() => {
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
			foodData.food = foodData.food.filter((e) => e !== remFood)
		}
		manageFile(
			"write",
			`./data/foodData.json`,
			JSON.stringify(foodData),
			() => {
				message.channel.send("Food removed! borg.")
			}
		)
	}
	if (command.includes("showfood")) {
		if (foodData.food.length > 0) {
			message.channel.send(foodData.food.toString().replace(/,/g, ", "))
		} else {
			message.channel.send(
				"There is no food, boss, but you could add some with 'addfood'"
			)
		}
	}
	if (command.includes("borgbot")) {
		if (Math.random() <= 0.05) {
			manageFile("write", `./data/override.txt`, "true", () => {
				const spark = "***sparks mysteriously***"
				message.channel.send(spark)
				message.channel.send(selectRandomElement(soundOfAnguish()))
				setPrompt("prompt", openAIContext() + args)
			})
		}
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
		} else if (args.includes("--throwwrench")) {
			manageFile("delete", `./data/override.txt`, null, () => {
				message.channel.send(
					"***sparks aggressively*** \n *morkin'... down...*"
				)
				setPrompt("prompt", resetPrompt)
			})
		} else {
			// If you use the override keyword, the prompt is set to equal the user's message with openAIContext
			if (args.includes("--override")) {
				// Create a file to keep track of the override
				// Write to override.txt
				manageFile("write", `./data/override.txt`, "true", () => {
					// After writing to override.txt, check if it exists
					manageFile(
						"look",
						"./data/override.txt",
						null,
						(exists) => {
							if (exists) {
								// If override.txt exists, modify the prompt
								setPrompt("prompt", openAIContext() + args)

								// Execute the getOpenAIResponse function
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
							} else {
								// Handle the case where override.txt doesn't exist
								// Execute the getOpenAIResponse function
								getOpenAIResponse(resetPrompt, message.content)
									.then((response) => {
										message.channel.send(response) // Sending the OpenAI response back as a Discord message
									})
									.catch((error) => {
										console.error(error) // Handle errors here
										message.channel.send(
											"Internal Server Error, I'm borked."
										) // Sending an error message back
									})
								// You might want to set some default behavior here
							}
						}
					)
				})

				// Check if the random number is less than or equal to 0.33 (33%)
				manageFile("look", `./data/override.txt`, null, (exists) => {
					if (exists && Math.random() <= 0.15) {
						manageFile("delete", `./data/override.txt`, () => {
							message.channel.send(
								"***sparks aggressively*** \n *morkin'... down...*"
							)
							console.log("Override file deleted successfully!")
							setPrompt("prompt", resetPrompt)
						})
					}
				})

			// Append the message content to summary.txt
			appendToSummary(message.content);
			} else {
				manageFile("look", "./data/override.txt", null, (exists) => {
					if (exists) {
						// If override.txt exists, modify the prompt
						setPrompt("prompt", openAIContext() + args)

						// Execute the getOpenAIResponse function
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
						// Append the message content to summary.txt
    appendToSummary(message.content);
					} else {
						// Handle the case where override.txt doesn't exist
						// Execute the getOpenAIResponse function
						getOpenAIResponse(resetPrompt, message.content)
							.then((response) => {
								message.channel.send(response) // Sending the OpenAI response back as a Discord message
							})
							.catch((error) => {
								console.error(error) // Handle errors here
								message.channel.send(
									"Internal Server Error, I'm borked."
								) // Sending an error message back
							})
						// You might want to set some default behavior here
					}
				})
			}
		}
	}
})

client.on("messageReactionAdd", async (reaction, user) => {
	// Ignore if the reaction is from a bot
	if (user.bot) return;

	// Fetch the emoji object
	const emoji = reaction.emoji;

	// Send a message acknowledging the reaction
	reaction.message.channel.send(`Thank you for the ${emoji.name}!`);
});


client.login(process.env.token)

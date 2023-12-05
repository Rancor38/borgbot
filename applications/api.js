const express = require("express")
const { foodData, overdrive, help, reset, validCommands } = require("../data")
const router = express.Router()
const fs = require("fs")
const fetch = require("node-fetch")
const {
        includeWords,
        setPrompt,
        State,
        removeBorgbot,
        selectRandomElement,
} = require("../lib/functions")

/*NOTES TO FUTURE DEV, repetitious code for handling commands here in need of a refactor, however, for now the message is the title of the response object ot make it look symantically similar to the server.js, but note that the word "channel" is removed from message.channel.send, and replaced with message.send (and eventually message.json)*/

//setting a list of valid commands
const commands = validCommands.commands

//setting a value to the initial prompt/reset prompt
const resetPrompt = reset.prompt

//setting an initial prompt
setPrompt("prompt", resetPrompt)

router.get("/", (req, res) => {
        res.send("api is working")
})

router.post("/", async (req, message) => {
        const args = req.body.message
        const command = args.toLowerCase()
        if (includeWords(req.body.message, commands)) {


                if (command.includes("mork")) {
                        message.send("borg")
                }
                if (command.includes("mark")) {
                        message.send("barg")
                }
                if (command.includes("zak")) {
                        message.send("balg")
                }
                if (command.includes("pigcoins")) {
                        const quantity = command.split(" ")[1]
                        if (Number(quantity) > 0) {
                                message.send(convertToGold(quantity))
                        }
                }
                if (command.includes("addfood")) {
                        const words = command.split(" ")
                        const rest = words.slice(1)
                        const newFood = rest.join(" ")
                        if (String(newFood)) {
                                message.send(`adding ${newFood}...`)
                                foodData.food.push(newFood)
                        }
                        fs.writeFile(
                                `../data/foodData.json`,
                                JSON.stringify(foodData),
                                (err) => {
                                        if (err) throw err
                                        message.send(
                                                "Food added! mork."
                                        )
                                }
                        )
                }
                if (command.includes("removefood")) {
                        const words = command.split(" ")
                        const rest = words.slice(1)
                        const remFood = rest.join(" ")
                        if (String(remFood)) {
                                message.send(`removing ${remFood}...`)
                                foodData.food = foodData.food.filter(
                                        (e) => e !== remFood
                                )
                        }
                        fs.writeFile(
                                `../data/foodData.json
                                `,
                                JSON.stringify(foodData),
                                (err) => {
                                        if (err) throw err
                                        message.send(
                                                "Food removed! borg."
                                        )
                                }
                        )
                }
                if (command.includes("showfood")) {
                        if (foodData.food.length > 0) {
                                message.send(
                                        foodData.food
                                                .toString()
                                                .replace(/,/g, ", ")
                                )
                        } else {
                                message.send(
                                        "There is no food, boss, but you could add some with 'addfood'"
                                )
                        }
                }
        } else {
                if (args.includes("love you")) {
                        message.send("I love you too, borg!")
                        return
                } else if (args.includes("--overdrive")) {
                        message.send(overdrive.message)
                        return
                } else if (args.includes("--sayfood")) {
                        //the food function for borgbot --food
                        const randomFood = selectRandomElement(
                                foodData.food
                        )
                        message.send(randomFood.toString())
                        return
                } else if (args.includes("--help")) {
                        //the help function to list current commands
                        message.send(help.message)
                        return
                } 
                //if you use the override keyword, the prompt is set to equal the user's message with borgbot removed.
                else if (args.includes("--override")) {
                        setPrompt("prompt", removeBorgbot(args))
                }
                // console.log(args)
                // console.log(State.prompt + " is PROMPT")
                const raw = JSON.stringify({
                        model: "gpt-3.5-turbo-instruct",
                        prompt: State.prompt,
                        temperature: 0.5,
                        max_tokens: 50,
                        n: 3,
                })

                const requestOptions = {
                        method: "POST",
                        headers: {
                                "Content-Type":
                                        "application/json",
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
                                .then((response) =>
                                        response.json()
                                )
                                .then((json) => {
                                        message.send(
                                                json.choices[0]
                                                        .text
                                        )
                                })
                } catch (error) {
                        console.error(error)
                }
                setPrompt("prompt", resetPrompt)
        }
})

module.exports = router

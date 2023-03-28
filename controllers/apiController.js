const express = require("express");
const router = express.Router()

router.post("/", (req, res) => {
    const PROMPT = "Respond the following using only a random series of words from the following array [mork, Mork, MORK, borg, Barg, BARG]: " + req.body.prompt;
    console.log(PROMPT);
    const raw = JSON.stringify({
        model: "text-davinci-003",
        prompt: PROMPT,
        temperature: 0.5,
        max_tokens: 150,
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
            res.status(200).json(json.choices[0].text);
            console.log(res.json());
          });
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
      }
      
});

module.exports = router
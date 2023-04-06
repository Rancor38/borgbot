const express = require('express')
const { validCommands } = require('../data')
const router = express.Router()

router.get('/', async (req, res) => {
    res.send("Hello, bot")
})

module.exports = router
const { includeWords } = require("./includeWords")
const { removeBorgbot } = require("./removeBorgbot")
const { State, setPrompt, setFood } = require("./State")
const { selectRandomElement } = require("./selectRandomElement")
const { getOpenAIResponse } = require("./getOpenAIResponse")
const { makeCounter } = require("./makeCounter")
const { removeStringFromArray } = require("./removeStringFromArray")
const { soundOfAnguish } = require("./soundOfAnguish")
const { manageFile } = require("./manageFile")
const { appendToSummary, fetchTextFile } = require("./appendToSummary")

module.exports = {
        includeWords,
        removeBorgbot,
        State,
        setPrompt,
        setFood,
        makeCounter,
        removeStringFromArray,
        selectRandomElement,
  getOpenAIResponse,
  manageFile,
      soundOfAnguish,
      appendToSummary,
      fetchTextFile
}

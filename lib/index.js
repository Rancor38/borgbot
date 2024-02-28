const {includeWords} = require("./includeWords")
const {removeBorgbot} = require("./removeBorgbot")
const { State, setPrompt, setFood } = require("./State")
const { selectRandomElement } = require("./selectRandomElement")
const { getOpenAIResponse } = require("./getOpenAIResponse")
const { makeCounter } = require("./makeCounter")
const { removeStringFromArray } = require("./removeStringFromArray")


module.exports = {
  includeWords,
  removeBorgbot,
  State,
  setPrompt,
  setFood,
  makeCounter,
  removeStringFromArray,
  selectRandomElement,
  getOpenAIResponse
}
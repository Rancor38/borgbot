function includeWords(str, arr) {
        const words = str.toLowerCase().split(/[^\w]+/) // split the string into lowercase words
        for (let i = 0; i < arr.length; i++) {
                // loop over the array of words
                if (words.includes(arr[i].toLowerCase())) {
                        // check if the word is included in the string
                        return true // if found, return true
                }
        }
        return false // if not found, return false
}

function removeBorgbot(str) {
        const arr = str.split("borgbot")
        if (arr[arr.length - 1] === "") {
                // If the last element is an empty string, remove it
                arr.pop()
        }
        return arr.join("borgbot")
}

// initialize global State object
const State = {}

function setPrompt(key, value) {
        // use data as key and set value in State object
        State[key] = value
}
function setFood(key, value) {
        // use data as key and set value in State object
        State[key] = value
}

function makeCounter() {
        let count = 0;
        
        return function() {
          count++;
          return count;
        }
}
      
function removeStringFromArray(arr, str) {
        const index = arr.indexOf(str);
        if (index !== -1) {
          arr.splice(index, 1);
        }
        return arr;
}  
      
function selectRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

module.exports = {
        includeWords,
        removeBorgbot,
        State,
        setPrompt,
        setFood,
        makeCounter,
        removeStringFromArray,
        selectRandomElement
}

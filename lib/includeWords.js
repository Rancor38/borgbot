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

module.exports = {includeWords}
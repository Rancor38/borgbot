function removeBorgbot(str) {
  const arr = str.split("borgbot")
  if (arr[arr.length - 1] === "") {
          // If the last element is an empty string, remove it
          arr.pop()
  }
  return arr.join("borgbot")
}

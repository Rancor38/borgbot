function removeStringFromArray(arr, str) {
  const index = arr.indexOf(str);
  if (index !== -1) {
    arr.splice(index, 1);
  }
  return arr;
}  

module.exports = {removeStringFromArray}



const pigCoinSeparator = (totalPigCoins) => {
    const money = {
        gold: 0,
        silver: 0,
        copper: 0,
    }
    let randomNumber = Math.floor(Math.random() * totalPigCoins);
    if (totalPigCoins > randomNumber) {
        money.gold = totalPigCoins - randomNumber;
    } else {
        money.gold = randomNumber - totalPigCoins;
    }
    let secondRandomNumber = Math.floor(Math.random() * randomNumber);
    if (randomNumber > secondRandomNumber) {
        money.silver = randomNumber - secondRandomNumber;
        money.copper = secondRandomNumber;
    } else {
        money.silver = secondRandomNumber - randomNumber;
        money.copper = randomNumber;
    }
    return(money)
}

const convertToGold = (numberofPigCoins) => {
    const money = pigCoinSeparator(numberofPigCoins);
    
    let holdValue = money.copper;
    money.copper = money.copper % 10;
    holdValue = (holdValue - money.copper) / 10;
    money.silver += holdValue;
    // console.log(`copper is ${money.copper} and holdValue is ${holdValue} silver is ${money.silver}`)
    
    holdValue = money.silver;
    money.silver = money.silver % 10;
    holdValue = (holdValue - money.silver) / 10;
    money.gold += holdValue;
    // console.log(`silver is ${money.silver} and holdValue is ${holdValue} gold is ${money.gold}`)
    
    // console.log(`Gold: ${money.gold}\nSilver: ${money.silver}\nCopper: ${money.copper}`)
    return `Your pigcoins returned you: ${money.gold} gp, ${money.silver} sp, ${money.copper} cp`
    silverValue.innerText = money.silver;
    copperValue.innerText = money.copper;
}


module.exports = {
pigCoinSeparator,
convertToGold
}
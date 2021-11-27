function blackjack() {
	async function playerAce() {
		playerCard = 1;

		if (playerCard == 1) {
			betcheck = false;
			hitcheck = true;
			standCheck = true;
			gameSpace.innerHTML = `<p>YOU GOT AN ACE. PLEASE SELECT A VALUE </p>`;
			gameInfo.innerHTML = `<p>Please Select a Valid Value for the Ace. Valid Values are 1 or 11</p> <input type="number" id="aceText" placeholder="Please Enter Ace Value"> <br/> <br/> <button class="btn btn-primary" id="aceButton">ACE VALUE</button> <br/> <br/> `;
			const aceText = document.getElementById("aceText"),
				aceButton = document.getElementById("aceButton");
			aceText.value = ``;
			console.log(aceText);
			playerPromise = new Promise(() => {
				aceButton.addEventListener("click", askPlayerAce);
			});
			await playerPromise;
		} else {
			standCheck = false;
			betcheck = true;
			console.log(`Card No Ace= ${card}`);
		}
		function askPlayerAce() {
			let aceValue = parseInt(aceText.value);
			console.log(`The Ace Value is: ${aceValue}`);
			if (aceValue == 11) {
				singleAceCheck = true;
				aceCheck = true;
				gameInfo.innerHTML = ``;
				gameSpace.innerHTML = `<p> <strong> YOUR CARD IS AN 11.</strong> Please press the HIT ME button to give you a card. Press the STAND button to 'stand'. Press the QUIT button to quit.</p>`;
				standCheck = false;
				betcheck = true;
				playerCard = 11;
			}
			if (aceValue == 1) {
				gameInfo.innerHTML = ``;
				gameSpace.innerHTML = `<p> <strong> YOUR CARD IS AN 1.</strong> Please press the HIT ME button to give you a card. Press the STAND button to 'stand'. Press the QUIT button to quit.</p>`;
				standCheck = false;
				betcheck = true;
				playerCard = 1;
			}
		}
	}

	/* This function  selects a random card from the 8 decks in the array cardsDecks and deletes the one selected*/
	function randomCard() {
		let i = Math.floor(Math.random() * cardsDecks.length);
		card = cardsDecks[i];
		if (i != 0 && i != cardsDecks.length) {
			cardsDecks = cardsDecks
				.slice(0, i)
				.concat(cardsDecks.slice(i + 1, cardsDecks.length));
		} else if (i == 0) {
			cardsDecks = cardsDecks.slice(1, cardsDecks.length);
		} else {
			cardsDecks = cardsDecks.slice(0, cardsDecks.length - 1);
		}
		return card;
	}
	function sumDealer() {
		let cardsSum = 0;
		for (card of dealerCards) {
			cardsSum += card;
		}
		return cardsSum;
	}
	function checkDealerFirstAce() {
		if (dealerCards[0] == 1) {
			dealerCards[0] = 11;
			dealerAces.push(0);
		}
	}
	function dealerCard() {
		dealerCards.push(randomCard());
		sumDealerCards = sumDealer();
		if (
			(dealerCards[dealerCards.length - 1] == 1 &&
				sumDealerCards + 11 < 17) ||
			(dealerCards[dealerCards.length - 1] == 1 &&
				sumDealerCards + 11 >= sumPlayer &&
				sumDealerCards + 11 < 21)
		) {
			dealerCards[dealerCards.length - 1] = 11;
			sumDealerCards = sumDealer();
			dealerAces.push(dealerCards.length - 1);
		}

		/* If the Dealer busts but has an Ace as an 11, then it changes it to a 1*/
		while (
			sumDealerCards > 17 &&
			(sumDealerCards < sumPlayer || sumDealerCards > 21) &&
			dealerAces.length > 0
		) {
			dealerCards[dealerAces[dealerAces.length - 1]] = 1;
			dealerAces.pop();
			sumDealerCards = sumDealer();
		}
		return dealerCards;
	}

	/* This function checks if the user entered a valid number for the Ace and checks until a valid number is written */
	/*function ace(value) {
		while (!(value == 1 || value == 11)) {
			value = parseInt(
				//gameInfo.innerHTML=
				prompt(
					"Please choose a valid value for the Ace. Valid values are 1 or 11"
				)
			);
		}
		if (value == 11) {
			aceCheck = true;
		}
		return value;
	}*/
	function betContinue() {
		console.log(`Player's First Card is: ${playerCard}`);
		dealerCards.push(randomCard());
		checkDealerFirstAce();
		dealerCards.push(randomCard());
		sumPlayer = playerCard;
		sumDealerCards = sumDealer();
		gameSpace.innerHTML = `Your first card is ${sumPlayer}. Dealer's First card is ${dealerCards[0]}. Your bet is $${betAmount}. Press the HIT ME button to get another card or press the STAND button to stand.`;
	}

	async function init() {
		gameInfo.innerHTML = ``;
		if (money > 0 && hitcheck == false) {
			totalMoney.innerHTML = `<p>Your Total Money is: $${money}</p>`;
			dealerAces = [];
			dealerCards = [];
			aceCheck = false;
			cardsDecks = newDecks;
			console.log(cardsDecks);
			quit = true;
			betAmount = parseFloat(betText.value);
			if (betAmount <= money && betAmount > 0) {
				betcheck = true;
				standCheck = false;
				hitcheck = true;
				playerAce();
				console.log(`
				Player Card is: ${playerCard}`);
				await playerPromise.then(betContinue());
			} else {
				gameSpace.innerHTML = `<p>Your Bet isn't correct. Please choose a number between 0 and ${money} </p>`;
			}
		} else if (money == 0) {
			gameSpace.innerHTML = `<p>Your Total Money is: $${money}. YOU LOSE. PLEASE PRESS RESET TO TRY AGAIN.</p>`;
			hitcheck = false;
			standCheck = true;
		} else if (hitcheck == true) {
			gameSpace.innerHTML = `<p>You have already made your bet. Please press the HIT ME button or the STAND Button. Press RESET to start again or QUIT to exit.</p> <p>Your Card is ${playerCard}. You Have ${sumPlayer}. Dealer's First Card is ${dealerCards[0]}. Your bet is $${betAmount}.</p> `;
		}
	}
	async function hitMe() {
		//The program asks for a card and then checks if the player has an Ace, and asks for a valid value of 1 or 11
		gameInfo.innerHTML = ``;
		if (betcheck == true) {
			hitcheck = true;
			await playerPromise.then(hitMeContinue());
		} else {
			gameSpace.innerHTML = `<p>You first need to place a bet in the Bet field and then press the BET button.</p>`;
		}
	}
	function hitMeContinue() {
		sumPlayer = sumPlayer + playerCard;
		console.log(cardsDecks);

		gameSpace.innerHTML = `<p>Your Card is ${playerCard}. You Have ${sumPlayer}. Dealer's First Card is ${dealerCards[0]}. Your bet is $${betAmount}. Please press the HIT ME button to give you a card. Press the STAND button to 'stand'. Press the QUIT button to quit.</p>`;
		// If the player's sum of cards is higher than 21 and he/she doesn't have an Ace value of 11, then he/she looses
		if (sumPlayer > 21 && aceCheck == false) {
			money -= betAmount;
			gameSpace.innerHTML = `<p> YOU LOSE THIS TIME :(. You got ${sumPlayer} and the Dealer got ${sumDealerCards}. Dealer's Cards were ${dealerCards}. You LOSE $${betAmount}. Now your total amount of money is $${money}</p>`;
			totalMoney.innerHTML = `<p>Your Total Money is: $${money}</p>`;
			hitcheck = false;
			standCheck = true;
			betcheck = false;
		}
		//If the player's sum of cards is higher than 21 and he/she has an Ace with a value of 11, the program changes the Ace for a 1 by substracting 10 to the player's sum of cards
		else if (sumPlayer > 21 && aceCheck == true) {
			let prevSum;
			prevSum = sumPlayer;
			sumPlayer = sumPlayer - 10;

			gameInfo.innerHTML = `<p>You 'Bust' with ${prevSum}. You change your Ace from an 11 to a 1. Your new number is ${sumPlayer}</p>`;
			gameSpace.innerHTML = `<p>Your Card is ${playerCard}. You Have ${sumPlayer}. Dealer's First Card is ${dealerCards[0]}. Your bet is $${betAmount}. Please press the HIT ME button to give you a card. Press the STAND button to 'stand'. Press the QUIT button to quit.</p>`;
			aceCheck = false;
			//If the player's sum of cards is higher than 21, then he/she looses
			if (sumPlayer > 21) {
				money -= betAmount;
				gameInfo = ``;
				gameSpace.innerHTML = `<p>YOU LOSE THIS TIME :(. You got ${sumPlayer} and the Dealer got ${sumDealerCards}. Dealer's Cards were ${dealerCards}. You LOSE $${betAmount}. Now your total amount of money is $${money}</p>`;
				totalMoney.innerHTML = `<p>Your Total Money is: $${money}</p>`;
				hitcheck = false;
				standCheck = true;
				betcheck = false;
			} else {
			}
		}
	}
	/*When the user "stands"*/
	function stand() {
		gameInfo.innerHTML = ``;
		if (standCheck == false) {
			hitcheck = false;
			betcheck = false;
			if (dealerCards[1] == 1 && dealerAces.length < 1) {
				dealerCards[1] = 11;
				dealerAces.push(1);
				sumDealerCards = sumDealer();
				console.log(dealerAces);
				console.log(dealerCards);
				console.log(dealerAces.length - 1);
			} else {
				sumDealerCards = sumDealer();
			}

			// If the dealer busts (gets more than 21) or the player sum of the cards is lower than 21 but it's higher than the Dealer's, then the player wins
			//PREGUNTA Es necesario colocar tantos you win, you lose? Existe alguna forma mas elegante o correcta de hacerlo?

			/*IA where the dealer MUST draw cards until a value of 17 and then stands*/
			while (sumDealerCards < 17 && sumDealerCards < sumPlayer) {
				dealerCard();
			}
			if (sumDealerCards > 21 || sumPlayer > sumDealerCards) {
				money += betAmount;
				gameSpace.innerHTML = `<p> CONGRATULATIONS!!!!! YOU WIN!!!!!. You got ${sumPlayer} and the Dealer got ${sumDealerCards}. Dealer's Cards were ${dealerCards}. You WIN $${betAmount}. Now your total amount of money is $${money} </p>`;
				totalMoney.innerHTML = `Your Total Money is: $${money}`;
				hitcheck = false;
				standCheck = true;
				betcheck = false;
			}
			// else, the player looses
			else {
				money -= betAmount;
				gameSpace.innerHTML = `<p>YOU LOSE THIS TIME :(. You got ${sumPlayer} and the Dealer got ${sumDealerCards}. Dealer's Cards were ${dealerCards}. You LOSE $${betAmount}. Now your total amount of money is $${money} </p>`;
				totalMoney.innerHTML = `Your Total Money is: $${money}`;
				hitcheck = false;
				standCheck = true;
				betcheck = false;
			}
		} else {
			gameSpace.innerHTML = `<p> Please Press the BET button to start again. Press the QUIT button to save your Higscore and reset. Press RESET to reset your money.</p>`;
		}
	}

	function quitFinal() {
		hitcheck = false;
		standCheck = true;
		betcheck = false;
		totalMoney.innerHTML = `<p> Your final money is $${money}. You started with $${initialMoney}. Thanks for playing :D. Have a nice day </p>`;
		if (isNaN(parseFloat(localStorage.getItem(`score`))) === true) {
			localStorage.setItem(`score`, money);
			totalMoney.innerHTML = `<p> Your final money is $${money}. You started with $${initialMoney}. CONGRATULATIONS. YOU HAVE A NEW HIGHSCORE OF $${money}. Thanks for playing :D. Have a nice day </p>`;
		} else if (parseFloat(localStorage.getItem(`score`)) < money) {
			localStorage.setItem(`score`, money);
			totalMoney.innerHTML = `<p> Your final money is $${money}. You started with $${initialMoney}. CONGRATULATIONS. YOU HAVE A NEW HIGHSCORE OF $${money}. Thanks for playing :D. Have a nice day </p>`;
		} else {
			totalMoney.innerHTML = `<p> Your final money is $${money}. You started with $${initialMoney}. Thanks for playing :D. Have a nice day </p>`;
		}
		money = 10000;
		gameSpace.innerHTML = `<p> You Start Again with $${money} to spend </p>`;
	}
	function rules() {
		if (rulesText.innerHTML == ``) {
			rulesText.innerHTML = `<p> Welcome to a game of simplified blackjack, where you can't split or double down. You play with 8 decks. </p> <p> The objective of the game is to get closer to 21 than the dealer. To do so, first place a bet in the Bet field and press the BET button. Afterwards, press the HIT ME button until you are close enough to 21, and then press the STAND button so the Dealer starts playing. Press the RESET button to start again and press the QUIT button to save your highscore and start again.</p>`;
		} else {
			rulesText.innerHTML = ``;
		}
	}
	function reset() {
		hitcheck = false;
		standCheck = true;
		betcheck = false;
		money = initialMoney;
		totalMoney.innerHTML = `<p> Your Total Money is: $${initialMoney} </p>`;
	}
	/* Start of Script*/
	const totalMoney = document.getElementById("totalMoney"),
		betText = document.getElementById("betText"),
		betButton = document.getElementById("betButton"),
		quitButton = document.getElementById("quitButton"),
		resetButton = document.getElementById("resetButton"),
		rulesButton = document.getElementById("rulesButton"),
		rulesText = document.getElementById("rulesText"),
		hitmeButton = document.getElementById("hitmeButton"),
		standButton = document.getElementById("standButton"),
		gameSpace = document.getElementById("gameSpace"),
		gameInfo = document.getElementById("gameInfo"),
		initialMoney = 10000,
		newDecks = [
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8,
			9, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3,
			4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10,
			10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6,
			7, 8, 9, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1,
			2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9,
			10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3,
			4, 5, 6, 7, 8, 9, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10,
			10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7,
			8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1,
			2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
			10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4,
			5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10,
			10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7,
			8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1,
			2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9,
			10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 1, 2, 3, 4,
			5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10,
			10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6,
			7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 1,
			2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9,
			10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3,
			4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10,
			10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7,
			8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
		];
	let hitcheck = false,
		standCheck = true,
		betcheck = false,
		playerPromise,
		dealerAces = [],
		dealerCards = [],
		//playerCards = [], Esta variable son las cartas del jugador que tengo pensado implementar para la 3er entrega.
		playerCard,
		sumPlayer = 0,
		//aceValue,
		aceCheck = false,
		card,
		betAmount = 0,
		money = initialMoney,
		sumDealerCards,
		cardsDecks = newDecks;
	betButton.addEventListener("click", init);
	quitButton.addEventListener("click", quitFinal);
	resetButton.addEventListener("click", reset);
	rulesButton.addEventListener("click", rules);
	hitmeButton.addEventListener("click", hitMe);
	standButton.addEventListener("click", stand);
	betText.value = "";
	rulesText.innerHTML = ``;
	gameInfo.innerHTML = ``;
	totalMoney.innerHTML = `<p>Your Total Money is: $${money}</p>`;
	gameSpace.innerHTML = `<p> The objective of the game is to get closer to 21 than the dealer. To do so, first place a bet in the Bet field and press the BET button. Afterwards, press the HIT ME button until you are close enough to 21, and then press the STAND button so the Dealer starts playing. Press the RESET button to start again and press the QUIT button to save your highscore and start again.</p>`;
}
blackjack();

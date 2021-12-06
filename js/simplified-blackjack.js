//Main Function
function blackjack(_cardsImages) {
	//This Function selects a card from the deck and returns the number. It also saves the object in the variable card.
	function randomCard() {
		let i = Math.floor(Math.random() * cardsDecks.length - 1);
		cardNumber = parseInt(cardsDecks[i].number);
		card = cardsDecks[i];
		if (i != 0) {
			cardsDecks = cardsDecks
				.slice(0, i)
				.concat(cardsDecks.slice(i + 1, cardsDecks.length));
		} else {
			cardsDecks = cardsDecks.slice(1, cardsDecks.length);
		}
		return cardNumber;
	}
	function checkBlackjack(cards) {
		if (
			cards.length == 2 &&
			(cards.includes(11) || cards.includes(1)) &&
			cards.includes(10)
		) {
			return true;
		} else {
			return false;
		}
	}
	//This function checks if the player has an Ace
	function playerAce(currentCard, callback) {
		if (currentCard == 1) {
			betcheck = false;
			hitcheck = true;
			standCheck = true;
			gameSpace.innerHTML = `<p>YOU GOT AN ACE. PLEASE SELECT A VALUE </p>`;
			gameInfo.innerHTML = `<p>Please Select a Valid Value for the Ace. Valid Values are 1 or 11</p> <input type="number" id="aceText" placeholder="Please Enter Ace Value"> <br/> <br/> <button class="btn btn-primary" id="aceButton">ACE VALUE</button> <br/> <br/> `;
			const aceText = document.getElementById("aceText"),
				aceButton = document.getElementById("aceButton");
			aceText.value = ``;
			console.log(aceText);
			aceButton.addEventListener("click", askPlayerAce);
		} else {
			standCheck = false;
			betcheck = true;
			console.log(`Card No Ace= ${currentCard}`);
			callback(currentCard);
		}
		//This function checks the value the player entered in the input when the aceButton is clicked
		function askPlayerAce() {
			let aceValue = parseInt(aceText.value);

			console.log(`The Ace Value is: ${aceValue}`);
			if (aceValue == 11) {
				gameInfo.innerHTML = ``;
				gameSpace.innerHTML = `<p> <strong> YOUR CARD IS AN 11.</strong> Please press the HIT ME button to give you a card. Press the STAND button to 'stand'. Press the QUIT button to quit.</p>`;
				standCheck = false;
				betcheck = true;
				callback(11);
			} else if (aceValue == 1) {
				gameInfo.innerHTML = ``;
				gameSpace.innerHTML = `<p> <strong> YOUR CARD IS AN 1.</strong> Please press the HIT ME button to give you a card. Press the STAND button to 'stand'. Press the QUIT button to quit.</p>`;
				standCheck = false;
				betcheck = true;
				callback(1);
			} else {
				gameSpace.innerHTML = `<p>PLEASE SELECT A VALID VALUE FOR THE ACE. VALID VALUES ARE 1 OR 11. </p>`;
			}
		}
	}
	//This function starts the game when you click the BET button
	function init() {
		gameInfo.innerHTML = ``;
		if (money > 0 && hitcheck == false) {
			totalMoney.innerHTML = `<p>Your Total Money is: $${money}</p>`;
			blackjack = false;
			playerCardsDiv.html(``);
			dealerCardsDiv.html(``);
			dealerAces = [];
			dealerCards = [];
			playerCards = [];
			playerAces = [];
			playerObjects = [];
			dealerObjects = [];
			cardsDecks = cardsObject;
			console.log(cardsDecks);
			quit = true;
			betAmount = parseFloat(betText.value);
			if (betAmount <= money && betAmount > 0) {
				betcheck = true;
				standCheck = false;
				hitcheck = true;
				playerAce(randomCard(), betContinue);
				console.log(`
				Player Card is: ${playerCard}`);
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
	//first init checks the dealerAce function and then there is a callback to this function. This gives a card to the player and checks if an Ace has a value of 11, and push it in the playerAces variable. It also gives two cards to the dealer, checks if the dealer's first card is an Ace and manages the first images in the game.
	function betContinue(currentCard) {
		playerCards.push(currentCard);
		playerObjects.push(card);
		console.log(playerObjects);
		playerCardsDiv
			.append(
				`<img src="${
					playerObjects[playerObjects.length - 1].url
				}" alt="${playerObjects[playerObjects.length - 1].id}"></img>`
			)
			.hide()
			.delay(300)
			.fadeIn(700);
		if (currentCard == 11) {
			playerAces.push(playerCards.length - 1);
		}
		console.log(playerAces);
		dealerCards.push(randomCard());
		dealerObjects.push(card);
		dealerCardsDiv
			.append(
				`<img src="${
					dealerObjects[dealerObjects.length - 1].url
				}" alt="${dealerObjects[dealerObjects.length - 1].id}"></img>
				<img src="${cardsDecks[cardsDecks.length - 1].url}" alt="${
					cardsDecks[cardsDecks.length - 1].id
				}"></img>`
			)
			.hide()
			.delay(300)
			.fadeIn(700);
		checkDealerFirstAce();
		dealerCards.push(randomCard());
		dealerObjects.push(card);
		console.log(dealerObjects);
		sumPlayer = playerCards[0];
		sumDealerCards = sumDealer();
		gameSpace.innerHTML = `Your first card is ${sumPlayer}. Dealer's First card is ${dealerCards[0]}. Your bet is $${betAmount}. Press the HIT ME button to get another card or press the STAND button to stand.`;
	}
	//This function sums the dealer's card numbers
	function sumPlayerCards(playerCards) {
		let cardsSum = 0;
		for (cardNumber of playerCards) {
			cardsSum += cardNumber;
		}
		return cardsSum;
	}
	//This function iterates on the objects inside the dealerObjects (cards objects), apend the images and hides them
	function hideDealerCards() {
		dealerCardsDiv.html(``);
		for (objects of dealerObjects) {
			dealerCardsDiv
				.append(`<img src="${objects.url}" alt="${objects.id}"></img>`)
				.hide();
		}
	}
	//The function asks for a card and then checks if the player has an Ace, and asks for a valid value of 1 or 11
	function hitMe() {
		gameInfo.innerHTML = ``;
		if (betcheck == true) {
			hitcheck = true;
			playerAce(randomCard(), hitMeContinue);
		} else {
			gameSpace.innerHTML = `<p>You first need to place a bet in the Bet field and then press the BET button.</p>`;
		}
	}
	//Callback of the playerAce function. Checks if the player and the dealer got blackjack. shows the player cards. Checks if the player loses.
	function hitMeContinue(currentCard) {
		playerCards.push(currentCard);
		playerObjects.push(card);
		console.log(playerObjects);
		playerCardsDiv
			.append(
				`<img src="${
					playerObjects[playerObjects.length - 1].url
				}" alt="${playerObjects[playerObjects.length - 1].id}"></img>`
			)
			.hide()
			.fadeIn(700);
		blackjack = checkBlackjack(playerCards);
		if (blackjack == true) {
			sumPlayer = sumPlayerCards(playerCards);
			stand();
		} else {
			if (currentCard == 11) {
				playerAces.push(playerCards.length - 1);
			}
			sumPlayer = sumPlayerCards(playerCards);
			console.log(playerCards);
			gameSpace.innerHTML = `<p>Your Cards are ${playerCards}. You Have ${sumPlayer}. Dealer's First Card is ${dealerCards[0]}. Your bet is $${betAmount}. Please press the HIT ME button to give you a card. Press the STAND button to 'stand'. Press the QUIT button to quit.</p>`;
			// If the player's sum of cards is higher than 21 and he/she doesn't have an Ace value of 11, then he/she looses
			if (sumPlayer > 21 && playerAces.length < 1) {
				money -= betAmount;
				hideDealerCards();
				dealerCardsDiv.delay(300).fadeIn(300);
				gameSpace.innerHTML = `<p> YOU LOSE THIS TIME :(. You got ${sumPlayer} and the Dealer got ${sumDealerCards}. Dealer's Cards were ${dealerCards}. You LOSE $${betAmount}. Now your total amount of money is $${money}</p>`;
				totalMoney.innerHTML = `<p>Your Total Money is: $${money}</p>`;
				hitcheck = false;
				standCheck = true;
				betcheck = false;
			}
			//If the player's sum of cards is higher than 21 and he/she has an Ace with a value of 11, the program changes the Ace for a 1 by substracting 10 to the player's sum of cards
			else if (sumPlayer > 21 && playerAces.length >= 1) {
				let prevSum;
				prevSum = sumPlayer;
				playerCards[playerAces[playerAces.length - 1]] = 1;
				playerAces.pop();
				sumPlayer = sumPlayerCards(playerCards);
				$("#gameInfo")
					.css({
						display: "none",
					})
					.html(
						`<p>You 'Bust' with ${prevSum}. You change your Ace from an 11 to a 1. Your new number is ${sumPlayer}</p>`
					)
					.fadeIn(800)
					.delay(6000)
					.fadeOut(1200);
				gameSpace.innerHTML = `<p>Your Cards are ${playerCards}. You Have ${sumPlayer}. Dealer's First Card is ${dealerCards[0]}. Your bet is $${betAmount}. Please press the HIT ME button to give you a card. Press the STAND button to 'stand'. Press the QUIT button to quit.</p>`;

				//If the player's sum of cards is higher than 21, then he/she looses
				if (sumPlayer > 21) {
					money -= betAmount;
					gameInfo = ``;
					dealerCardsDiv.delay(300).fadeIn(300);
					gameSpace.innerHTML = `<p>YOU LOSE THIS TIME :(. You got ${sumPlayer} and the Dealer got ${sumDealerCards}. Dealer's Cards were ${dealerCards}. You LOSE $${betAmount}. Now your total amount of money is $${money}</p>`;
					totalMoney.innerHTML = `<p>Your Total Money is: $${money}</p>`;
					hitcheck = false;
					standCheck = true;
					betcheck = false;
				} else {
				}
			}
		}
	}
	//sums the dealer's cards.
	function sumDealer() {
		let cardsSum = 0;
		for (cardNumber of dealerCards) {
			cardsSum += cardNumber;
		}
		return cardsSum;
	}
	//checks if the dealer's first card is an Ace.
	function checkDealerFirstAce() {
		if (dealerCards[0] == 1) {
			dealerCards[0] = 11;
			dealerAces.push(0);
		}
	}
	//gives card to the Dealer, saves the images, append the images in the dealerCardsDiv and hides them.
	function dealerCard() {
		dealerCards.push(randomCard());
		dealerObjects.push(card);
		dealerCardsDiv
			.append(
				`<img src="${
					dealerObjects[dealerObjects.length - 1].url
				}" alt="${dealerObjects[dealerObjects.length - 1].id}"></img>`
			)
			.hide();
		console.log(dealerObjects);
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

	/*When the user "stands"*/
	function stand() {
		gameInfo.innerHTML = ``;
		if (standCheck == false) {
			standCheck = true;
			hitcheck = false;
			betcheck = false;
			console.log(
				dealerCards.length == 2 &&
					(dealerCards.includes(11) || dealerCards.includes(1)) &&
					dealerCards.includes(10)
			);
			console.log(`Dealer Cards Are:${dealerCards}`);
			if (blackjack == true) {
				blackjack = checkBlackjack(dealerCards);
				if (blackjack == false) {
					const blackjackWinings = 1.5 * betAmount;
					money += blackjackWinings;
					hideDealerCards();
					dealerCardsDiv.delay(300).fadeIn(300);
					gameSpace.innerHTML = `<p> CONGRATULATIONS YOU GOT BLACKJACK AND THE DEALER DIDN'T!!!!! YOU WIN!!!!!.  Dealer's Cards were ${dealerCards}. Your cards were ${playerCards}. You got ${sumPlayer} and the Dealer got ${sumDealerCards}. Dealer's Cards were ${dealerCards}. You WIN $${blackjackWinings}. Now your total amount of money is $${money} </p>`;
					totalMoney.innerHTML = `Your Total Money is: $${money}`;
				} else {
					hideDealerCards();
					dealerCardsDiv.delay(300).fadeIn(300);
					gameSpace.innerHTML = `<p> Both YOU and the DEALER got <strong>BLACKJACK</strong>. You don't lose any money. Your total amount of money continue being $${money} </p>`;
					totalMoney.innerHTML = `Your Total Money is: $${money}`;
				}
			} else {
				blackjack = checkBlackjack(dealerCards);
				if (blackjack == true) {
					money -= betAmount;
					hideDealerCards();
					dealerCardsDiv.delay(300).fadeIn(300);
					gameSpace.innerHTML = `<p> YOU LOSE THIS TIME :( . The Dealer got <strong> BLACKJACK </strong>. Dealer's Cards were ${dealerCards}. Your cards were ${playerCards}. You got ${sumPlayer} and the Dealer got ${sumDealerCards}. You LOSE $${betAmount}. Now your total amount of money is $${money} </p>`;
					totalMoney.innerHTML = `Your Total Money is: $${money}`;
				} else {
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
						hideDealerCards();
						dealerCardsDiv.delay(300).fadeIn(300);
						gameSpace.innerHTML = `<p> CONGRATULATIONS!!!!! YOU WIN!!!!!. You got ${sumPlayer} and the Dealer got ${sumDealerCards}. Dealer's Cards were ${dealerCards}. You WIN $${betAmount}. Now your total amount of money is $${money} </p>`;
						totalMoney.innerHTML = `Your Total Money is: $${money}`;
					}
					// else, the player looses
					else {
						money -= betAmount;
						hideDealerCards();
						dealerCardsDiv.delay(300).fadeIn(300);
						gameSpace.innerHTML = `<p>YOU LOSE THIS TIME :(. You got ${sumPlayer} and the Dealer got ${sumDealerCards}. Dealer's Cards were ${dealerCards}. You LOSE $${betAmount}. Now your total amount of money is $${money} </p>`;
						totalMoney.innerHTML = `Your Total Money is: $${money}`;
					}
				}
			}
		} else {
			gameSpace.innerHTML = `<p> Please Press the BET button to start again. Press the QUIT button to save your Higscore and reset. Press RESET to reset your money.</p>`;
		}
	}
	//When the player reset the game
	function reset() {
		hitcheck = false;
		standCheck = true;
		betcheck = false;
		money = initialMoney;
		playerCardsDiv.fadeOut(400);
		dealerCardsDiv.fadeOut(400);
		totalMoney.innerHTML = `<p> Your Total Money is: $${initialMoney} </p>`;
		gameSpace.innerHTML = `<p> You Start Again with $${money} to spend </p>`;
	}
	//when the player quits, it saves it's highscore (if any)
	function quitFinal() {
		hitcheck = false;
		standCheck = true;
		betcheck = false;
		playerCardsDiv.fadeOut(400);
		dealerCardsDiv.fadeOut(400);
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
	//Shows the rules when the RULES button is pressed.
	function rules() {
		$("#rulesText").slideToggle();
	}

	/* Start of Script*/
	const totalMoney = $("#totalMoney")[0],
		betText = $("#betText")[0],
		gameSpace = $("#gameSpace")[0],
		gameInfo = $("#gameInfo")[0],
		playerCardsDiv = $(`#playerCardsDiv`),
		dealerCardsDiv = $("#dealerCardsDiv"),
		initialMoney = 10000,
		cardsObject = _cardsImages;
	let hitcheck = false,
		standCheck = true,
		betcheck = false,
		dealerCards = [],
		dealerAces = [],
		playerCards = [],
		playerAces = [],
		playerCard,
		sumPlayer = 0,
		blackjack,
		card,
		cardNumber,
		betAmount = 0,
		money = initialMoney,
		sumDealerCards,
		playerObjects = [],
		dealerObjects = [],
		cardsDecks = cardsObject;
	$(`#betButton`).click(init);
	$(`#quitButton`).click(quitFinal);
	$(`#resetButton`).click(reset);
	$(`#rulesButton`).click(rules);
	$(`#hitmeButton`).click(hitMe);
	$(`#standButton`).click(stand);
	$("#rulesText")
		.css({
			display: "none",
		})
		.html(
			`<p> Welcome to a game of simplified blackjack, where you can't split or double down. You play with 8 decks. </p> <p> The objective of the game is to get closer to 21 than the dealer. If you win the house pays 1:1. If you get an ACE and a 10 as your first 2 cards, you win 1.5*Bet. If both you and the dealer gets blackjack you don't lose any money. If the dealer gets blackjack and you don't, you lose your bet. To do so, first place a bet in the Bet field and press the BET button. Afterwards, press the HIT ME button until you are close enough to 21, and then press the STAND button so the Dealer starts playing. Press the RESET button to start again and press the QUIT button to save your highscore and start again.</p>`
		);
	betText.value = "";
	gameInfo.innerHTML = ``;
	totalMoney.innerHTML = `<p>Your Total Money is: $${money}</p>`;
	gameSpace.innerHTML = `<p> The objective of the game is to get closer to 21 than the dealer. To do so, first place a bet in the Bet field and press the BET button. Afterwards, press the HIT ME button until you are close enough to 21, and then press the STAND button so the Dealer starts playing. Press the RESET button to start again and press the QUIT button to save your highscore and start again.</p>`;
	console.log(cardsDecks);
}
//First I need to get the data from the .json file and then call blackjack
$.ajax({
	type: "GET",
	url: "json/cardsImages.json",
	dataType: "json",
	success: function (response) {
		blackjack(response);
		console.log("Data Retrieved");
	},
	error: function () {
		console.log("Error loading Cards Images");
	},
});

let deck;
let playerHand = [];
let selectedCards = [];
let replaceButton;
let submitButton;
let submittedHand = [];
let discardCount = 10;
let resultText = "";
let scoreButton;
let scoreCounter = 0;
let scoreboard = false;
let scoreBoard;
let scoreBoardText;

function setup() {
    createCanvas(600, 400);
    deck = new Deck();
    deck.shuffle();
    dealCards();

    // Create the replace button
    replaceButton = createButton("Replace Selected Cards");
    replaceButton.position(10, 10);
    replaceButton.mousePressed(replaceSelectedCards);

    // Create the submit button
    submitButton = createButton("Submit Hand");
    submitButton.position(10, 40);
    submitButton.mousePressed(submitHand);

    // Create the scoreboard button
    scoreButton = createButton("Scoreboard");
    scoreButton.position(400, 10);
    scoreButton.mousePressed(toggleScoreboard);
}

function dealCards() {
    for (let i = 0; i < 7; i++) {
        playerHand.push(deck.deal());
    }
}

function mouseClicked() {
    const cardWidth = 100;
    const cardHeight = 150;
    const spacing = -30;
    const startX = (width - (playerHand.length * cardWidth + (playerHand.length - 1) * spacing)) / 2;
    const startY = height / 2 - cardHeight / 2;

    // Loop through the cards in reverse order (from top to bottom)
    for (let i = playerHand.length - 1; i >= 0; i--) {
        const card = playerHand[i];
        const xOffset = startX + i * (cardWidth + spacing);
        const yOffset = startY;

        // Check if the mouse click is within the boundaries of the card
        if (mouseX >= xOffset && mouseX <= xOffset + cardWidth &&
            mouseY >= yOffset && mouseY <= yOffset + cardHeight) {
            card.selected = !card.selected; // Toggle card selection
            return; // Return immediately after selecting the topmost card
        }
    }
}

function draw() {
    background(0);
    strokeWeight(4);
    stroke(255);

    fill(100);
    textSize(20);
    text("Discard Count: " + discardCount, 10, 70);

    // Display the evaluated hand result on the screen
    textSize(24);
    fill(100);
    textAlign(CENTER, CENTER);
    text(resultText, width / 2, height - 50);

    // Display the score on the screen
    textSize(24);
    fill(100);
    textAlign(CENTER, CENTER);
    text("Score: " + scoreCounter, width / 2, height - 20);

    // Display the player's hand
    const cardWidth = 100;
    const cardHeight = 150;
    const spacing = -30;
    const startX = (width - (playerHand.length * cardWidth + (playerHand.length - 1) * spacing)) / 2;
    const startY = height / 2 - cardHeight / 2;

    for (let i = 0; i < playerHand.length; i++) {
        const card = playerHand[i];
        const xOffset = startX + i * (cardWidth + spacing);
        const yOffset = startY;

        card.draw(xOffset, yOffset, card.selected); // Pass the selected property to the draw function
    }
    if (deck.isEmpty()) {
        // If the deck is empty, display a message
        textSize(24);
        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        text("Deck is empty!", width / 2, height / 2);
        replaceButton.hide();
        submitButton.hide();
    }

}

function replaceSelectedCards() {
    if (discardCount <= 0) {
        return;
    }
    for (let i = playerHand.length - 1; i >= 0; i--) {
        const card = playerHand[i];
        if (card.selected) {
            playerHand[i] = deck.deal(); // Replace selected card with a new card from the deck
            card.selected = false; // Deselect the replaced card
        }
    }
    discardCount--;
}

function toggleScoreboard() {
    if (scoreboard) {
        // remove div
        scoreBoard.remove();
        scoreboard = false;
    } else {
        // create a scoreboard
        scoreBoard = createDiv('Scoreboard');
        scoreBoard.position(100, 10);
        scoreBoard.size(200, 200);
        scoreBoard.style('background-color', 'white');
        scoreboard = true;

        updateScoreboardText();
    }
}

function updateScoreboardText() {
    // Show scores for all hands and the amount of times the hand was dealt
    const scoreText = `
        Straight Flush: ${scoreCounter} x ${getScoreCount('Straight Flush')} <br>
        Four of a Kind: ${scoreCounter} x ${getScoreCount('Four of a Kind')} <br>
        Full House: ${scoreCounter} x ${getScoreCount('Full House')} <br>
        Flush: ${scoreCounter} x ${getScoreCount('Flush')} <br>
        Straight: ${scoreCounter} x ${getScoreCount('Straight')} <br>
        Three of a Kind: ${scoreCounter} x ${getScoreCount('Three of a Kind')} <br>
        Two Pairs: ${scoreCounter} x ${getScoreCount('Two Pairs')} <br>
        One Pair: ${scoreCounter} x ${getScoreCount('One Pair')} <br>
        High Card: ${scoreCounter} x ${getScoreCount('High Card')}
    `;
    scoreBoard.html(scoreText);
}

function getScoreCount(handResult) {
    return scoreBoardText[handResult] || 0;
}

function submitHand() {
    submittedHand = playerHand.filter(card => card.selected).slice(0, 5);
    playerHand.forEach(card => (card.selected = false));

    console.log("Submitted Hand:", submittedHand);

    // Evaluate the hand and display the result
    const result = evaluateHand(submittedHand);
    resultText = "Hand: " + result;
    console.log("Hand Evaluation Result:", result);

    const handValue = calculateHandValue(result);
    scoreCounter += handValue;

    // Reset the discard count
    discardCount = 3;

    // Deal new cards
    playerHand = playerHand.filter(card => !submittedHand.includes(card));
    while (playerHand.length < 7) {
        playerHand.push(deck.deal());
    }

    // Update the scoreboard if visible
    if (scoreboard) {
        updateScoreboardText();
    }
}


function evaluateHand(hand) {
    // Sort the hand by card value (assuming the Card class has a numeric 'value' property)
    hand.sort((a, b) => a.value - b.value);

    // Check for royal flush
    if (isRoyalFlush(hand)) {
        return "Royal Flush";
    } else if (isStraightFlush(hand)) {
        return "Straight Flush";
    } else if (isFourOfAKind(hand)) {
        return "Four of a Kind";
    } else if (isFullHouse(hand)) {
        return "Full House";
    } else if (isFlush(hand)) {
        return "Flush";
    } else if (isStraight(hand)) {
        return "Straight";
    } else if (isThreeOfAKind(hand)) {
        return "Three of a Kind";
    } else if (isTwoPairs(hand)) {
        return "Two Pairs";
    } else if (isOnePair(hand)) {
        return "One Pair";
    } else {
        return "High Card";
    }
}

function calculateHandValue(handResult) {
    // Assign a value to each poker hand
    switch (handResult) {
        case "Royal Flush":
            return 2500;
        case "Straight Flush":
            return 500;
        case "Four of a Kind":
            return 250;
        case "Full House":
            return 90;
        case "Flush":
            return 60;
        case "Straight":
            return 40;
        case "Three of a Kind":
            return 30;
        case "Two Pairs":
            return 20;
        case "One Pair":
            return 10;
        default:
            return 0;
    }
}

// Implement helper functions for each poker hand check

function isRoyalFlush(hand) {
    // Check if the hand is a royal flush (A, K, Q, J, 10 of the same suit)
    const royalFlushValues = [10, 11, 12, 13, 14];
    const handValues = hand.map(card => card.value);
    return isStraightFlush(hand) && handValues.every(value => royalFlushValues.includes(value));
}

function isStraightFlush(hand) {
    return isStraight(hand) && isFlush(hand);
}

function isFourOfAKind(hand) {
    // Check if there are four cards with the same value
    const valueCounts = getCardValueCounts(hand);
    return Object.values(valueCounts).includes(4);
}

function isFullHouse(hand) {
    // Check if there are three cards with the same value and two cards with another value
    const valueCounts = getCardValueCounts(hand);
    return Object.values(valueCounts).includes(3) && Object.values(valueCounts).includes(2);
}

function isFlush(hand) {
    // Check if all cards have the same suit
    const firstSuit = hand[0].name.slice(-1); // Get the last character (suit) of the first card
    return hand.every(card => card.name.slice(-1) === firstSuit);
}

function isStraight(hand) {
    // Check if the values of the cards form a sequence
    // consider Aces as 1 or 14
    const handValues = hand.map(card => card.value);
    const sortedValues = handValues.sort((a, b) => a - b);
    const isAceLowStraight = sortedValues[0] === 2 && sortedValues[1] === 3 && sortedValues[2] === 4 && sortedValues[3] === 5 && sortedValues[4] === 14;
    const isAceHighStraight = sortedValues[0] === 10 && sortedValues[1] === 11 && sortedValues[2] === 12 && sortedValues[3] === 13 && sortedValues[4] === 14;
    return sortedValues.every((value, index) => value === sortedValues[0] + index) || isAceLowStraight || isAceHighStraight;
}

function isThreeOfAKind(hand) {
    // Check if there are three cards with the same value
    const valueCounts = getCardValueCounts(hand);
    return Object.values(valueCounts).includes(3);
}

function isTwoPairs(hand) {
    // Check if there are two cards with the same value twice
    const valueCounts = getCardValueCounts(hand);
    return Object.values(valueCounts).filter(count => count === 2).length === 2;
}

function isOnePair(hand) {
    // Check if there are two cards with the same value
    const valueCounts = getCardValueCounts(hand);
    return Object.values(valueCounts).includes(2);
}

function getCardValueCounts(hand) {
    // Count the occurrences of each card value
    const valueCounts = {};
    for (const card of hand) {
        const value = card.value;
        valueCounts[value] = (valueCounts[value] || 0) + 1;
    }
    return valueCounts;
}
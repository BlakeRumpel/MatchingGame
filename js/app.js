/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector(".deck");
const cardsList = document.getElementsByClassName("card");
const cards = Array.from(document.querySelectorAll(".card"));
const moveCounter = document.querySelector(".moves");
const resetButton = document.querySelector(".restart");
const stars = document.querySelector(".stars");

const openCards = [];
const maxPairs = cards.length / 2;

let preventFlip = false;
let moves = 0;
let pairs = 0;

/*
 * Shuffles the deck of cards
 * - builds a new array of just the icons available and shuffles them
 * - replaces the html of each card
 */
function shuffleDeck() {
    const icons = cards.map(c => c.children[0].classList[1]);
    const shuffled = shuffle(icons);

    for (let i = 0; i < cardsList.length; i++) {
        cardsList[i].innerHTML = `<i class="fa ${shuffled[i]}"></i>`;
    }
}

/*
 * Shuffles an array
 * Shuffle function from http://stackoverflow.com/a/2450976
 * @param array the array to shuffle
 * @return returns the shuffled array
 */
 function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Toggles the card on or off
 * @param card the card clicked
 */ 
 function flipCard(card) {
    card.classList.toggle("show");
    card.classList.toggle("open");
}

/*
 * Takes the card clicked and progresses the game
 * - flips the card clicked
 * - when theres 2 cards clicked it will:
 *     - increase the move counter
 *     - check for pairing
 *     - match them if they match
 *     - check if they won
 * @param card the card clicked
 */
function openCard(card) {
    let matched = false;
    if (!preventFlip && !card.classList.contains("match") && !card.classList.contains("open")) {
        flipCard(card);

        openCards.push(card);
    
        if (openCards.length === 2) {
            incrementMoveCounter();
    
            if (classesEqual(openCards[0].children[0], openCards[1].children[0])) {
                openCards.forEach(c => {
                    c.classList.add("match");
                    flipCard(c);
                });

                pairs++;
                matched = true;
            }

            preventFlip = true;
            setTimeout(() => {
                openCards.forEach(c => flipCard(c));
                openCards.splice(0, openCards.length);
                preventFlip = false;
            }, matched ? 0 : 800);

            if (pairs >= maxPairs) {
                swal("WINNER!", `IT ONLY TOOK YOU ${moves} MOVES!`, "success");
            }
        }
    }
}

/*
 * Increments the move counter and removes stars if necessary
 */
 function incrementMoveCounter() {
    moves++;
    moveCounter.textContent = moves;

    if (moves === 13) { 
        toggleStar(2, "fa-star-o");
    }

    if (moves === 19) {
        toggleStar(1, "fa-star-o");
    }

    if (moves === 25) {
        toggleStar(0, "fa-star-o");
    }
}

/*
 * Toggles a star on or off
 * State can be 'fa-star' or 'fa-star-o'
 * @param star the index of the star in the 'stars' array
 * @param newState the new state of the star 
 */
function toggleStar(star, newState) {
    if (newState === "fa-star") {
        stars.children[star].firstChild.classList.replace("fa-star-o", newState);
    } else if (newState === "fa-star-o") {
        stars.children[star].firstChild.classList.replace("fa-star", newState);
    }
}

/*
 * Checks to see if the two objects have all the same classes
 * @param item1 the item with the class list to compare to
 * @param item2 the item to check 
 * @return return true if the class lists are matching
 */
 function classesEqual(item1, item2) {
    for (let c of item1.classList) {
        if (!item2.classList.contains(c)) {
            return false;
        }
    }

    return true;
}

/*
 * Called when a card is clicked
 * @param e the event object
 */
function cardClicked(e) {
    if (e.target.classList.contains("card")) {
        openCard(e.target);
    }
}

/*
 * Resets the game state 
 */
function reset() {
    for (let c of document.querySelectorAll(".card")) {
        c.classList.remove("open", "show", "match");
    }

    openCards.splice(0, openCards.length);

    moves = 0;
    moveCounter.textContent = 0;

    pairs = 0;

    toggleStar(0, "fa-star");
    toggleStar(1, "fa-star");
    toggleStar(2, "fa-star");

    shuffleDeck();
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
deck.addEventListener("click", cardClicked);
resetButton.addEventListener("click", reset);

// Shuffle the deck for the longest time (oh oh oh)
shuffleDeck();
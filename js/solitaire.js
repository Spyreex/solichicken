const rowEls = document.querySelectorAll("div.lower-board > div");
const closedDeckEl = document.querySelector("div.closed-card-container");
const openedCardsEl = document.querySelector("div.opened-card-container");
const foundationEls = document.querySelectorAll("div.foundations > div");

// index 0 is top
var closedDeck = [];
var closedRows = [[], [], [], [], [], [], []];
var index = 0;

// function below?
function appendCard(card, appendTo) {
    // finds the bottom most card
    let parent = rowEls[appendTo].querySelector("div.bottom");

    // no card found (only applicable for closed cards)
    if (!parent)
    {
        let temp = rowEls[appendTo];
        if (temp.lastElementChild)
        {
            while (temp.lastElementChild.classList.contains("card"))
            {
                temp = temp.lastElementChild;
            }
        }
        parent = temp;
    }

    // create div with card and bottom class
    let newEl = document.createElement("div");
    newEl.classList.add("card", "bottom");
    newEl.id = card;

    // remove bottom class from previous card
    parent.classList.remove("bottom");

    // create image and put it inside the card class
    let newImgEl = document.createElement("img");
    newImgEl.setAttribute("src", "images/cards/" + card + ".png");
    newEl.appendChild(newImgEl);

    if (card !== "closed-card")
        newEl.addEventListener("click", select);

    // // check for empty row, if empty, remove empty "card" before appending new card
    // if (parent.id.search("empty") >= 0) {
    //     rowEls[appendTo].removeChild(parent);
    //     rowEls[appendTo].appendChild(newEl);
    // }
    // else
        // parent.appendChild(newEl);
    parent.appendChild(newEl);

}

// function to select elements and also the function for what happens after you click another card after already having a card selected
function select(evt) {
    var targetCard = evt.currentTarget;

    if (evt.target.parentElement === targetCard)
    {
        // if same card is clicked again
        if (targetCard.classList.contains("selected"))
            targetCard.classList.toggle("selected");
        // if there's already a selected card
        else if (document.querySelector("div.selected")) {
            var selectedCard = document.querySelector("div.selected");
    
            // if the clicked card is one of the opened deck, deselects already deselected card and selects opened card instead
            if (targetCard.classList.contains("opened"))
            {
                selectedCard.classList.remove("selected");
                targetCard.classList.toggle("selected");
            // selected cards can only go to the bottom of other rows or foundation pile
            } else if (targetCard.classList.contains("bottom") || targetCard.classList.contains("foundation")) {

                // check whether clicked card is a child of selected card, removes selected if this is the case
                let child = selectedCard.lastElementChild;
                while (child && child !== targetCard)
                {
                    child = child.lastElementChild;
                }
                if (child === targetCard)
                    selectedCard.classList.remove("selected");
                else
                {
                    selectedCard.classList.remove("foundation");

                    const selectedId = selectedCard.id;
                    const targetId = targetCard.id;
                    const selectedCardNumber = parseInt(selectedId.substring(0, selectedId.length - 1));
                    const targetCardNumber = parseInt(targetId.substring(0, targetId.length - 1));

                    // legal move checks for foundation move
                    if (targetCard.classList.contains("foundation"))
                    {
                        // passes if selected card is not bottom card
                        if (selectedCard.childElementCount > 1)
                            return;

                        let targetPileId = targetCard.closest("div.empty").id;

                        // check for same kind
                        if (targetPileId !== selectedId.charAt((selectedId.length) - 1))
                            return;

                        // check for sequence
                        //  checks for empty first, if empty means pile has no cards yet
                        if (targetCard.classList.contains("empty"))
                        {
                            if (selectedCardNumber !== 1)
                                return;
                        }
                        else if (selectedCardNumber - 1 !== targetCardNumber)
                            return;

                        selectedCard.classList.add("foundation");
                    } else {
                        // legal move checks for regular board moves

                        const targetColor = targetId.charAt((targetId.length) - 1);
                        const selectedColor = selectedId.charAt((selectedId.length) - 1);

                        // empty row can only take kings
                        if (targetCard.classList.contains("empty"))
                        {
                            if (selectedCardNumber !== 13)
                                return;
                        } else {
                            // check for sequence
                            if (selectedCardNumber + 1 !== targetCardNumber)
                                return;
    
                            // check for different color
                            if ((targetColor === "d" || targetColor === "h") && (selectedColor === "d" || selectedColor === "h"))
                                return;
                            if ((targetColor === "s" || targetColor === "c") && (selectedColor === "s" || selectedColor === "c"))
                                return;
                        }
                    }

                    // code for moving card and everything that happens
                    var destroyCard;
                    var row;
                    var card;

                    // if parent is closed-card
                    if (selectedCard.parentElement.id === "closed-card")
                    {
                        destroyCard = selectedCard.parentElement.parentElement;
                        let rootCardRow = selectedCard.parentElement;
                        // loops until it finds the root of the row
                        while (rootCardRow.id === "closed-card")
                        {
                            rootCardRow = rootCardRow.parentElement;
                        }
                        // find row (id)
                        row = parseInt(rootCardRow.id) - 1;

                        // find what card needs to be made
                        let rowArray = closedRows[row];
                        card = rowArray[rowArray.length - 1];
                        closedRows[row].pop();
                    } else
                        selectedCard.parentElement.classList.add("bottom");

                    // remove card from closed deck array if card from opened deck was taken
                    if (selectedCard.classList.contains("opened"))
                    {
                        closedDeck.splice(closedDeck.indexOf(selectedCard.id), 1);
                        selectedCard.parentElement.addEventListener("click", select);
                        index--;
                    }
                    targetCard.classList.remove("bottom");
                    selectedCard.classList.remove("selected", "opened");
                    
                    // move card
                    targetCard.appendChild(selectedCard);
                    
                    // continuation of closed-card as parent: destroys closed card and replaces with open card
                    if (destroyCard)
                    {
                        destroyCard.removeChild(destroyCard.lastElementChild);
                        appendCard(card, row);
                    }
                }
            }
        } else if (!targetCard.classList.contains("empty"))
            targetCard.classList.toggle("selected");
    }
}

// opens 3 cards or less if not enough cards available
function openCards() {
    var cardsToAdd = [];
    for (let i = 0; i < 3; i++) {
        if (index + i < closedDeck.length) {
            cardsToAdd.push(closedDeck[index + i]);
        }
    }
    index += cardsToAdd.length;

    // if all cards are used up, remove closed-card and replace with refresh card
    if (index >= closedDeck.length) {
        closedDeckEl.removeChild(closedDeckEl.lastChild);

        let newEl = document.createElement("div");
        newEl.classList.add("card");

        // create image and put it inside the card class
        let newImgEl = document.createElement("img");
        newImgEl.setAttribute("src", "images/cards/refresh.png");
        newEl.appendChild(newImgEl);

        newEl.addEventListener("click", () => {
            index = 0;
            closedDeckReset();
        });

        closedDeckEl.appendChild(newEl);
    }

    // reverse the array so the first item is added last to openedCardsEl (on top)
    cardsToAdd.reverse();

    // remove all cards that were still in openedCardsEl
    if (openedCardsEl.firstChild) {
        openedCardsEl.removeChild(openedCardsEl.lastChild);
    }

    cardsToAdd.forEach((card) => {
        // create div with card class
        let newEl = document.createElement("div");
        newEl.classList.add("card", "opened");
        newEl.id = card;

        // create image and put it inside the card class
        let newImgEl = document.createElement("img");
        newImgEl.setAttribute("src", "images/cards/" + card + ".png");
        newEl.appendChild(newImgEl);

        if (card === cardsToAdd[cardsToAdd.length - 1])
        {
            newEl.addEventListener("click", select);
            newEl.classList.add("bottom");
        }

        // append card behind the right parent
        let childNode = openedCardsEl.lastElementChild;
        if (childNode)
        {
            if (childNode.childElementCount > 1)
                childNode.lastChild.appendChild(newEl);
            else
                childNode.appendChild(newEl);
        }
        else
            openedCardsEl.appendChild(newEl);
    });
}

// 24 cards in closed deck, 28 cards on board
function startGame() {
    var cardList = [];

    for (let y = 0; y < 52; y++) {

        var temp = "";
        switch (Math.floor(y / 13)) {
            case 0:
                temp = "d";
                break;

            case 1:
                temp = "c";
                break;

            case 2:
                temp = "h";
                break;

            case 3:
                temp = "s";
                break;
        }
        cardList.push((y % 13 + 1) + temp);
    }

    /** random card allocation:
     *  0-23: closed deck
     *  24: 2nd row closed card
     *  25-26: 3rd row closed cards
     *  27-29: 4th row closed cards
     *  30-33: 5th row closed cards
     *  34-38: 6th row closed cards
     *  39-44: 7th row closed cards
     *  45-52: open cards for all 7 rows
     **/
    for (let i = 0; i < 52; i++) {
        let random = Math.floor(Math.random() * (52 - i));

        if (i < 24)
            closedDeck.push(cardList[random]);
        else if (i == 24) {
            closedRows[1].push(cardList[random]);
            appendCard("closed-card", 1);
        }
        else if (i < 27) {
            closedRows[2].push(cardList[random]);
            appendCard("closed-card", 2);
        }
        else if (i < 30) {
            closedRows[3].push(cardList[random]);
            appendCard("closed-card", 3);
        }
        else if (i < 34) {
            closedRows[4].push(cardList[random]);
            appendCard("closed-card", 4);
        }
        else if (i < 39) {
            closedRows[5].push(cardList[random]);
            appendCard("closed-card", 5);
        }
        else if (i < 45) {
            closedRows[6].push(cardList[random]);
            appendCard("closed-card", 6);
        }
        else
            appendCard(cardList[random], i - 45);

        cardList.splice(random, 1);
    }

    // console.log(closedDeck);

    document.querySelectorAll("div.empty").forEach((empty) => {
        empty.addEventListener("click", select);
    })

    closedDeckReset();
}

function closedDeckReset()
{
    if (openedCardsEl.lastChild)
        openedCardsEl.removeChild(openedCardsEl.lastChild);
    if (closedDeckEl.lastChild)
        closedDeckEl.removeChild(closedDeckEl.lastChild);
    
    // add closed-card to closed pile
    let newEl = document.createElement("div");
    newEl.classList.add("card");

    let newImgEl = document.createElement("img");
    newImgEl.setAttribute("src", "images/cards/closed-card.png");
    newEl.appendChild(newImgEl);

    newEl.addEventListener("click", openCards);

    closedDeckEl.appendChild(newEl);
}

startGame();



/** TODO:
 * + opened deck should not be deleted as cards should still be reachable after a new set is opened from the closed deck
 *      - don't remove the cards
 */
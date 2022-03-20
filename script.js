
// We store our game status element here to allow us to more easily use it later on
const statusDisplay = document.querySelector('.game-status');

// Here we declare some variables that we will use to track the game state through the game.
// We will use gameActive to pause the game in case of an end scenario.

let gameActive = true;

// We will store our current player here, so we know whose turn is there.

let currentPlayer = "X";

// We will store our current game state here, the form of empty strings in an array will allow us to easily track played cells and validate the game state later on

let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Here we have declared some messages we will display to the user during the game. Since we have some dynamic factors in those messages, namely the current player, we have declared them as functions, so that the actual message gets created with current data every time we need it.

const winningMessage = () => `Congrats! Player marking ${currentPlayer} won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `Mark ${currentPlayer}`;

// Initial message to let the players know whose turn it is.

statusDisplay.innerHTML = currentPlayerTurn();

// Update internal game state to reflect the played move, as well as update the user interface to reflect the played move.
const handleCellPlayed = (clickedCell, clickedCellIndex) => {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

const handlePlayerChange = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }
    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }
    // Check whether there are any values in our game state array that are still not populated with a player sign.
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }
    // If we get to here we know that the no one won the game yet, and that there are still moves to be played, so we continue by changing the current player.
    handlePlayerChange();
}
const handleCellClick = (clickedCellEvent) => {

    // We will save the clicked html element in a variable for easier further use
    const clickedCell = clickedCellEvent.target;
    // Here we will grab the 'data-cell-index' attribute from the clicked cell to identify where that cell is in our grid. Please note that the getAttribute will return a string value. Since we need an actual number we will parse it to an integer(number)

    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // Next up we need to check whether the call has already been played, or if the game is paused. If either of those is true we will simply ignore the click.

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    // If everything is in order we will proceed with the game flow

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

const handleRestartGame = () => {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell')
        .forEach(cell => cell.innerHTML = "");
}

// Finally, we add our event listeners to the actual game cells, as well as our restart button
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game-restart').addEventListener('click', handleRestartGame);

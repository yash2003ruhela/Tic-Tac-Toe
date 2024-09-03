// Select DOM elements
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');

// Initialize game state variables
let currentMarker = 'X';
let boardState = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
let gameActive = true;

// Define winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Handle cell click events
function handleClick(event) {
    const index = event.target.dataset.index;

    // Check if the cell is already filled or the game is not active
    if (boardState[index] !== ' ' || !gameActive) {
        return;
    }

    // Update board state and UI
    boardState[index] = currentMarker;
    event.target.textContent = currentMarker;

    // Check for a win or a draw
    if (checkForWin()) {
        message.textContent = `Player ${currentMarker} wins!`;
        gameActive = false;
        return;
    }

    // Check for a draw
    if (boardState.every(cell => cell !== ' ')) {
        message.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    // Switch to the other player
    currentMarker = currentMarker === 'X' ? 'O' : 'X';
}

// Check if a player has won the game
function checkForWin() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return boardState[a] !== ' ' && boardState[a] === boardState[b] && boardState[a] === boardState[c];
    });
}

// Reset the game to its initial state
function resetGame() {
    boardState = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    cells.forEach(cell => cell.textContent = ' ');
    message.textContent = ''; // Reset the message
    currentMarker = 'X';
    gameActive = true;
}

// Save the current game state to localStorage
function saveGame() {
    const gameData = {
        currentMarker: currentMarker,
        boardState: boardState,
        gameActive: gameActive
    };
    localStorage.setItem('TicTacToeGame', JSON.stringify(gameData));
}

// Load the game state from localStorage
function loadGame() {
    const savedData = JSON.parse(localStorage.getItem('TicTacToeGame'));

    // Corrected variable name and added a check if savedData exists
    if (savedData) {
        currentMarker = savedData.currentMarker;
        boardState = savedData.boardState;
        gameActive = savedData.gameActive;

        // Update the UI based on the loaded state
        cells.forEach((cell, index) => {
            cell.textContent = boardState[index];
        });

        // Update the message based on game state
        if (gameActive) {
            message.textContent = `Player ${currentMarker}'s turn`;
        } else {
            message.textContent = `Player ${currentMarker} has already won!`;
        }
    } else {
        message.textContent = "No saved game found";
    }
}

// Add event listeners to cells and reset button
cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);

// Load the game state when the page is loaded
window.addEventListener('load', loadGame);

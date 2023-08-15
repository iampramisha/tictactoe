const gameData = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
let editedPlayer = 0;
let activePlayer = 0;
let currentRound = 0;
const players = [
  {
    name: '',
    symbol: 'X',
  },
  {
    name: '',
    symbol: 'O',
  },
];
const playerConfigOverlayElement = document.getElementById('config-overlay');
const backdropElement = document.getElementById('backdrop');
const editPlayerOneBtnElement = document.getElementById('edit-player-1-btn');
const editPlayerTwoBtnElement = document.getElementById('edit-player-2-btn');
const cancelConfigBtnElement = document.getElementById('cancel-config-btn');
const formElement = document.querySelector('form');
const errorsOutputTextElement = document.getElementById('config-errors');
const warningStyle = document.getElementById('warning');
const startNewGamebtn = document.getElementById('start');
const turnBtnElement = document.getElementById('para');
const gameboardElement = document.getElementById('hide');
const gameBoardElement = document.querySelectorAll('#game-board > li');
const activePlayerNameElement = document.getElementById('active-player-name');
const gameOverelement = document.getElementById('game-over');

for (const gameFieldElement of gameBoardElement) {
  gameFieldElement.addEventListener('click', selectGameField);
}

function openPlayerConfig(event) {
  editedPlayer = +event.target.dataset.playerid;
  playerConfigOverlayElement.style.display = 'block';
  backdropElement.style.display = 'block';
}

function closePlayerConfig() {
  playerConfigOverlayElement.style.display = 'none';
  backdropElement.style.display = 'none';
  warningStyle.classList.remove('error');
  errorsOutputTextElement.textContent = '';
}

function resetGameStatus() {
  activePlayer = 0;
  currentRound = 1;
  gameOverelement.firstElementChild.innerHTML = 'You won, <span id="winner-name">PLAYER NAME</span>!';
  gameOverelement.style.display = 'none';
  let gameBoardIndex = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      gameData[i][j] = 0;
      const gameBoardItemElement = gameBoardElement[gameBoardIndex];
      gameBoardItemElement.textContent = '';
      gameBoardItemElement.classList.remove('disabled');
      gameBoardIndex++;
    }
  }
}

function savePlayerConfig(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const enteredPlayername = formData.get('playername').trim();
  if (!enteredPlayername) {
    warningStyle.classList.add('error');
    errorsOutputTextElement.textContent = 'Please enter a valid name!';
    return;
  }
  const currentPlayerIndex = editedPlayer - 1;
  const updatedPlayerDataElement = document.getElementById(`player-${editedPlayer}-data`);
  updatedPlayerDataElement.children[1].textContent = enteredPlayername;
  players[currentPlayerIndex].name = enteredPlayername;
}

function loadGamePage() {
  if (players[0].name === '' || players[1].name === '') {
    alert('Please enter names for both players!');
    return;
  }
  resetGameStatus();
  activePlayerNameElement.textContent = players[activePlayer].name;
  turnBtnElement.style.display = 'block';
  gameboardElement.style.display = 'block';
}

function switchPlayer() {
  if (activePlayer === 0) {
    activePlayer = 1;
  } else if (activePlayer === 1) {
    activePlayer = 0;
  }
  activePlayerNameElement.textContent = players[activePlayer].name;
}

function selectGameField(event) {
  const selectedField = event.target;
  const selectedColum = selectedField.dataset.col - 1;
  const selectedRow = selectedField.dataset.row - 1;
  if (gameData[selectedRow][selectedColum] > 0) {
    alert('Please select an empty field');
    return;
  }
  selectedField.textContent = players[activePlayer].symbol;
  selectedField.classList.add('disabled');
  gameData[selectedRow][selectedColum] = activePlayer + 1;
  const winnerId = checkForGameOver();
  if (winnerId !== 0) {
    endGame(winnerId);
  }
  console.log(winnerId);
  currentRound++;

  switchPlayer();
}

function checkForGameOver() {
  for (let i = 0; i < 3; i++) {
    if (
      gameData[i][0] &&
      gameData[i][0] === gameData[i][1] &&
      gameData[i][1] === gameData[i][2]
    ) {
      return gameData[i][0];
    }
  }
  for (let i = 0; i < 3; i++) {
    if (
      gameData[0][i] > 0 &&
      gameData[0][i] === gameData[1][i] &&
      gameData[1][i] === gameData[2][i]
    ) {
      return gameData[0][i];
    }
  }
  if (
    gameData[0][0] > 0 &&
    gameData[0][0] === gameData[1][1] &&
    gameData[1][1] === gameData[2][2]
  ) {
    return gameData[0][0];
  }
  if (
    gameData[2][0] &&
    gameData[2][0] === gameData[1][1] &&
    gameData[1][1] === gameData[0][2]
  ) {
    return gameData[2][0];
  }
  if (currentRound === 9) {
    return -1;
  }
  return 0;
}

function endGame(winnerId) {
  if (winnerId > 0) {
    gameOverelement.style.display = 'block';
    const winnerName = players[winnerId - 1].name;
    gameOverelement.firstElementChild.firstElementChild.textContent = winnerName;
  } else {
    gameOverelement.firstElementChild.textContent = "It's a draw";
  }
}

function startNewGame() {
  if (players[0].name === '' || players[1].name === '') {
    alert('Please enter names for both players!');
    return;
  }
  resetGameStatus();
  activePlayerNameElement.textContent = players[activePlayer].name;
  turnBtnElement.style.display = 'block';
  gameboardElement.style.display = 'block';
  gameOverelement.style.display = 'none';
}

editPlayerOneBtnElement.addEventListener('click', openPlayerConfig);
editPlayerTwoBtnElement.addEventListener('click', openPlayerConfig);
cancelConfigBtnElement.addEventListener('click', closePlayerConfig);
backdropElement.addEventListener('click', closePlayerConfig);
formElement.addEventListener('submit', savePlayerConfig);
startNewGamebtn.addEventListener('click', startNewGame);
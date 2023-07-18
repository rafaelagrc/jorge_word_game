// Word Game with Jorge

let playerNames = []; // Array to store player names
let players = []; // Array to store player objects
let currentPlayerIndex = 0; // Index of the current player
let jorgeIndex = -1; // Index of the player who receives the word "JORGE"
let commonWord = ""; // Common word assigned to all other players
let countdownDuration = 5; // Countdown duration in seconds
let countdownTimer; // Timer for the countdown

const startButton = document.getElementById("startButton");
const addPlayerButton = document.getElementById("addPlayerButton");
const startGameButton = document.getElementById("startGameButton");
const confirmButton = document.getElementById("confirmBtn");
const nextPlayerButton = document.getElementById("nextPlayerBtn");

startButton.addEventListener("click", startGame);
addPlayerButton.addEventListener("click", addPlayer);
startGameButton.addEventListener("click", startGamePlay);
confirmButton.addEventListener("click", showWord);
nextPlayerButton.addEventListener("click", nextPlayer);

function startGame() {
  document.getElementById("homepage").style.display = "none";
}

// Move the "Enter Player Names" section to a separate function
function showEnterPlayerNames() {
  document.getElementById("playerNames").style.display = "block";
}

// Call the showEnterPlayerNames function when the "Start Game" button is clicked
startButton.addEventListener("click", showEnterPlayerNames);


function addPlayer() {
  const inputElement = document.getElementById("playerName");
  const playerName = inputElement.value;

  if (playerName !== "") {
    playerNames.push(playerName);
    inputElement.value = ""; // Clear the input field

    const playerList = document.getElementById("playerList");
    const listItem = document.createElement("li");
    listItem.textContent = playerName;

    // Create a delete button for the player
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      deletePlayer(playerName);
      playerList.removeChild(listItem);
    });

    listItem.appendChild(deleteButton);
    playerList.appendChild(listItem);

    // Save player names to local storage
    localStorage.setItem("playerNames", JSON.stringify(playerNames));
  }
}

function deletePlayer(playerName) {
  const playerIndex = playerNames.indexOf(playerName);
  if (playerIndex !== -1) {
    playerNames.splice(playerIndex, 1);

    // Save updated player names to local storage
    localStorage.setItem("playerNames", JSON.stringify(playerNames));
  }
}



function displayPlayerNames() {
  const playerNamesContainer = document.getElementById("playerNamesContainer");
  playerNamesContainer.innerHTML = "";
  for (let i = 0; i < playerNames.length; i++) {
    const playerNameDiv = document.createElement("div");
    playerNameDiv.textContent = playerNames[i];
    playerNamesContainer.appendChild(playerNameDiv);
  }
}

function startGamePlay() {
  if (playerNames.length < 2) {
    alert("Please enter at least two player names.");
    return;
  }

  document.getElementById("playerNames").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("nextPlayer").style.display = "block";

  assignWords()
    .then(() => {
      currentPlayerIndex = 0;
      document.getElementById("playerNameText").textContent = players[currentPlayerIndex].name;
      document.getElementById("confirmBtn").disabled = false; // Enable confirm button for the first player

      // Reset the player list
      const playerList = document.getElementById("playerList");
      playerList.innerHTML = ""; // Clear the player list
    })
    .catch(error => {
      console.log("Error assigning words:", error);
    });
}


function showWord() {
  document.getElementById("confirmBtn").disabled = true;
  document.getElementById("word").textContent = players[currentPlayerIndex].word;
  document.getElementById("word").style.display = "block";
  document.getElementById("nextPlayerBtn").style.display = "block";
}

function nextPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  document.getElementById("playerNameText").textContent = players[currentPlayerIndex].name;
  document.getElementById("word").textContent = "";
  document.getElementById("word").style.display = "none";
  document.getElementById("confirmBtn").disabled = false; // Enable confirm button
  document.getElementById("nextPlayerBtn").style.display = "none";
}

function assignWords() {
  players = [];

  // Randomly assign "JORGE" word to one player
  const randomIndex = Math.floor(Math.random() * playerNames.length);
  jorgeIndex = randomIndex;

  return generateWords()
    .then(() => {
      for (let i = 0; i < playerNames.length; i++) {
        const word = (i === jorgeIndex) ? "JORGE" : commonWord;
        const player = {
          name: playerNames[i],
          word: word
        };
        players.push(player);
      }
    })
    .catch(error => {
      console.log("Error assigning words:", error);
    });
}

function generateWords() {
  const numPlayers = playerNames.length;
  const wordPromises = Array.from({ length: numPlayers - 1 }, getRandomWord);

  return Promise.all(wordPromises)
    .then(words => {
      commonWord = words[0];
      players = playerNames.map((name, index) => ({
        name: name,
        word: (index === jorgeIndex) ? "JORGE" : commonWord
      }));
    })
    .catch(error => {
      console.log("Error fetching words:", error);
    });
}


function getRandomWord() {
  const endpoint = "https://random-word-api.herokuapp.com/word";

  return fetch(endpoint)
    .then(response => response.json())
    .then(data => data[0])
    .catch(error => {
      console.log("Error fetching random word:", error);
    });
}


window.onload = function () {
  displayPlayerNames();
};

function exitGame() {
  document.getElementById("game").style.display = "none";
  document.getElementById("nextPlayer").style.display = "none";
  document.getElementById("homepage").style.display = "block";
}
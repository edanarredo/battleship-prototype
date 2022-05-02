// Return array of length 100 indicating open and occupied spaces
function getDOMBoard(board = "SELF") {
   var result = Array.from(Array(100).keys());

   let gameBoard = board == "SELF" ? boxes : opponentBoard;

   // Indexes of board with a square in it are marked 1, else 0
   gameBoard.forEach((item, index) => {
      if (item.childElementCount > 0) {
         if (item.children[0].classList.contains("battleship"))
            result[index] = 1;
         else if (item.children[0].classList.contains("carrier"))
            result[index] = 2;
         else if (item.children[0].classList.contains("destroyer"))
            result[index] = 3;
         else if (item.children[0].classList.contains("patrol"))
            result[index] = 4;
         else if (item.children[0].classList.contains("submarine"))
            result[index] = 5;
      }
      else {
         result[index] = 0;
      }
   });

   return result;
}

function getPieceImage(index, piece_type, piece_direction) {
   let tile_img_path = "";
   let directory = (piece_direction == "south" ? `"../assets/Vertical/` : `"../assets/Horizontal/`);

   switch (piece_type) {
      case 1:
         tile_img_path = `${directory}4/4_${index}.png"`;
         break;
      case 2:
         tile_img_path = `${directory}5/5_${index}.png"`;
         break;
      case 3:
         tile_img_path = `${directory}3A/3A_${index}.png"`;
         break;
      case 4:
         tile_img_path = `${directory}2/2_${index}.png"`;
         break;
      case 5:
         tile_img_path = `${directory}3B/3B_${index}.png"`;
         break;
      default:
         break;
   }
   return tile_img_path;
}

function copyToClipboard() {
   navigator.clipboard.writeText(lobbyId);
   alert(`'${lobbyId}' copied to clipboard!`);
}

// Init player board with event listeners
for (const box of boxes) {
   box.addEventListener("dragenter", dragEnter);
   box.addEventListener("dragleave", dragLeave);
}

for (let i = 0; i < 100; i++) {
   opponentBoxes[i].setAttribute('data-index', `${i}`);
}

function makeGuess(ev) {
   var guessIndex = ev.target.dataset.index;

   // if game hasn't ended and user's turn.
   if (usersTurn && (userPoints != 17 || opponentPoints != 17)) {
      if (gameMode == "multiplayer")
         makeMultiplayerGuess(guessIndex);
      else
         makeSinglePlayerGuess(guessIndex);

      console.log(`user's turn: ${usersTurn}`);
      console.log(`game status: ${JSON.stringify(all_ship_statuses)}`);
   } else {
      console.log("not your turn.");
   }
}

function makeSinglePlayerGuess(guessIndex) {
   var guessTileValue = opponentBoard[guessIndex];

   if (guessTileValue > 0) {
      // decrease boat value for opponent
      all_ship_statuses['opponent'][Object.keys(boats)[guessTileValue - 1]]--;
      // increase score
      userPoints++;
      // set tile to new value indicating hit
      opponentBoxes[guessIndex].innerText = "-1";
      // maintain turn until miss
      usersTurn = true;
   }
   else if (opponentBoard[guessIndex].innerText < 0) {
      usersTurn = true;
   }
   else {
      // end turn if tile is empty (innerText == 0)
      usersTurn = false;
      botGuess();
   }
}
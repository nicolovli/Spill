let board;
let score = 0;
let rows = 4;
let columns = 4;

window.onload = function () {
  setGame();
};

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      //<div id='0-0'></div>
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      let num = board[r][c];
      updateTile(tile, num);
      document.getElementById("spillBrett").append(tile);
    }
  }
  setTwo();
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        return true;
      }
    }
  }
  return false;
}

function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;
  while (!found) {
    //random r, c
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);

    if (board[r][c] == 0) {
      board[r][c] = 2;
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.innerText = "2";
      tile.classList.add("x2", "new-tile");
      found = true;
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = "";
  tile.classList.value = "";
  tile.classList.add("tile");
  if (num > 0) {
    tile.innerText = num;
    if (num <= 4096) {
      tile.classList.add("x" + num.toString());
    } else {
      tile.classList.add("x8192");
    }
  }
}

function isGameOver() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (
        (c < columns - 1 && board[r][c] === board[r][c + 1]) ||
        (r < rows - 1 && board[r][c] === board[r + 1][c])
      ) {
        return false;
      }
    }
  }
  return true;
}

document.addEventListener("touchmove", handleTouchMove, false);

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      tilesMoved = slideleft();
      nyttBoard = JSON.stringify(board);
    } else {
      tilesMoved = slideright();
      nyttBoard = JSON.stringify(board);
    }
  } else {
    if (yDiff > 0) {
      tilesMoved = slideup();
      nyttBoard = JSON.stringify(board);
    } else {
      tilesMoved = slidedown();
      nyttBoard = JSON.stringify(board);
    }
  }

  /* reset values */
  xDown = null;
  yDown = null;

  if (nyttBoard !== currentBoard) {
    setTwo();
  }

  document.getElementById("score").innerText = score;

  if (isGameOver()) {
    alert("Game Over! You lose.");
    return;
  }
}

document.addEventListener("keyup", (e) => {
  let nyttBoard;
  let currentBoard = JSON.stringify(board);
  if (e.code == "ArrowLeft") {
    tilesMoved = slideleft();
    nyttBoard = JSON.stringify(board);
  } else if (e.code == "ArrowRight") {
    tilesMoved = slideright();
    nyttBoard = JSON.stringify(board);
  } else if (e.code == "ArrowUp") {
    tilesMoved = slideup();
    nyttBoard = JSON.stringify(board);
  } else if (e.code == "ArrowDown") {
    tilesMoved = slidedown();
    nyttBoard = JSON.stringify(board);
  }

  if (nyttBoard !== currentBoard) {
    setTwo();
  }

  document.getElementById("score").innerText = score;

  if (isGameOver()) {
    alert("Game Over! You lose.");
    return;
  }
});

function filterZero(row) {
  return row.filter((num) => num != 0); //Lag ny array uten 0
}

function slide(row) {
  row = filterZero(row); // fjern 0

  //Slide
  for (let i = 0; i < row.length - 1; i++) {
    //Sjekker hver tile som ikke er 0
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  row = filterZero(row);

  //Legg til 0 igjen
  while (row.length < columns) {
    row.push(0);
  }

  return row;
}

function slideleft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideright() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    row.reverse();
    row = slide(row);
    row.reverse();
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideup() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row = slide(row);
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slidedown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row.reverse();
    row = slide(row);
    row.reverse();
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

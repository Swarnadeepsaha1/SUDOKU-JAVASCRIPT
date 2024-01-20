const sudokuGrid = [[], [], [], [], [], [], [], [], []];
const gridSize = 9;

for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    sudokuGrid[i][j] = document.getElementById(i * 9 + j);
  }
}

let sudokuBoard = [[], [], [], [], [], [], [], [], []];

function fillSudokuBoard(board) {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (board[i][j] !== 0) {
        sudokuGrid[i][j].innerText = board[i][j];
      } else {
        sudokuGrid[i][j].innerText = "";
      }
    }
  }
}

let getPuzzleButton = document.getElementById("GetPuzzle");
let solvePuzzleButton = document.getElementById("SolvePuzzle");

window.onload = function () {
  solvePuzzleButton.disabled = true;
};

getPuzzleButton.onclick = function () {
  fetch("https://sugoku.onrender.com/board?difficulty=easy")
    .then((res) => res.json())
    .then((data) => {
      sudokuBoard = data.board;
      fillSudokuBoard(sudokuBoard);
    })
    .catch((err) => console.error("Error while fetching data : ", err));
  solvePuzzleButton.disabled = false;
};

solvePuzzleButton.onclick = () => {
  sudokuSolver(sudokuBoard, 0, 0, gridSize);
};

function isSafe(board, row, col, num, gridSize) {
  for (let i = 0; i < gridSize; i++) {
    if (board[row][i] == num || board[i][col] == num) {
      return false;
    }
  }

  let subgridSize = Math.sqrt(gridSize);
  let startRow = row - (row % subgridSize);
  let startCol = col - (col % subgridSize);

  for (let i = 0; i < subgridSize; i++) {
    for (let j = 0; j < subgridSize; j++) {
      if (board[startRow + i][startCol + j] == num) {
        return false;
      }
    }
  }

  return true;
}

function sudokuSolver(board, row, col, gridSize) {
  if (row === gridSize) {
    fillSudokuBoard(board);
    return true;
  }

  if (col === gridSize) {
    return sudokuSolver(board, row + 1, 0, gridSize);
  }

  if (board[row][col] !== 0) {
    return sudokuSolver(board, row, col + 1, gridSize);
  }

  for (let num = 1; num <= 9; num++) {
    if (isSafe(board, row, col, num, gridSize)) {
      board[row][col] = num;
      let nextMovePossible = sudokuSolver(board, row, col + 1, gridSize);
      if (nextMovePossible) {
        return true;
      }
      board[row][col] = 0; // Backtracking
    }
  }

  return false;
}

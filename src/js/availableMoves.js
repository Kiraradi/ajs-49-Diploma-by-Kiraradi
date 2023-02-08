export default function availableMoves(rangeTravel, rangeAttacks, position, boardSize) {
  let arrAvailableMoves = [];
  let arraAvailableAttackOptions = [];

  const board = [];
  let currentPositionRow;
  let currentPositionColumn;

  for (let i = 0; i < boardSize; i += 1) {
    board[i] = [];
    for (let j = 0; j < boardSize; j += 1) {
      board[i][j] = i * boardSize + j;

      if (board[i][j] === position) {
        currentPositionRow = i;
        currentPositionColumn = j;
      }
    }
  }

  for (let i = -rangeTravel; i <= rangeTravel; i += 1) {
    if (currentPositionRow + i >= 0 && currentPositionRow + i < boardSize) {
      arrAvailableMoves.push(board[currentPositionRow + i][currentPositionColumn]);
    }

    if (currentPositionColumn + i >= 0 && currentPositionColumn + i < boardSize) {
      arrAvailableMoves.push(board[currentPositionRow][currentPositionColumn + i]);
    }

    if (currentPositionRow + i >= 0 && currentPositionRow + i < boardSize
      && currentPositionColumn + i >= 0 && currentPositionColumn + i < boardSize) {
      arrAvailableMoves.push(board[currentPositionRow + i][currentPositionColumn + i]);
    }

    if (currentPositionRow - i >= 0 && currentPositionRow - i < boardSize
      && currentPositionColumn + i >= 0 && currentPositionColumn + i < boardSize) {
      arrAvailableMoves.push(board[currentPositionRow - i][currentPositionColumn + i]);
    }
  }
  let leftUpCell = null;
  let rightDownCell = null;

  for (let i = -rangeAttacks; i <= rangeAttacks; i += 1) {
    if (leftUpCell === null) {
      leftUpCell = [currentPositionRow + i, currentPositionColumn + i];
    }
    rightDownCell = [currentPositionRow + i, currentPositionColumn + i];
  }

  function convertByRule(...args) {
    const result = [];
    args.forEach((arg) => {
      if (arg < 0) {
        result.push(0);
      } else if (arg >= boardSize) {
        result.push(boardSize - 1);
      } else {
        result.push(arg);
      }
    });
    return result;
  }

  leftUpCell = convertByRule(...leftUpCell);
  rightDownCell = convertByRule(...rightDownCell);

  for (let i = leftUpCell[0]; i <= rightDownCell[0]; i += 1) {
    for (let j = leftUpCell[1]; j <= rightDownCell[1]; j += 1) {
      arraAvailableAttackOptions.push(board[i][j]);
    }
  }

  arrAvailableMoves = arrAvailableMoves.filter((p) => position !== p);
  arraAvailableAttackOptions = arraAvailableAttackOptions.filter((p) => position !== p);

  return [arrAvailableMoves, arraAvailableAttackOptions];
}

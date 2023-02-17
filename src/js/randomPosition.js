let availableCells = [];
export default function randomPosition(availableColumns, last, boardSize) {
  if (!availableCells.length) {
    for (let i = 0; i < availableColumns.length; i += 1) {
      for (let j = 0; j < boardSize; j += 1) {
        availableCells.push(j * boardSize + availableColumns[i]);
      }
    }
  }

  const ramdomIndex = Math.floor((Math.random() * availableCells.length));
  const ramdomPosition = availableCells[ramdomIndex];
  availableCells.splice(ramdomIndex, 1);

  if (last) {
    availableCells = [];
  }

  return ramdomPosition;
}

import availableMoves from '../availableMoves';

test('test 1 function availableMoves', () => {
  const availableCellsForTheMove = availableMoves(2, 2, 14, 6)[0];
  const arrRight = [2, 12, 0, 24, 8, 13, 7, 19, 20, 15, 21, 9, 26, 16, 28, 4];

  expect(availableCellsForTheMove).toEqual(arrRight);
});

test('test 2 function availableMoves', () => {
  const availableCellsForTheMove = availableMoves(4, 2, 0, 8)[0];
  const arrRight = [8, 1, 9, 16, 2, 18, 24, 3, 27, 32, 4, 36];

  expect(availableCellsForTheMove).toEqual(arrRight);
});

test('test 3 function availableMoves', () => {
  const availableCellsForTheMove = availableMoves(4, 2, 49, 8)[0];
  const arrRight = [17, 25, 33, 41, 48, 40, 56, 57, 50, 58, 42, 51, 35, 52, 28, 53, 21];

  expect(availableCellsForTheMove).toEqual(arrRight);
});

test('test 4 function availableMoves', () => {
  const availableCellsForTheAttack = availableMoves(4, 2, 49, 8)[1];
  const arrRight = [32, 33, 34, 35, 40, 41, 42, 43, 48, 50, 51, 56, 57, 58, 59];

  expect(availableCellsForTheAttack).toEqual(arrRight);
});

test('test 4 function availableMoves', () => {
  const availableCellsForTheAttack = availableMoves(2, 4, 0, 8)[1];
  const arrRight = [
    1, 2, 3, 4, 8, 9, 10, 11, 12,
    16, 17, 18, 19, 20,
    24, 25, 26, 27, 28,
    32, 33, 34, 35, 36];

  expect(availableCellsForTheAttack).toEqual(arrRight);
});

import { calcTileType } from '../utils';

test.each([
  ['test calcTileType 1', [0, 8], 'top-left'],
  ['test calcTileType 2', [1, 7], 'top'],
  ['test calcTileType 3', [8, 8], 'left'],
  ['test calcTileType 4', [56, 8], 'bottom-left'],
  ['test calcTileType 5', [7, 8], 'top-right'],
  ['test calcTileType 6', [23, 8], 'right'],
  ['test calcTileType 7', [63, 8], 'bottom-right'],
  ['test calcTileType 8', [59, 8], 'bottom'],
  ['test calcTileType 9', [27, 8], 'center'],
])('%s', (testName, data, rigthResult) => {
  expect(calcTileType(...data)).toBe(rigthResult);
});

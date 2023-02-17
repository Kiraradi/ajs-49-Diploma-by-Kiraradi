import createTooltip from '../createTooltip';
import Bowman from '../characters/Bowman';
import Magician from '../characters/Magician';

test('test 1 function createTooltip', () => {
  const bowmanCharacter = new Bowman(1);
  const result = createTooltip(bowmanCharacter);
  const resultRight = '🎖1⚔25 🛡 25 ❤50';
  expect(result).toBe(resultRight);
});

test('test 2 function createTooltip', () => {
  const magicianCharacter = new Magician(1);
  const result = createTooltip(magicianCharacter);
  const resultRight = '🎖1⚔10 🛡 40 ❤50';
  expect(result).toBe(resultRight);
});

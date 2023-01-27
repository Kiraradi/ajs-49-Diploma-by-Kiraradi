/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
import Bowman from "./characters/Bowman";
import Magician from "./characters/Magician";
import Daemon from "./characters/Daemon";
import Swordsman from "./characters/Swordsman";
import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";

export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const randomType = allowedTypes[Math.floor(Math.random() * ((allowedTypes.length -1) - 0 + 1) + 0)];
    const randomLevel = Math.floor(Math.random() * (maxLevel - 1 + 1) + 1)
    if (randomType === 'Bowman') {
      yield new Bowman(randomLevel);
    } else if (randomType === 'Magician') {
      yield new Magician(randomLevel);
    } else if (randomType === 'Swordsman') {
      yield new Swordsman(randomLevel);
    } else if (randomType === 'Daemon') {
      yield new Daemon(randomType);
    } else if (randomType === 'Vampire') {
      yield new Vampire(randomLevel);
    } else if (randomType === 'Undead') {
      yield new Undead(randomLevel);
    }
  }
  // TODO: write logic here
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
}

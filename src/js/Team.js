/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  // TODO: write your logic here
  constructor(arg) {
    this.characters = new Set();
    this.add(arg);
  }

  add(args) {
    if (args.length < 1) {
      throw new Error('No arguments were passed to the constructor of the Team class');
    }
    args.forEach((character) => {
      this.characters.add(character);
    });
  }

  toArray() {
    if (this.characters.size < 1) {
      throw new Error('В команде нет персонажей');
    }
    const arrayMembers = [];
    this.characters.forEach((character) => {
      arrayMembers.push(character);
    });
    return arrayMembers;
  }
}

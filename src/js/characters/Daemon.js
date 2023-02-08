import Character from '../Character';

export default class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');
    this.attack = 10;
    this.defence = 10;
    this.rangeTravel = 1;
    this.rangeAttacks = 4;
  }
}

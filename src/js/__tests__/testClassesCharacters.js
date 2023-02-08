import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
import Character from '../Character';

test('test ad new class Bowman', () => {
  const persomBowman = new Bowman(1);

  const reghtPersonBowman = {
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'bowman',
    rangeTravel: 2,
    rangeAttacks: 2,
  };
  expect(persomBowman).toEqual(reghtPersonBowman);
});

test('test ad new class Daemon', () => {
  const persomDaemon = new Daemon(1);

  const reghtPersonDaemon = {
    level: 1,
    attack: 10,
    defence: 10,
    health: 50,
    type: 'daemon',
    rangeTravel: 1,
    rangeAttacks: 4,
  };
  expect(persomDaemon).toEqual(reghtPersonDaemon);
});

test('test ad new class Magician', () => {
  const persomMagician = new Magician(1);

  const reghtPersonMagician = {
    level: 1,
    attack: 10,
    defence: 40,
    health: 50,
    type: 'magician',
    rangeTravel: 1,
    rangeAttacks: 4,
  };
  expect(persomMagician).toEqual(reghtPersonMagician);
});

test('test ad new class Swordsman', () => {
  const persomSwordsman = new Swordsman(1);

  const reghtPersonSwordsman = {
    level: 1,
    attack: 40,
    defence: 10,
    health: 50,
    type: 'swordsman',
    rangeTravel: 4,
    rangeAttacks: 1,
  };
  expect(persomSwordsman).toEqual(reghtPersonSwordsman);
});

test('test ad new class Undead', () => {
  const persomUndead = new Undead(1);

  const reghtPersonUndead = {
    level: 1,
    attack: 40,
    defence: 10,
    health: 50,
    type: 'undead',
    rangeTravel: 4,
    rangeAttacks: 1,
  };
  expect(persomUndead).toEqual(reghtPersonUndead);
});

test('test ad new class Vampire', () => {
  const persomVampire = new Vampire(1);

  const reghtPersonVampire = {
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'vampire',
    rangeTravel: 2,
    rangeAttacks: 2,
  };
  expect(persomVampire).toEqual(reghtPersonVampire);
});

test('test ad new class Character', () => {
  expect(() => {
    /* eslint-disable-next-line no-new */
    new Character(1);
  }).toThrow();
});

import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Swordsman from './characters/Swordsman';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';

export default function returnTheDesiredPrototype(type) {
  let returnPrototype;
  switch (type) {
    case 'bowman':
      returnPrototype = new Bowman(1).__proto__;
      break;
    case 'magician':
      returnPrototype = new Magician(1).__proto__;
      break;
    case 'daemon':
      returnPrototype = new Daemon(1).__proto__;
      break;
    case 'swordsman':
      returnPrototype = new Swordsman(1).__proto__;
      break;
    case 'vampire':
      returnPrototype = new Vampire(1).__proto__;
      break;
    case 'Undead':
      returnPrototype = new Undead(1).__proto__;
      break;
  }

  return returnPrototype;
}

export default class GameState {
  static from(object) {
    if (object.moveStatus === 'player') {
      object.moveStatus = 'enemy';
    } else if (object.moveStatus === 'enemy') {
      object.moveStatus = 'player';
    }
    // TODO: create object
    return object;
  }
}

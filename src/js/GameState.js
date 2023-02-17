export default class GameState {
  static from(object) {
    if (object.gameLevel > 4) {
      object.state = 'gameOver';
    }
    return object;
  }
}

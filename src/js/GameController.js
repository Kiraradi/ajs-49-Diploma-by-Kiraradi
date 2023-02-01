import GamePlay from './GamePlay';
import themes from './themes';
import Team from './Team';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi('prairie');
    const playerTeam = new Team(generateTeam(['Bowman', 'Swordsman', 'Magician '], 1, 2));
    const enemyTeam = new Team(generateTeam(['Vampire', 'Undead', 'Daemon'], 1, 2));

    let availableCells = [];
    const randomPosition = (availableColumns, last) => {
      if (!availableCells.length) {
        for (let i = 0; i < availableColumns.length; i++) {
          for (let j = 0; j < this.gamePlay.boardSize; j++) {
            availableCells.push(j * this.gamePlay.boardSize + availableColumns[i]);
          }
        }  
      }

      const ramdomIndex = Math.floor((Math.random()*availableCells.length));
      const ramdomPosition = availableCells[ramdomIndex];
      availableCells.splice(ramdomIndex, 1);
      
      if (last) {
        availableCells = [];
      }

      return ramdomPosition;
    }

    const arrAllTeams = playerTeam.toArray().map(
      (character, index) => new PositionedCharacter(character, randomPosition([0, 1], playerTeam.characters.size - 1 == index))).concat(
      enemyTeam.toArray().map((character, index) => new PositionedCharacter(character, randomPosition([6, 7], playerTeam.characters.size - 1 == index))),
    );

    this.gamePlay.redrawPositions(arrAllTeams);

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}

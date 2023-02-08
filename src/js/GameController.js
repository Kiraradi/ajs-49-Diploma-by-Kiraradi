import Team from './Team';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';
import cursors from './cursors';
import availableMoves from './availableMoves';
import createTooltip from './createTooltip';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.selectedCharacter = this.gamePlay.cells.findIndex((ind) => ind.classList.contains('selected-yellow'));
  }

  init() {
    this.gamePlay.drawUi('prairie');
    const playerTeam = new Team(generateTeam(['Magician', 'Swordsman', 'Bowman'], 1, 2));
    const enemyTeam = new Team(generateTeam(['Vampire', 'Undead', 'Daemon'], 1, 2));

    let availableCells = [];
    const randomPosition = (availableColumns, last) => {
      if (!availableCells.length) {
        for (let i = 0; i < availableColumns.length; i += 1) {
          for (let j = 0; j < this.gamePlay.boardSize; j += 1) {
            availableCells.push(j * this.gamePlay.boardSize + availableColumns[i]);
          }
        }
      }

      const ramdomIndex = Math.floor((Math.random() * availableCells.length));
      const ramdomPosition = availableCells[ramdomIndex];
      availableCells.splice(ramdomIndex, 1);

      if (last) {
        availableCells = [];
      }

      return ramdomPosition;
    };

    this.arrAllTeams = playerTeam.toArray().map(
      (character, index) => new PositionedCharacter(
        character,
        randomPosition(
          [0, 1],
          playerTeam.characters.size - 1 === index,
        ),
      ),
    ).concat(
      enemyTeam.toArray().map((character, index) => new PositionedCharacter(
        character,
        randomPosition(
          [6, 7],
          playerTeam.characters.size - 1 === index,
        ),
      )),
    );

    this.gamePlay.redrawPositions(this.arrAllTeams);

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));

    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  onCellClick(index) {
    /* eslint-disable-next-line no-restricted-globals */
    const player = event.currentTarget.firstElementChild;
    if (player !== null) {
      if (this.selectedCharacter !== -1) {
        this.gamePlay.deselectCell(this.selectedCharacter);
      }
      if (/bowman|swordsman|magician/.test(player.className)) {
        this.selectedCharacter = index;
        this.gamePlay.selectCell(index);
        const character = this.arrAllTeams.find((ind) => ind.position === index).character || null;

        if (character !== null) {
          [this.arrayAvailableCells, this.arrayAvailableCellsAttack] = availableMoves(
            character.rangeTravel,
            character.rangeAttacks,
            index,
            this.gamePlay.boardSize,
          );          
        }
      }
       else {
        GamePlay.showError('enemy');
      }
      
    }

    if(this.arrayAvailableCells.includes(index) && player === null ) {
      const movingCharacter = this.arrAllTeams.findIndex((ind) => ind.position === this.selectedCharacter);
      if (movingCharacter >= 0) {
        this.arrAllTeams[movingCharacter].position = index;
        this.gamePlay.deselectCell(this.selectedCharacter);
        this.selectedCharacter = index;
        this.gamePlay.redrawPositions(this.arrAllTeams);
        this.onCellClick(index);
      }
    }
  }

  onCellEnter(index) {
    if (this.selectedCharacter === -1) {
      /* eslint-disable-next-line no-restricted-globals */
      event.currentTarget.style.cursor = cursors.notallowed;
      /* eslint-disable-next-line no-restricted-globals */
    } else if (this.arrayAvailableCells.includes(index) && !event.currentTarget.hasChildNodes()) {
      /* eslint-disable-next-line no-restricted-globals */
      event.currentTarget.style.cursor = cursors.pointer;
      this.gamePlay.selectCell(index, 'green');
    } else {
      /* eslint-disable-next-line no-restricted-globals */
      event.currentTarget.style.cursor = cursors.notallowed;
    }
    /* eslint-disable-next-line no-restricted-globals */
    if (event.currentTarget.hasChildNodes()) {
      const character = this.arrAllTeams.find((ind) => ind.position === index).character || null;

      if (character) {
        const message = createTooltip(character);
        this.gamePlay.showCellTooltip(message, index);

        if (/bowman|swordsman|magician/.test(character.type)) {
          /* eslint-disable-next-line no-restricted-globals */
          event.currentTarget.style.cursor = cursors.pointer;
        } else if (/vampire|undead|daemon/.test(character.type)) {
          if (this.arrayAvailableCellsAttack && this.arrayAvailableCellsAttack.includes(index)) {
            /* eslint-disable-next-line no-restricted-globals */
            event.currentTarget.style.cursor = cursors.crosshair;
          }
        }
      }
    }
  }

  onCellLeave(index) {
    /* eslint-disable-next-line no-restricted-globals */
    if (event.currentTarget.hasChildNodes()) {
      this.gamePlay.hideCellTooltip(index);
    }

    if (index !== this.selectedCharacter) {
      this.gamePlay.deselectCell(index);
    }
  }
}

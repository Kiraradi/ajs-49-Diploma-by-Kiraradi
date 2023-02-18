import Team from './Team';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';
import cursors from './cursors';
import availableMoves from './availableMoves';
import createTooltip from './createTooltip';
import GameState from './GameState';
import themes from './themes';
import randomPosition from './randomPosition';
import returnTheDesiredPrototype from './returnTheDesiredPrototype';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.selectedCharacter = this.gamePlay.cells.findIndex((ind) => ind.classList.contains('selected-yellow'));
    this.gameState = null;
  }

  init() {
    if (this.gameState === null) {
      this.gameState = GameState.from({
        gameLevel: 1,
        state: 'active',
        balls: 0,
        loadSave: false,
      });
    }
    if (this.gameState.state === 'active') {
      this.gamePlay.drawUi(themes[this.gameState.gameLevel]);
      if (!this.gameState.loadSave) {
        if (this.gameState.gameLevel === 1) {
          const playerTeam = new Team(generateTeam(['Magician', 'Swordsman', 'Bowman'], 1, 2));
          const enemyTeam = new Team(generateTeam(['Vampire', 'Undead', 'Daemon'], 1, 2));

          this.lightTeam = playerTeam.toArray().map((character, index) => new PositionedCharacter(
            character,
            randomPosition(
              [0, 1],
              playerTeam.characters.size - 1 === index,
              this.gamePlay.boardSize,
            ),
          ));

          this.darkTeam = enemyTeam.toArray().map((character, index) => new PositionedCharacter(
            character,
            randomPosition(
              [6, 7],
              enemyTeam.characters.size - 1 === index,
              this.gamePlay.boardSize,
            ),
          ));
          this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
          this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));

          this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
          this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
          this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
          this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
        } else {
          const playerTeam = new Team(generateTeam(['Magician', 'Swordsman', 'Bowman'], 1, 2));
          for (let i = 0; i < this.gameState.gameLevel - 1; i += 1) {
            playerTeam.toArray().forEach((character) => character.levelUp());
          }
          this.lightTeam.forEach((element) => {
            playerTeam.add([element.character]);
          });
          this.lightTeam = playerTeam.toArray().map((character, index) => new PositionedCharacter(
            character,
            randomPosition(
              [0, 1],
              playerTeam.characters.size - 1 === index,
              this.gamePlay.boardSize,
            ),
          ));
          const enemyTeam = new Team(generateTeam(['Vampire', 'Undead', 'Daemon'], 1, this.lightTeam.length));
          for (let i = 0; i < this.gameState.gameLevel - 1; i += 1) {
            enemyTeam.toArray().forEach((character) => character.levelUp());
          }
          this.darkTeam = enemyTeam.toArray().map((character, index) => new PositionedCharacter(
            character,
            randomPosition(
              [6, 7],
              enemyTeam.characters.size - 1 === index,
              this.gamePlay.boardSize,
            ),
          ));
        }

        this.arrAllTeams = this.lightTeam.concat(this.darkTeam);
        this.gameState.allTeams = this.arrAllTeams;
      } else {
        this.arrAllTeams = this.gameState.allTeams;
      }

      this.gamePlay.redrawPositions(this.arrAllTeams);
      this.gameState.loadSave = false;
    }
  }

  onCellClick(index) {
    if (this.gameState.state === 'active') {
      /* eslint-disable-next-line no-restricted-globals */
      const player = event.currentTarget.firstElementChild;
      if (player !== null) {
        this.splitByTeams();
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
        } else if (/vampire|undead|daemon/.test(player.className) && this.selectedCharacter > 0) {
          if (this.arrayAvailableCellsAttack.includes(index)) {
            const attackerIndex = this.arrAllTeams.findIndex((ind) => ind.position === this.selectedCharacter);
            const targetIndex = this.arrAllTeams.findIndex((ind) => ind.position === index);

            if (attackerIndex >= 0 && targetIndex >= 0) {
              const attacker = this.arrAllTeams[attackerIndex].character;
              const target = this.arrAllTeams[targetIndex].character;
              const damage = Math.floor(Math.max(attacker.attack - target.defence, attacker.attack * 0.1));
              target.health -= damage;

              this.gamePlay.showDamage(index, damage).then(() => {
                this.checkingTheVictoryConditions();
                this.feindlicheAktion();
                this.gamePlay.redrawPositions(this.arrAllTeams);
              });
            }
            this.gamePlay.selectCell(this.selectedCharacter);
          } else {
            GamePlay.showError('enemy');
          }
        }
      }

      if (this.selectedCharacter >= 0 && this.arrayAvailableCells.includes(index) && player === null) {
        const movingCharacter = this.arrAllTeams.findIndex((ind) => ind.position === this.selectedCharacter);
        if (movingCharacter >= 0) {
          this.arrAllTeams[movingCharacter].position = index;
          this.gamePlay.deselectCell(this.selectedCharacter);
          this.selectedCharacter = index;
          this.gamePlay.redrawPositions(this.arrAllTeams);
          this.onCellClick(index);
          this.checkingTheVictoryConditions();
          this.feindlicheAktion();
        }
      }
      this.gameState.allTeams = this.arrAllTeams;
    }
  }

  onCellEnter(index) {
    if (this.gameState.state === 'active') {
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
            if (this.arrayAvailableCellsAttack && this.arrayAvailableCellsAttack.includes(index) && this.selectedCharacter > 0) {
              /* eslint-disable-next-line no-restricted-globals */
              event.currentTarget.style.cursor = cursors.crosshair;
              this.gamePlay.selectCell(index, 'red');
            }
          }
        }
      }
    }
  }

  onCellLeave(index) {
    if (this.gameState.state === 'active') {
      /* eslint-disable-next-line no-restricted-globals */
      if (event.currentTarget.hasChildNodes()) {
        this.gamePlay.hideCellTooltip(index);
      }

      if (index !== this.selectedCharacter) {
        this.gamePlay.deselectCell(index);
      }
    }
  }

  // Computerlogik
  feindlicheAktion() {
    if (this.darkTeam.length > 0 && this.lightTeam.length > 0) {
      const darkCharacterIndex = this.darkTeam[Math.floor(Math.random() * this.darkTeam.length)].position;
      const darkCharacter = this.arrAllTeams.findIndex((ind) => ind.position === darkCharacterIndex);

      const [arrayAvailableCellsDC, arrayAvailableCellsAttackDC] = availableMoves(
        this.arrAllTeams[darkCharacter].character.rangeTravel,
        this.arrAllTeams[darkCharacter].character.rangeAttacks,
        darkCharacterIndex,
        this.gamePlay.boardSize,
      );
      const characterToAttack = this.lightTeam.find((element) => arrayAvailableCellsAttackDC.includes(element.position)) || null;

      if (characterToAttack) {
        const attacker = this.arrAllTeams[darkCharacter].character;
        const target = this.arrAllTeams[this.arrAllTeams.findIndex(
          (ind) => ind.position === characterToAttack.position,
        )].character;
        const damage = Math.floor(Math.max(attacker.attack - target.defence, attacker.attack * 0.1));
        target.health -= damage;
        this.gamePlay.showDamage(characterToAttack.position, damage).then(() => {
          this.gamePlay.redrawPositions(this.arrAllTeams);
        });
      } else {
        const nextCell = calculationNextCell(this.arrAllTeams);
        function calculationNextCell(arrAllTeams) {
          let randomCell = arrayAvailableCellsDC[Math.floor(Math.random() * arrayAvailableCellsDC.length)];
          if (arrAllTeams.some((elem) => elem.position === randomCell)) {
            randomCell = calculationNextCell(arrAllTeams);
          }
          return randomCell;
        }
        this.arrAllTeams[darkCharacter].position = nextCell;
        this.gamePlay.redrawPositions(this.arrAllTeams);
      }
      this.splitByTeams();
      this.checkingTheVictoryConditions();
      this.gameState.allTeams = this.arrAllTeams;
    }
  }

  checkingTheVictoryConditions() {
    const deadCharacter = this.arrAllTeams.findIndex((element) => element.character.health <= 0);
    if (deadCharacter >= 0) {
      if (this.arrAllTeams[deadCharacter].position === this.selectedCharacter) {
        this.gamePlay.deselectCell(this.arrAllTeams[deadCharacter].position);
        this.selectedCharacter = -1;
      }

      this.gamePlay.hideCellTooltip(this.arrAllTeams[deadCharacter].position);
      this.gamePlay.deselectCell(this.arrAllTeams[deadCharacter].position);
      this.arrAllTeams.splice(deadCharacter, 1);
      this.gameState.allTeams = this.arrAllTeams;
      this.gamePlay.redrawPositions(this.arrAllTeams);
    }
    this.splitByTeams();
    if (this.lightTeam.length <= 0) {
      this.gameState.state = 'gameOver';
    }
    if (this.darkTeam <= 0) {
      this.arrAllTeams.forEach((element) => {
        element.character.levelUp();
      });
      this.gameState.gameLevel += 1;
      if (this.gameState.gameLevel > 4) {
        this.gameState.state = 'gameOver';
      }
      this.init();
    }
  }

  splitByTeams() {
    this.darkTeam = [];
    this.lightTeam = [];
    this.arrAllTeams.forEach((element) => {
      if (/vampire|undead|daemon/.test(element.character.type)) {
        this.darkTeam.push(element);
      } else {
        this.lightTeam.push(element);
      }
    });
  }

  onNewGameClick() {
    this.gameState = null;
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.newGameListeners = [];
    this.gamePlay.saveGameListeners = [];
    this.gamePlay.loadGameListeners = [];
    this.init();
  }

  onSaveGameClick() {
    this.stateService.save(this.gameState);
  }

  onLoadGameClick() {
    this.gameState = this.stateService.load();
    this.gameState.allTeams.forEach((element) => {
      const proto = returnTheDesiredPrototype(element.character.type);
      element.character.__proto__ = proto;
    });
    this.gameState.loadSave = true;

    this.init();
  }
}

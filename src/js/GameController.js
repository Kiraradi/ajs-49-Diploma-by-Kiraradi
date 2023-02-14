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
      } else if(/vampire|undead|daemon/.test(player.className) && this.selectedCharacter > 0) {
        if (this.arrayAvailableCellsAttack.includes(index)) {

          const attackerIndex = this.arrAllTeams.findIndex((ind) => ind.position === this.selectedCharacter);
          const targetIndex = this.arrAllTeams.findIndex((ind) => ind.position === index);

          if (attackerIndex >=0 && targetIndex >= 0) {
            const attacker = this.arrAllTeams[attackerIndex].character;
            const target = this.arrAllTeams[targetIndex].character;
            const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
            target.health -= damage;

            this.gamePlay.showDamage(index,damage).then(()=>{
              this.gamePlay.redrawPositions(this.arrAllTeams); 
              this.checkingTheVictoryConditions();            
              this.feindlicheAktion();
              console.log('person');
            });
          };
          this.gamePlay.selectCell(this.selectedCharacter);
        } else {
        GamePlay.showError('enemy');
      }
      }
    }

    if(this.selectedCharacter >= 0 && this.arrayAvailableCells.includes(index) && player === null) {
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
          if (this.arrayAvailableCellsAttack && this.arrayAvailableCellsAttack.includes(index) && this.selectedCharacter > 0) {
            /* eslint-disable-next-line no-restricted-globals */
            event.currentTarget.style.cursor = cursors.crosshair;
            this.gamePlay.selectCell(index, 'red');
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
  //Computerlogik
  feindlicheAktion() {

    if (this.darkTeam.length > 0 && this.lightTeam.length > 0) {
      const darkCharacterIndex = this.darkTeam[Math.floor(Math.random() * this.darkTeam.length)];
    const darkCharacter = this.arrAllTeams.findIndex((ind) => ind.position === darkCharacterIndex);

    const [arrayAvailableCellsDC, arrayAvailableCellsAttackDC] = availableMoves(
      this.arrAllTeams[darkCharacter].character.rangeTravel,
      this.arrAllTeams[darkCharacter].character.rangeAttacks,
      darkCharacterIndex,
      this.gamePlay.boardSize,
    ); 
    const characterToAttackInd = this.lightTeam.find((element) => {
      return arrayAvailableCellsAttackDC.includes(element);
    })|| null;

    if(characterToAttackInd) {
      const attacker =  this.arrAllTeams[darkCharacter].character
      const target = this.arrAllTeams[this.arrAllTeams.findIndex(
        (ind) => ind.position === characterToAttackInd
        )].character;
      const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
      target.health -= damage;
      this.gamePlay.showDamage(characterToAttackInd,damage).then(()=>{
        this.gamePlay.redrawPositions(this.arrAllTeams);
        
      });
    } else {
      const nextCell = calculationNextCell(this.arrAllTeams);
      function calculationNextCell(arrAllTeams) {
        let randomCell = arrayAvailableCellsDC[Math.floor(Math.random() * arrayAvailableCellsDC.length)]
        if (arrAllTeams.some(elem => elem.position === randomCell)) {
          randomCell = calculationNextCell(arrAllTeams);
        }
        return randomCell
      }
      this.arrAllTeams[darkCharacter].position = nextCell;
      this.gamePlay.redrawPositions(this.arrAllTeams);
    }
    this.splitByTeams();
  } 

  this.checkingTheVictoryConditions();
    }

  checkingTheVictoryConditions() {
    const deadCharacter =  this.arrAllTeams.findIndex(element => element.character.health <= 0)
    if (deadCharacter >= 0) {
      if (this.arrAllTeams[deadCharacter].position === this.selectedCharacter) {
        this.gamePlay.deselectCell(this.arrAllTeams[deadCharacter].position);
        this.selectedCharacter = -1;
      }
      
      this.gamePlay.hideCellTooltip(this.arrAllTeams[deadCharacter].position);
      this.arrAllTeams.splice(deadCharacter,1);
      this.gamePlay.redrawPositions(this.arrAllTeams);
    }
    this.splitByTeams();
    if (this.lightTeam.length <= 0) {
      console.log('you dead');
      this.gameOver();
    }
    if(this.darkTeam <= 0) {
      console.log('you win');
      this.arrAllTeams.forEach(element => {
        element.character.levelUp();
      })
      
    }
    //console.log(this.darkTeam, this.lightTeam, this.arrAllTeams)
  }

 

  splitByTeams () {
    this.darkTeam = [];
    this.lightTeam = [];
    this.arrAllTeams.forEach((element)=> {
      if(/vampire|undead|daemon/.test(element.character.type)) {
        this.darkTeam.push(element.position)
      } else {
        this.lightTeam.push(element.position)
      }
    });
  }

  newGame() {

  }

  gameOver() {   
    /*Array.from(this.gamePlay.boardEl.children).forEach(element => {
      element.removeEventListener('click',this.gamePlay.onCellClick);
      element.removeEventListener('mouseleave',this.gamePlay.onCellLeave);
      element.removeEventListener('mouseenter',this.gamePlay.onCellEnter);
    })*/
    console.log(this.gamePlay.boardEl.children)
  }
}

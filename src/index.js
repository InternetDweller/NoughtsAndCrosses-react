import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/styles.css';
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";

// Состояние для отдельной клетки поля
class CellState {
  letter = '';

  constructor() {
    makeAutoObservable(this);
  };

  // Заполнение клетки
  setNew() {
    // В уже заполненную клетку поставить нельзя
    if (this.letter !== '') return;

    switch(curPlayer.player) {
      case 'X':
        this.letter = 'X';
        curPlayer.switchPlayer();
        break;
      case 'O':
        this.letter = 'O';
        curPlayer.switchPlayer();
        break;
      default: break;
    };

    // На каждом ходе проверка на окончание игры
    checkGameEnd();
  };

  // Очистка поля
  reset() {
    this.letter = '';
  };

  // Блокировка поля
  lock() {
    this.letter = ' ';
  };
};

// Состояние для текущего игрока
class PlayerState {
  player = 'X';
  resMessage = 'Играем...';

  constructor() {
    makeAutoObservable(this);
  };

  // Изменить игрока на желаемого
  setPlayer(newPl) {
    this.player = newPl;
  };

  // Изменить игрока циклично
  switchPlayer() {
    switch(this.player) {
      case 'X':
        this.player = 'O';
        break;
      case 'O':
        this.player = 'X';
        break;
      default: break;
    };
  };
};

// Проверка на победу одного из игроков
function checkVictory(letter) {
  if ((cells[1].letter === letter && cells[2].letter === letter && cells[3].letter === letter) ||
      (cells[4].letter === letter && cells[5].letter === letter && cells[6].letter === letter) ||
      (cells[7].letter === letter && cells[8].letter === letter && cells[9].letter === letter) ||
      (cells[1].letter === letter && cells[4].letter === letter && cells[7].letter === letter) ||
      (cells[2].letter === letter && cells[5].letter === letter && cells[8].letter === letter) ||
      (cells[3].letter === letter && cells[6].letter === letter && cells[9].letter === letter) ||
      (cells[1].letter === letter && cells[5].letter === letter && cells[9].letter === letter) ||
      (cells[3].letter === letter && cells[5].letter === letter && cells[7].letter === letter)
  ) {
    return letter;
  };
  return '';
};

// Проверка на ничью
function checkTie() {
  let fieldIsNotFull = false;
  cells.forEach(item => {
    fieldIsNotFull ||= (item.letter === '');
  });
  console.log(fieldIsNotFull);
  if (!fieldIsNotFull) {
    return true;
  };
  return false;
};

// Проверка, окончена ли игра
function checkGameEnd() {
  if (checkTie()) {
    curPlayer.resMessage = 'Ничья!';
  };

  if (checkVictory('O') !== '') {
    curPlayer.resMessage = 'O победил!';
    curPlayer.setPlayer('O');
    lock();
  };

  if (checkVictory('X') !== '') {
    curPlayer.resMessage = 'X победил!';
    curPlayer.setPlayer('X');
    lock();
  };
};

// Кто ходит первым
const curPlayer = new PlayerState();

// Массив со всеми клетками
const cells = [];
for (let i = 1; i <= 9; i++) {
    const newCell = new CellState();
    cells[i] = newCell;
};

// Рестарт игры
function restart() {
    cells.forEach(item => {
        item.reset();
    });
    curPlayer.resMessage = 'Играем...';
};

// Блокировка поля от дальнейшей расстановки
function lock() {
    cells.forEach(item => {
        if (item.letter === '') item.lock();
    });
};

function Button(props) {
    return (
        <button onClick={props.onClick} className={props.className}>{props.content}</button>
    );
};

// Компонент игрового поля
function Cells() {
    return(<div>
        <table><tbody>
            <tr>
                <td><CellObserver cell={cells[1]}/></td>
                <td><CellObserver cell={cells[2]}/></td>
                <td><CellObserver cell={cells[3]}/></td>
            </tr>
            <tr>
                <td><CellObserver cell={cells[4]}/></td>
                <td><CellObserver cell={cells[5]}/></td>
                <td><CellObserver cell={cells[6]}/></td>
            </tr>
            <tr>
                <td><CellObserver cell={cells[7]}/></td>
                <td><CellObserver cell={cells[8]}/></td>
                <td><CellObserver cell={cells[9]}/></td>
            </tr>
        </tbody></table>
    </div>);
};

// Отображение результатов матча
function ResultsBlock() {
  return(
    <div className='resBlock'>
      <MessageObserver />
    </div>
  );
};

// Отображение и синхронизация клетки поля с буквой
const CellObserver = observer(({cell}) => (
    <div className="cellStyle" onClick={() => cell.setNew()}>{cell.letter}</div>
));

// Отображение и синхронизация текущего игрока
const PlayerObserver = observer(() => (
  <div className='turn'>- Ходит {curPlayer.player} -</div>
));

// Отображение и синхронизация сообщения о результатах
const MessageObserver = observer(() => (
  <div>{curPlayer.resMessage}</div>
));

function App() {
    return (
        <div className='App'>
            <h2>Крестики-нолики на React</h2>
            <PlayerObserver />
            <Cells />
            <Button onClick={restart} content="Заново"/>
            <ResultsBlock />
        </div>
    );
};
ReactDOM.createRoot(document.querySelector('#root')).render(<App />);
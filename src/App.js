import { useState } from 'react';
import './App.css';

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const [isReverse, setIsReversed] = useState(false);
  const [historyRev, setHistoryRev] = useState([Array(9).fill(null)]);
  const [locationHistory, setLocationHistroy] = useState([Array(10).fill(null)]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);

    const slicedHistory = history.slice(0, currentMove + 1);
    slicedHistory.push(nextSquares);
    let slicedHistoryRev = [];
    for (let i = 0; i < slicedHistory.length; i++) {
      slicedHistoryRev.push([slicedHistory[slicedHistory.length - 1 - i]]);
    }
    const nextHistoryRev = slicedHistoryRev;
    setHistoryRev(nextHistoryRev);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function reverse() {
    setIsReversed(!isReverse);
  }

  locationHistory[currentMove] = findChangeInHistory(currentMove, history);

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <>
        <li key={move}>
          {move !== currentMove
            ?
            <>
              <button className="btn" onClick={() => jumpTo(move)}> {description}  </button>
              {locationHistory[move] && move > 0 && (
                <p>
                  {'Move at location: [' + locationHistory[move][0] + ',' + locationHistory[move][1] + ']'}
                </p>
              )}
            </>
            :
            <>
              <b> You are at the move #{move} </b>
              {locationHistory[move] && move > 0 && (
                <p>
                  {'Move at location: [' + locationHistory[move][0] + ',' + locationHistory[move][1] + ']'}
                </p>
              )}
            </>
          }
        </li>
      </>
    );

  });

  const movesRev = historyRev.map((squares, index) => {
    index = historyRev.length - index - 1;
    let description;
    if (index > 0) {
      description = 'Rev Go to move #' + index;
    } else {
      description = 'Rev Go to game start';
    }

    return (
      <li key={index}>
        {index !== currentMove
          ?
          <>
            <button className="btn" onClick={() => jumpTo(index)}> {description}  </button>
            {locationHistory[index] && index > 0 && (
              <p>
                {'Move at location: [' + locationHistory[index][0] + ',' + locationHistory[index][1] + ']'}
              </p>
            )}
          </>
          :
          <>
            <b> You are at the move #{index} </b>
            {locationHistory[index] && index > 0 && (
              <p>
                {'Move at location: [' + locationHistory[index][0] + ',' + locationHistory[index][1] + ']'}
              </p>
            )}
          </>
        }
      </li>
    );

  });

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className="game-info">
        <button className="btn" onClick={() => reverse()}> Reverse list </button>
        {
          isReverse
            ?
            (<ol reversed>{movesRev}</ol>)
            :
            (<ol>{moves}</ol>)
        }
      </div>
    </div>
  );
}

function findChangeInHistory(currentMove, history) {
  let location = [null, null];
  if (currentMove === 0) {
    return location;
  }

  for (var i = 0; i < 9; i++) { // lece po historii
    if (history[currentMove][i] !== history[currentMove - 1][i]) { //porownuje boardy w historii
      let index = i;                                    //(0, 1, 2, 3, 4, 5, 6, 7, 8)
      const row = Math.floor(index / 3);  //(0, 0, 0, 1, 1, 1, 2, 2, 2)
      const col = index % 3;              //(0, 1, 2, 0, 1, 2, 0, 1, 2)
      let result = [row, col];
      return result;
    }
  }
  return location;
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(index) {
    if (squares[index] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[index] = "X";
    } else {
      nextSquares[index] = "O";
    }
    onPlay(nextSquares);
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner.sign;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    if (currentMove === 9) {
      status = 'DRAW';
    }
  }

  function renderBoard() {
    let patternIndex = calculateWinner(squares)?.index;
    let squaresToHighlight = calculateRowAndColumn(patternIndex);

    const board = [];
    for (let i = 0; i < 3; i++) {
      board.push(
        //Warning: Each child in a list should have a unique "key" prop. FIXED by adding key here
        <div className="board-row" key={i}>
          {renderRow(i, squaresToHighlight)}
        </div>
      );
    }
    return (
      board
    );
  }

  function renderRow(i, squaresToHighlight) { //i == row nr, j = column nr (form 0 to 2)
    const row = [];
    for (let j = 0; j < 3; j++) {
      let positionHighlight = [null, null];
      squaresToHighlight.forEach(element => {
        if (element[0] === i && element[1] === j) {
          positionHighlight = [i, j];
        }
      });
      row.push(
        <Square
          positionHighlight={positionHighlight}
          key={j + 3 * i} //waring gone thx to key
          value={squares[j + 3 * i]}
          onSquareClick={() => handleClick(j + 3 * i)}
        />
      );
    }
    return (
      row
    );
  }

  return (
    <>
      <div className="status"><b>{status}</b></div>
      {renderBoard()}
    </>
  );
}

function Square({ value, onSquareClick, positionHighlight }) {
  let dynamicClassName = 'square';

  if (positionHighlight !== null) {
    const [row, col] = positionHighlight;
    dynamicClassName = `square row-${row} col-${col}`;
  }

  return (
    <button className={dynamicClassName} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],  //horizontal  top        //0 - index
    [3, 4, 5],  //horizontal  mid        //1
    [6, 7, 8],  //horizontal  bottom     //2
    [0, 3, 6],  //vertical    left       //3
    [1, 4, 7],  //vertical    mid        //4
    [2, 5, 8],  //vertical    right      //5
    [0, 4, 8],  //cross       down       //6
    [2, 4, 6]   //cross       up         //7
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { sign: squares[a], index: i };
    }
  }
  return null;
}

function calculateRowAndColumn(index) {
  let threeSquaresToColor = [[null, null], [null, null], [null, null]];
  switch (index) {
    case 0:   //horizontal  top 
      threeSquaresToColor = [[0, 0], [0, 1], [0, 2]];
      break;
    case 1: //horizontal  mid 
      threeSquaresToColor = [[1, 0], [1, 1], [1, 2]];
      break;
    case 2: //horizontal  bottom 
      threeSquaresToColor = [[2, 0], [2, 1], [2, 2]];
      break;
    case 3: //vertical    left   
      threeSquaresToColor = [[0, 0], [1, 0], [2, 0]];
      break;
    case 4: //vertical    mid   
      threeSquaresToColor = [[0, 1], [1, 1], [2, 1]];
      break;
    case 5: //vertical    right 
      threeSquaresToColor = [[0, 2], [1, 2], [2, 2]];
      break;
    case 6: //cross down
      threeSquaresToColor = [[0, 0], [1, 1], [2, 2]];
      break;
    case 7: //cross up
      threeSquaresToColor = [[2, 0], [1, 1], [0, 2]];
      break;
    default:
      break;
  }

  return threeSquaresToColor;
}

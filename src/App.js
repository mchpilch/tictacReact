import { useState } from 'react';
import './App.css'; // Import your CSS file

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let desc;
    if (move > 0) {
      desc = 'Go to move #' + move;
    } else {
      desc = 'Go to game start';
    }

    return (
      <>
        <li key={move}>
          {move != currentMove ? <button onClick={() => jumpTo(move)}> {desc} </button> : <p>You are at the move #{ move } </p>}
        </li>
      </>
    );

  });
  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
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
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function renderRow(i){ //i nr rzędu
    const row = [];
    for(let j = 0; j < 3; j++){
      row.push(
        <Square className="sqr" value={squares[j+3*i]} onSquareClick={() => handleClick(j+3*i)} />
      );
    }
    return (
      row
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
          {renderRow(0)}
      </div>
      <div className="board-row">
        {renderRow(1)}
      </div>
      <div className="board-row">
        {renderRow(2)}
      </div>
    </>
  );
}

function Square({ value, onSquareClick }) {
  return <button className="square"
    onClick={onSquareClick}> {value}
  </button>
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],  //horizontal
    [3, 4, 5],  //horizontal
    [6, 7, 8],  //horizontal
    [0, 3, 6],  //vertical
    [1, 4, 7],  //vertical
    [2, 5, 8],  //vertical
    [0, 4, 8],  //cross
    [2, 4, 6]   //cross
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
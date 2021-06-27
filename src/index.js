import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return(
    <button className={`${props.squareSelectedClass} ${props.winningSquareClass} square`} onClick={props.onClick} > 
      {props.value}
    </button>
  );
}

class Board extends React.Component { 
  renderSquare(squareNumber) {
    const squareSelectedClass = (this.props.selectedSquareNumber === squareNumber) ? 'squareSelected' : '';
    const winningSquareClass = (this.props.winningSquares && this.props.winningSquares.includes(squareNumber)) ? 'winningSquare' : '';
    return <Square 
            value={this.props.squares[squareNumber]} 
            onClick={() => this.props.onClick(squareNumber)}
            squareSelectedClass={squareSelectedClass}
            winningSquareClass={winningSquareClass}/>;
  }

  render() {
    return(
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: '',
        squareNumber: null,
      }],
      xIsNext: true,
      moveNumber: 0,
    };
  }

  getX(squareNumber) {
    return ((squareNumber) % 3) + 1;
  }

  getY(squareNumber) {
    return Math.floor(squareNumber / 3) + 1;
  }

  getLocations() {
    const locations = Array
                      .from({length:9})
                      .map((_, squareNumber) => '[' + this.getX(squareNumber) + ', ' + this.getY(squareNumber) + ']');
    return locations;
  }
  
  getNextPlayer() {
    return this.state.xIsNext ? 'X' : 'O';
  }

  getPlayer(moveNumber) {
    return ((moveNumber % 2) === 0) ? 'O' : 'X';    
  }

  handleClick(squareNumber) {
    const history = this.state.history.slice(0, this.state.moveNumber + 1);
    const current = history[history.length - 1]; 
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[squareNumber]) {
      return;
    }

    const locations = this.getLocations();
    squares[squareNumber] = this.getNextPlayer();
    this.setState({
      history: history.concat([{
        squares: squares,
        location: locations[squareNumber],
        squareNumber: squareNumber,
      }]),
      moveNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(moveNumber) {
    this.setState({
      moveNumber: moveNumber,
      xIsNext: (moveNumber % 2) === 0,
    });
  }

  getMoveDescription(moveNumber) {
    const moveDescription = moveNumber
        ? `Go to move number ${moveNumber}, Player ${this.getPlayer(moveNumber)} on ${this.state.history[moveNumber].location}`
        : 'Go to game start';
  
    return moveDescription;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.moveNumber];
    const winner = calculateWinner(current.squares);
    let status;
    let winningSquares = null;
    if(winner) {
      status = 'Winner: ' + winner.winner;
      winningSquares = winner.winningSquares;
    } else {
      status = 'Next Player: ' + this.getNextPlayer();
    }

    const moves = history.map((h, moveNumber) => 
    {
      const desc = this.getMoveDescription(moveNumber);

      const selectedMoveClass = (moveNumber === this.state.moveNumber) ? "selectedMove" : "";
      return(
        <li key={moveNumber}>
          <button className={selectedMoveClass} onClick={() => this.jumpTo(moveNumber)}>{desc}</button>
        </li>
      );
    });

    return(
      <div className="game">
        <div className="game-board">
          <Board 
              squares={current.squares}
              onClick={(moveNumber) => this.handleClick(moveNumber)}
              selectedSquareNumber={current.squareNumber}
              winningSquares={winningSquares}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], winningSquares: lines[i]};
    }
  }

  if(!squares.some(x => !x)) {
    return {winner: 'None', winningSquares: null};
  }
  
  return null;
}

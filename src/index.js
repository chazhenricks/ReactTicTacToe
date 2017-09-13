
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Functional component for the square. 
//Since square is only providing a return can use this syntac instead of creating a class that extends the React.Component
//takes aregument props that get passed down to it from the board class
function Square(props) {
  //Only returns a clickable button that inherits the onClick method from the board
  //NOTE = this cannot be props.onClick() - that will immediately invoke an endlessloop of function calls that will swallow the world whole. You have been warned.
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
  //This is the ES6 class for the board
  //extends keyword defines it as a subclass of the ReactComponent overloard class. All hail.
  //NOTE if there is a constructor in a subclass - it needs to call super(); See the Game class below. 
  class Board extends React.Component {

    //this defines our renderSquare method. 
    //We pass it i, which will later be the number value of the squares. 
    //We give each square an initial value as well as a prop onClick
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    //defines the actual render of the Board component
    //spits back out 3 divs, each containing 3 renderings of a square
    //We can only render one element in a component, but that component can have many childre, hence the single div with nested divs
    //note it is className= and not class=
    render() {
      return (
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
  
  //class that contains the entire game. 
  //This will house all of the logic of the game
  class Game extends React.Component {

    //The constructor contains the initial state of the game, which is all empty.
    //State contains 3 key/value pairs - history, stepNumber(turn), and who is next
    constructor() {
      super();
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }

    //defines the onclick method that gets passed down to the board, and thus the square
    handleClick(i) {
      //history is updated with the new step number as turns go
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      //current turn is history length - 1
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      //toggles between if X or O goes next
      squares[i] = this.state.xIsNext ? 'X' : 'O';

      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
          'Move #' + move :
          'Game start';
        return (
          <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
          </li>
        );
      });
  
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }    

      return (
        <div className="game">
          <div className="game-board">
            <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  
  // ========================================


  //This is what actually gets displayed on the DOM.
  //Game gets called, which calls the board, which calls the squares
  //Renders them in the root id element on index.html
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  //function to determine winner.
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
        return squares[a];
      }
    }
    return null;
  }
  
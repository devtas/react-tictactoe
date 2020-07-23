import React from 'react';

const rowStyle = {
  display: 'flex'
}

const squareStyle = {
  'width':'60px',
  'height':'60px',
  'backgroundColor': '#ddd',
  'margin': '4px',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'fontSize': '20px',
  'color': 'white'
}

const boardStyle = {
  'backgroundColor': '#eee',
  'width': '208px',
  'alignItems': 'center',
  'justifyContent': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'border': '3px #eee solid'
}

const containerStyle = {
  'display': 'flex',
  'alignItems': 'center',
  'flexDirection': 'column'
}

const instructionsStyle = {
  'marginTop': '5px',
  'marginBottom': '5px',
  'fontWeight': 'bold',
  'fontSize': '16px',
}

const buttonStyle = {
  'marginTop': '15px',
  'marginBottom': '16px',
  'width': '80px',
  'height': '40px',
  'backgroundColor': '#8acaca',
  'color': 'white',
  'fontSize': '16px',
}

class Square extends React.Component {
  render() {
    const { id, onSelect, fill } = this.props
    return (
      <div
        className="square"
        style={squareStyle}
        onClick={() => onSelect(id)}>
        { (fill !== null) && fill }
      </div>
    );
  }
}

const rows = [
  [1,2,3],
  [4,5,6],
  [7,8,9]
]

const winPossibilities = [
  [1,2,3],
  [4,5,6],
  [7,8,9],
  [1,4,7],
  [2,5,8],
  [3,6,9],
  [1,5,9],
  [3,5,7]
]

const players = ['X','O']

class Board extends React.Component {
  state = {
    actualPlayerIndex: 0,
    lastPlayer: players.length-1,
    squareSelecteds: [],
    winner: null
  }

  selectSquare = squareId => {
    const { squareSelecteds, actualPlayerIndex, winner } = this.state
    if (this.isSelected(squareId) || winner !== null) {
      return;
    }
    squareSelecteds.push({
      square: squareId,
      player: actualPlayerIndex
    })
    this.setState(squareSelecteds)

    console.log('squareSelecteds', squareSelecteds)

    this.verifyWinner()
    this.nextPlayer()
  }

  nextPlayer = () => {
    const { lastPlayer, actualPlayerIndex } = this.state
    let nextPlayerIndex = (actualPlayerIndex < lastPlayer) ? actualPlayerIndex+1 : 0
    this.setState({
      actualPlayerIndex: nextPlayerIndex
    })
  }

  isSelected = square => {
    const { squareSelecteds } = this.state
    let selected = squareSelecteds.filter(item => item.square === square)
    return selected.length > 0 ? true : false
  }

  getSelectedBySquareId = square => {
    const { squareSelecteds } = this.state
    let selected = squareSelecteds.filter(item => item.square === square)
    return selected.length > 0 ? players[selected[0].player] : null
  }

  verifyWinner = () => {
    const { squareSelecteds } = this.state
    // Start finding a winner by the player
    players.map((player, index) => {
      winPossibilities.map(choices => {
        let loose = false;
        let hits = 0;
        choices.map(choice => {
          // Verify if loose changed
          if (loose) return;

          // Find a right hit to this Square for this player
          let hit = squareSelecteds.filter(item => item.square === choice && item.player === index)
          loose = (hit.length === 0);

          // Increment hits if loose didn't change
          if (!loose) hits++;

          // Verify if we have winner AFTER the logic happens
          console.log(`choices.length and hits`, choices.length, hits)
          if (choices.length === hits) {
            this.setState({
              winner: player
            })
            return;
          }
        })
      })
      console.log(``)
    })
  }

  resetGame = () => {
    this.setState({
      actualPlayerIndex: 0,
      squareSelecteds: [],
      winner: null
    })
  }

  render() {
    const { actualPlayerIndex, winner, squareSelecteds } = this.state
    let actualPlayer = players[actualPlayerIndex]

    const rowsEl = [];
    rows.map((item, index) => {
      let squaresEl = [];
      item.map((row, u) => {
        squaresEl.push(
          <Square
            key={u}
            id={row}
            onSelect={this.selectSquare}
            fill={this.getSelectedBySquareId(row)}
          />
        )
      })
      rowsEl.push(
        <div key={index} className="board-row" style={rowStyle}>{squaresEl}</div>
      )
    })

    return (
      <div style={containerStyle} className="gameBoard">
        <div className="status" style={instructionsStyle}>Next player: {actualPlayer}</div>
        <div className="winner" style={instructionsStyle}>Winner: {winner ? winner : `None`}</div>
        <button style={buttonStyle} onClick={() => this.resetGame()}>Reset</button>
        <div style={boardStyle}>
          {rowsEl}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

export default Game;
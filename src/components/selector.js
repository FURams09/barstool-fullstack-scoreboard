import React, { Component } from "react"
import PropTypes from "prop-types"

class Selector extends Component {
  changePeriod (e) {
    this.props.changeInning(e.target.value)
  }

  render () {
    let gameSelectOpts = []
    if (this.props.games) {
      gameSelectOpts = this.props.games
      gameSelectOpts.sort(
        (lastGame, nextGame) =>
          lastGame.currentPeriod - nextGame.currentPeriod
      )
      gameSelectOpts = gameSelectOpts.map(game => {
        return (
          <option key={game._id} value={game._id}>
            {`${game.currentPeriod} Inning`}
          </option>
        )
      })
    };
    return (
      <select
        onChange={this.changePeriod.bind(this)}
        defaultValue={this.props.selectedGame}
      >
        {gameSelectOpts}
      </select>
    )
  }
}

Selector.propTypes = {
  games: PropTypes.array,
  selectedGame: PropTypes.string,
  changeInning: PropTypes.func
}

export default Selector

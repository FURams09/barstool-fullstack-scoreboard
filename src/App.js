import React, { Component } from 'react'
import axios from 'axios'
import Selector from "./components/selector"
import BaseballScoreboard from "./components/baseball-scoreboard"

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gamesToSelect: [],
      selectedGame: ``
    }
  }

  componentDidMount () {
    axios
      .get(`/games`)
      .then(({ data }) => {
        // order the games by what inning they're in.
        let games = data
        let _id = ``
        if (games[0]) {
          games.sort(
            (lastGame, nextGame) =>
              lastGame.currentPeriod - nextGame.currentPeriod
          )
          _id = games[0]._id
        }
        this.setState({
          gamesToSelect: games,
          selectedGame: _id
        })
      })
      .catch(ex => {
        console.log(ex)
        this.setState({ loading: false })
      })
  }

  changeInning (_id) {
    this.setState({ selectedGame: _id })
  }

  render () {
    return (
            <>
                <div className="selector__period">
                  <Selector
                    games={this.state.gamesToSelect}
                    selectedGame={this.state.selectedGame}
                    changeInning={this.changeInning.bind(this)}
                  />
                </div>
                <BaseballScoreboard
                  selectedGame={this.state.selectedGame}
                />
            </>
    )
  }
}

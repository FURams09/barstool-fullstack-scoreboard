import React, { Component } from "react"
import PropTypes from 'prop-types'
import axios from "axios"
import ScoreBoard from "./scoreboard"
import BaseballGameClock from "./baseball-gameclock"

const Inning = (props) => {
  return <span
    title={props.hoverText}
  >
    {props.displayText}
  </span>
}

Inning.propTypes = {
  hoverText: PropTypes.string,
  displayText: PropTypes.string
}
/**
 * There would be a similar routine for other sports returning the array of
 * sports specific Periods (simple HTML spans for the headers and inning components
 * for the teams respective innings)
 * @param {array} game game's array of innings
 * @returns {array} [innings header, away team's Innings, home team's Innings ]
 */
const getBaseballInnings = (game) => {
  // set the minimum and maximum number of innings to display at once
  const minInnings = 9
  const maxInnings = 12

  let noOfInnings = game.periods.length

  let firstInning = noOfInnings > maxInnings ? noOfInnings - maxInnings : 0
  let lastInning = noOfInnings < minInnings ? minInnings : noOfInnings

  let innings = []
  let homeInnings = []
  let awayInnings = []

  // create inning components for every inning or
  // put an empty placeholder span for padding
  for (let i = firstInning; i < lastInning; i++) {
    innings.push(<span key={i}>{i + 1}</span>)
    let inning = game.periods[i]

    if (inning) {
      let [awayInning, homeInning] = inning

      if (awayInning) {
        awayInnings[i] = (
          <Inning
            key={i}
            hoverText={`Hits: ${awayInning.hits} \nErrors: ${awayInning.errs}`}
            displayText={awayInning.runs}
          />
        )
      } else {
        awayInnings.push(<span key={`away_${i}`} />)
      };
      if (homeInning) {
        homeInnings[i] = (
          <Inning
            key={i}
            hoverText={`Hits: ${awayInning.hits} \nErrors: ${awayInning.errs}`}
            displayText={awayInning.runs}
          />
        )
      } else {
        homeInnings.push(<span key={`home_${i}`} />)
      }
    } else {
      awayInnings.push(<span key={`away_${i}`} />)
      homeInnings.push(<span key={`home_${i}`} />)
    }
  }
  return [innings, awayInnings, homeInnings]
}

/**
 * Takes a baseball game object and loops through the final game totals and creates
 * the necessary component to display for them.
 * @param {array} game
 * @returns {array} [final headers, away teams final counts, home team's final counts ]
 */
const getBaseballFinal = (game) => {
  let homeFinal = []
  let awayFinal = []
  let finalHeader = []
  /* Loop through  the keys to display as results and build arrays for the home and away team at the same time */
  game.finalKeys.forEach((value, i) => {
    const [away, home] = game.finals
    homeFinal.push(<span key={`homeFinal_${i}`}>{home[i]}</span>)
    awayFinal.push(<span key={`awayFinal_${i}`}>{away[i]}</span>)
    finalHeader.push(<span key={`${i}`}>{value}</span>)
  })
  return [finalHeader, awayFinal, homeFinal]
}

class BaseballScoreboard extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props)
    this.state = {
      game: {},
      load: false
    }
    this.updateGame.bind(this)
  }

  updateGame () {
    axios.get(`games/${this.props.selectedGame}`).then(res => {
      if (res.data.error) {
        console.log(res.data.error)
      } else {
        this.setState({ game: res.data })
      }
      this.setState({ load: false })
    })
  }

  componentDidUpdate () {
    if (this.state.load) {
      this.updateGame()
    } else if (this.props.selectedGame !== `` && this.props.selectedGame !== this.state.game._id) {
      this.setState({ load: true })
    }
  }

  render () {
    let clock = <div />
    let game = []
    let final = []
    let homeTeam = {}
    let awayTeam = {}
    let noGames = true
    if (this.state.game.hasOwnProperty(`_id`)) {
      clock = <BaseballGameClock
        gameStatus={this.state.game.status}
        inning={this.state.game.currentPeriod}
        inningHalf={this.state.game.currentPeriodHalf}
      />
      game = getBaseballInnings(this.state.game)
      final = getBaseballFinal(this.state.game)
      homeTeam = this.state.game.homeTeam
      awayTeam = this.state.game.awayTeam

      noGames = false
    }

    return (
      <>
        <ScoreBoard
          loading={this.state.load}
          noGames={noGames}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          periods={game}
          final={final}
          gameClock = {clock}
        />
      </>
    )
  }
}

BaseballScoreboard.propTypes = {
  selectedGame: PropTypes.string
}

export default BaseballScoreboard

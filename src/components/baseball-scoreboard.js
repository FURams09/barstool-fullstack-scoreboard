import React, { Component } from "react";
import axios from "axios";
import Selector from "./selector";
import ScoreBoard from "./scoreboard";
import BaseballGameClock from "./baseball-gameclock";

const Inning = (props) => {
  return  <span
            title={props.hoverText}
          >
          {props.displayText}
          </span>
}
/**
 * There would be a similar routine for other sports returning the array of 
 * sports specific Periods (simple HTML spans for the headers and the inning component)
 * @param {array} game game's array of innings
 * @returns {array} [innings header, away team's Innings, home team's Innings ]
 */
const getBaseballInnings = (game) => {
  // set the minimum and maximum number of innings to display at once
  const minInnings = 9;
  const maxInnings = 12;

  let noOfInnings = game.periods.length;
  
  let firstInning = noOfInnings > maxInnings ? noOfInnings - maxInnings : 0;
  let lastInning = noOfInnings < minInnings ? minInnings : noOfInnings;
  
  let innings = [];
  let homeInnings = [];
  let awayInnings = [];
  
  // create inning components for every inning or 
  // put an empty placeholder span for padding
  for (let i = firstInning; i < lastInning; i++) {
    let inning = game.periods[i];
  
    if (inning) { 
      let [awayInning, homeInning] = inning;
      // refactor out inning creation
      if (awayInning){
        awayInnings[i] = (
          <Inning
            key={i}
            hoverText={`Hits: ${awayInning.hits} \nErrors: ${awayInning.errs}`}
            displayText={awayInning.runs}
          />
          
        )} else {
          awayInnings.push(<span key={`away_${i}`} />);
        };
      if (homeInning) {
        homeInnings[i] = (
          <Inning 
          key={i}
          hoverText={`Hits: ${awayInning.hits} \nErrors: ${awayInning.errs}`}
          displayText={awayInning.runs}
        />
        );
      } else {
        homeInnings.push(<span key={`home_${i}`} />);
      }
        
    } else {
      awayInnings.push(<span key={`away_${i}`} />);
      homeInnings.push(<span key={`home_${i}`} />);
    }
  
    innings.push(<span key={i}>{i + 1}</span>);
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
  let homeFinal = [];
  let awayFinal = [];
  let finalHeader = [];
  /* Loop through  the keys to display as results and build arrays for the home and away team at the same time*/
  game.finalKeys.forEach((value, i) => {
    const [away, home] = game.finals;
    homeFinal.push(<span key={`homeFinal${i}`}>{home[i]}</span>);
    awayFinal.push(<span key={`awayFinal_${i}`}>{away[i]}</span>);
    finalHeader.push(<span key={`${i}`}>{value}</span>);
  });
  return [finalHeader, awayFinal, homeFinal]
}

class BaseballScoreboard extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
    this.state = {
      gamesToSelect: [],
      cachedGames: [],
      selectedGame: "",
      loading: true
    };
  }
  changeInning(_id) {
    this.updateGame(_id);
    let cachedGame = this.state.cachedGames.filter(game => {
      return game._id === _id;
    });
    if (cachedGame.length > 0) {
      this.setState({ game: cachedGame[0], selectedGame: _id });
    } else {
      this.setState({ loading: true });
    }
  }

  updateGame(_id) {
    axios.get(`games/${_id}`).then(res => {
      if (res.data.error) {
        console.log(res.data.error);
      } else {
        let cachedGames = this.state.cachedGames.map(game => {
          if (game._id === _id) {
            return res.data;
          } else {
            return game;
          }
        });
        this.setState({ selectedGame: _id, game: res.data, cachedGames });
      }
    });
  }
  componentDidMount() {
    axios
      .get("/games")
      .then(({ data }) => {
        if (data.length === 0) {
          this.setState({ loading: false });
          return;
        }
        // order the games by what inning they're in.
        data.sort(
          (lastGame, nextGame) =>
            lastGame.currentPeriod - nextGame.currentPeriod
        );
        let games = data.map(game => {
          return { _id: game._id, text: `${game.currentPeriod} Inning` };
        });

        this.setState({
          gamesToSelect: games,
          cachedGames: data,
          game: data[0],
          selectedGame: games[0]._id || "",
          loading: false
        });
      })
      .catch(ex => {
        console.log(ex);
        this.setState({ loading: false });
      });
  }
 
  render() {
    if (this.state.loading) {
      return (
        <div className="boxscore">
          <div>Loading</div>
        </div>
      );
    } else if (this.state.gamesToSelect.length === 0) {
      return (
        <div className="boxscore">
          <div>No Games Found</div>
        </div>
      );
    } else {
    const clock = <BaseballGameClock
      gameStatus={this.state.game.status}
      inning={this.state.game.currentPeriod}
      inningHalf={this.state.game.currentPeriodHalf}
    />

    const game = getBaseballInnings(this.state.game);
    const final = getBaseballFinal(this.state.game);
    return (
      <>
        <div className="selector__period">
          <Selector
            games={this.state.gamesToSelect}
            changeInning={this.changeInning.bind(this)}
          />
        </div>
        <ScoreBoard
          homeTeam={this.state.game.homeTeam}
          awayTeam={this.state.game.awayTeam}
          periods={game} 
          final={final}
          gameClock = {clock}
        />
      </>
    );
  }}

}

export default BaseballScoreboard;

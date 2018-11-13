import React, { Component } from "react";
import axios from "axios";
import Selector from "./components/selector";
import ScoreBoard from "./components/scoreboard";
import BaseballGameClock from "./components/baseball-gameclock";

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
 * @param {array} game game's array of periods
 * @returns {array} [innings header, away team's Innings, home team's Innings ]
 */
const getBaseballInnings = (game) => {
  const minPeriods = 9;
  const maxPeriods = 12;

  let noOfPeriods = game.periods.length;
  
  let firstPeriod = noOfPeriods > maxPeriods ? noOfPeriods - maxPeriods : 0;
  let lastPeriod = noOfPeriods < minPeriods ? minPeriods : noOfPeriods;
  
  let periods = [];
  let homePeriods = [];
  let awayPeriods = [];
  
  for (let i = firstPeriod; i < lastPeriod; i++) {
    let period = game.periods[i];
  
    if (period) {
      let [awayPeriod, homePeriod] = period;
      if (awayPeriod){
        awayPeriods[i] = (
          <Inning
            key={i}
            hoverText={`Hits: ${awayPeriod.hits} \nErrors: ${awayPeriod.errs}`}
            displayText={awayPeriod.runs}
          />
          
        )} else {
          awayPeriods.push(<span key={`away_${i}`} />);
        };
      if (homePeriod) {
        homePeriods[i] = (
          <Inning 
          key={i}
          hoverText={`Hits: ${awayPeriod.hits} \nErrors: ${awayPeriod.errs}`}
          displayText={awayPeriod.runs}
        />
        );
      } else {
        homePeriods.push(<span key={`home_${i}`} />);
      }
        
    } else {
      awayPeriods.push(<span key={`away_${i}`} />);
      homePeriods.push(<span key={`home_${i}`} />);
    }
  
    periods.push(<span key={i}>{i + 1}</span>);
  }
  return [periods, awayPeriods, homePeriods]
}

/**
 * 
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
      period={this.state.game.currentPeriod}
      periodHalf={this.state.game.currentPeriodHalf}
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

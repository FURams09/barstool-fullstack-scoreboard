import React from "react";
import PropTypes from "prop-types";

import GameClock from "./gameclock";
import TeamCard from "./team-card";

const ScoreBoard = function(props) {
  if (props.loading) {
    return (
      <div className="boxscore">
        <div>Loading</div>
      </div>
    );
  } else if (props.hasGames) {
    return (
      <div className="boxscore">
        <div>No Games Found</div>
      </div>
    );
  } else {
    let { minPeriods, maxPeriods } = props;
    let noOfPeriods = props.game.periods.length;
    minPeriods = minPeriods || props.game.periods.length;
    maxPeriods = maxPeriods || props.game.periods.length;

    let firstPeriod = noOfPeriods > maxPeriods ? noOfPeriods - maxPeriods : 0;
    let lastPeriod = noOfPeriods < minPeriods ? minPeriods : noOfPeriods;

    let periods = [];
    let homePeriods = [];
    let awayPeriods = [];

    for (let i = firstPeriod; i < lastPeriod; i++) {
      let inning = props.game.periods[i];

      if (inning) {
        let [awayPeriod, homePeriod] = inning;
        if (awayPeriod.hasOwnProperty("runs"))
          awayPeriods[i] = (
            <span
              key={`away_${i}`}
              title={`Hits: ${awayPeriod.hits} \nErrors: ${awayPeriod.errs}`}
            >
              {awayPeriod.runs}
            </span>
          );
        if (homePeriod.hasOwnProperty("runs"))
          homePeriods[i] = (
            <span
              key={`home_${i}`}
              title={`Hits: ${homePeriod.hits} \nErrors: ${homePeriod.errs}`}
            >
              {homePeriod.runs}
            </span>
          );
      } else {
        awayPeriods.push(<span key={`away_${i}`} />);
        homePeriods.push(<span key={`home_${i}`} />);
      }

      periods.push(<span key={i}>{i + 1}</span>);
    }

    let homeFinal = [];
    let awayFinals = [];
    let finalKeys = [];
    /* Loop through  the keys to display as results and build arrays for the home and away team at the same time*/
    props.game.finalKeys.forEach((value, i) => {
      const [away, home] = props.game.finals;
      homeFinal.push(<span key={`homeFinal${i}`}>{home[i]}</span>);
      awayFinals.push(<span key={`awayFinal_${i}`}>{away[i]}</span>);
      finalKeys.push(<span key={`${i}`}>{value}</span>);
    });

    return (
      <div className="boxscore">
        <div className="boxscore__team boxscore__team--header">
          <label />
          <div className="boxscore__team__units">{periods}</div>
          <div className="boxscore__team__results">{finalKeys}</div>
        </div>
        <div className="boxscore__team boxscore__team--away">
          <label>{props.game.awayTeam.abbr}</label>
          <div className="boxscore__team__units">{awayPeriods}</div>
          <div className="boxscore__team__results">{awayFinals}</div>
        </div>
        <div className="boxscore__team boxscore__team--home">
          <label>{props.game.homeTeam.abbr}</label>
          <div className="boxscore__team__units">{homePeriods}</div>
          <div className="boxscore__team__results">{homeFinal}</div>
        </div>
        <div className="boxscore__details">
          <TeamCard
            teamColor={props.game.awayTeam.teamColor}
            textColor={props.game.awayTeam.textColor}
            name={props.game.awayTeam.name}
            abbr={props.game.awayTeam.abbr}
          />
          <GameClock
            gameStatus={props.game.status}
            period={props.game.currentPeriod}
            periodHalf={props.game.currentPeriodHalf}
          />
          <TeamCard
            teamColor={props.game.homeTeam.teamColor}
            textColor={props.game.homeTeam.textColor}
            name={props.game.homeTeam.name}
            abbr={props.game.homeTeam.abbr}
          />
        </div>
      </div>
    );
  }
};

ScoreBoard.propTypes = {
  game: PropTypes.any,
  minPeriods: PropTypes.number,
  maxPeriods: PropTypes.number
};

export default ScoreBoard;

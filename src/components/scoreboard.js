import React from "react";
import PropTypes from "prop-types";

import TeamCard from "./team-card";

const ScoreBoard = function(props) {
    const [headerRow, awayPeriods, homePeriods] = props.periods;
    const [finalHeaderRow, awayFinal, homeFinal] = props.final;
    return (
      <div className="boxscore">
        <div className="boxscore__team boxscore__team--header">
          <label />
          <div className="boxscore__team__units">{headerRow}</div>
          <div className="boxscore__team__results">{finalHeaderRow}</div>
        </div>
        <div className="boxscore__team boxscore__team--away">
          <label>{props.awayTeam.abbr}</label>
          <div className="boxscore__team__units">{awayPeriods}</div>
          <div className="boxscore__team__results">{awayFinal}</div>
        </div>
        <div className="boxscore__team boxscore__team--home">
          <label>{props.homeTeam.abbr}</label>
          <div className="boxscore__team__units">{homePeriods}</div>
          <div className="boxscore__team__results">{homeFinal}</div>
        </div>
        <div className="boxscore__details">
          <TeamCard
            teamColor={props.awayTeam.teamColor}
            textColor={props.awayTeam.textColor}
            name={props.awayTeam.name}
            abbr={props.awayTeam.abbr}
            record="56-38"
          />
          {props.gameClock}
          <TeamCard
            teamColor={props.homeTeam.teamColor}
            textColor={props.homeTeam.textColor}
            name={props.homeTeam.name}
            abbr={props.homeTeam.abbr}
            record="57-37"
          />
        </div>
      </div>
    );
  
};

ScoreBoard.propTypes = {
  homeTeam: PropTypes.any,
  awayTeam: PropTypes.any,
  periods: PropTypes.array,
  final: PropTypes.array
};

export default ScoreBoard;

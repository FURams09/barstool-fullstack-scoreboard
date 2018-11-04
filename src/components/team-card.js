import React from "react";
import PropTypes from "prop-types";
const GameCard = props => {
  return (
    <div
      className="boxscore__details__team"
      style={{
        background: `#${props.teamColor}`,
        color: `${props.textColor}`
      }}
    >
      <p>
        <strong>{props.name}</strong>
        <small>{props.abbr}</small>
      </p>
      <span>56-38</span>
    </div>
  );
};

GameCard.prototype = {
  teamColor: PropTypes.string,
  textColor: PropTypes.string,
  name: PropTypes.string,
  abbr: PropTypes.abbr
};

export default GameCard;

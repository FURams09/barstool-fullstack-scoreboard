import React from "react";
import PropTypes from "prop-types";
import GameClock from "./gameclock";

const BaseballGameClock = props => {
  let render = <div />;
  switch (props.gameStatus) {
    case "CLOSED":
      render = (
        <>
          <strong className="boxscore__details__final">
            Final
            {props.period > 9 ? (
              <>
                <br />
                {props.period}
              </>
            ) : (
              ``
            )}
          </strong>
          <small className="boxscore__details__final">
            <strong>
              F
              {props.period > 9 ? (
                <>
                  <br />({props.period})
                </>
              ) : (
                ``
              )}
            </strong>
          </small>
        </>
      );
      break;
    case "INPROGRESS":
      let inningState = '';
      let smallInningState = '';
      if (props.inningOver) {
        inningState = 'End';
        smallInningState = 'End'
      } else {
        if (props.periodHalf === 'B') {
          inningState = 'Bottom';
          smallInningState = 'Btm';
        } else {
          inningState = 'Top';
          smallInningState = 'Top';
        }
      }
      render = (
        <>
          <strong>
            {inningState}
            <br />
            {props.period}
          </strong>
          <small>
            <strong>
              {smallInningState}
              <br />
              {props.period}
            </strong>
          </small>
        </>
      );
      break;
    default:
  }

  BaseballGameClock.proptypes = {
    gameStatus: PropTypes.string,
    period: PropTypes.string,
    periodHalf: PropTypes.string
  };
  return <GameClock render={render} />;
};

export default BaseballGameClock;

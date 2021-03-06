import React from "react"
import PropTypes from "prop-types"
import GameClock from "./gameclock"

const BaseballGameClock = props => {
  let render
  switch (props.gameStatus) {
    case `CLOSED`:
      render = (
        <>
          <strong className="boxscore__details__final">
            Final
            {props.inning > 9 ? (
              <>
                <br />
                {props.inning}
              </>
            ) : (
              ``
            )}
          </strong>
          <small className="boxscore__details__final">
            <strong>
              F
              {props.inning > 9 ? (
                <>
                  <br />({props.inning})
                </>
              ) : (
                ``
              )}
            </strong>
          </small>
        </>
      )
      break
    case `INPROGRESS`:
      let inningState = ``
      let smallInningState = ``
      if (props.inningOver) {
        inningState = `End`
        smallInningState = `End`
      } else {
        if (props.inningHalf === `B`) {
          inningState = `Bottom`
          smallInningState = `Btm`
        } else {
          inningState = `Top`
          smallInningState = `Top`
        }
      }
      render = (
        <>
          <strong>
            {inningState}
            <br />
            {props.inning}
          </strong>
          <small>
            <strong>
              {smallInningState}
              <br />
              {props.inning}
            </strong>
          </small>
        </>
      )
      break
    default:
      return <div />
  }
  return <GameClock render={render} />
}

BaseballGameClock.propTypes = {
  gameStatus: PropTypes.string,
  inning: PropTypes.string,
  inningHalf: PropTypes.string,
  inningOver: PropTypes.bool
}

export default BaseballGameClock

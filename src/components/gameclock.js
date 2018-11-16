import React from "react"
import PropTypes from "prop-types"

const GameClock = props => {
  let render = props.render || <div />

  return <div className="boxscore__details__info">{render}</div>
}

GameClock.propTypes = {
  render: PropTypes.fn
}

export default GameClock

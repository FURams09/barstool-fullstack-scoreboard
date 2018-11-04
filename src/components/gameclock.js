import React, { Component } from "react";

class GameClock extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  render() {
    let statusDisplay = "";
    switch (this.props.gameStatus) {
      case "CLOSED":
        statusDisplay = <div className="boxscore__details__final">FINAL</div>;
        break;
      case "INPROGRESS":
        statusDisplay = (
          <>
            {this.props.periodHalf === "B" ? "Btm" : "Top"}
            <br />
            {this.props.period}
          </>
        );
        break;
      case "NOTSTARTED":
        statusDisplay = (
          <strong>
            {/* Stand in for start time. No example feed */}
            7:05
          </strong>
        );
        break;
      default:
        statusDisplay = "";
    }
    if (this.props.gameStatus === "Closed") {
    }
    return (
      <div className="boxscore__details__info">
        <strong>{statusDisplay}</strong>
      </div>
    );
  }
}

export default GameClock;

import React, { Component } from "react";
import PropTypes from "prop-types";

class Selector extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: ""
    };
  }
  changePeriod(e) {
    this.setState({ selectedValue: e.target.value });
    this.props.changeInning(e.target.value);
  }
  render() {
    const selectableGames = this.props.games.map(game => {
      return (
        <option key={game._id} value={game._id}>
          {game.text}
        </option>
      );
    });
    return (
      <select
        onChange={this.changePeriod.bind(this)}
        defaultValue={this.state.selectedValue}
      >
        {selectableGames}
      </select>
    );
  }
}

Selector.propTypes = {
  games: PropTypes.array
};

export default Selector;

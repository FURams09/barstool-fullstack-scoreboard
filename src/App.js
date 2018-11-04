import React, { Component } from "react";
import axios from "axios";
import Selector from "./components/selector";
import ScoreBoard from "./components/scoreboard";
class App extends Component {
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
        console.log(data);
        if (data.length === 0) {
          this.setState({ loading: false });
        }
        data.sort(
          (lastGame, nextGame) =>
            lastGame.currentPeriod - nextGame.currentPeriod
        );
        let games = data.map(game => {
          return [game._id, `${game.currentPeriod} Inning`];
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
    return (
      <>
        <div className="selector__period">
          <Selector
            games={this.state.gamesToSelect}
            changeInning={this.changeInning.bind(this)}
          />
        </div>
        <ScoreBoard
          game={this.state.game}
          minPeriods={9}
          maxPeriods={12}
          hasGame={this.state.gamesToSelect.length !== 0}
          loading={this.state.loading}
        />
      </>
    );
  }
}

export default App;

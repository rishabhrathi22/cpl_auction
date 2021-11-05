import React, { Component } from "react";
import { Grid, Row, Col } from "react-flexbox-grid";
import { connect } from "react-redux";

// css
import * as local from "./player-list.module.css";

// actions
import { fetchPlayers, filterPlayers } from "../../actions";

// assets
import Squad from "../../../assets/images/squad.svg";
import Refresh from "../../../assets/images/refresh.svg";
import Auction from "../../../assets/images/auction.svg";
import List from "../../../assets/images/list.svg";

class PlayerList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterOption: "all",
      listPlayers: this.props.listPlayers.slice(0, 1),
    };
  }

  recursiveStrategy() {
    setTimeout(() => {
      console.log(this.state);

      let hasMore =
        this.state.listPlayers.length + 1 < this.props.listPlayers.length;

      this.setState((prev, props) => ({
        listPlayers: props.listPlayers.slice(0, prev.listPlayers.length + 1),
      }));

      if (hasMore) this.recursiveStrategy();
    }, 0);
  }

  componentDidMount() {
    this.recursiveStrategy();
    localStorage.getItem("players")
      ? this.props.fetchPlayers(JSON.parse(localStorage.getItem("players")))
      : this.props.fetchPlayers();
  }

  navigateTo(urlParam) {
    this.props.history.push(`/${urlParam}`);
  }

  //   filterList(term) {
  //     this.setState({
  //       filterOption: term.toLowerCase(),
  //     });
  //     this.props.filterPlayers(term);
  //   }

  renderPlayers(player) {
    return (
      <Col xs={6} lg={2} md={3} style={{ padding: 0 }} key={player.name}>
        <div
          className={local.playerItem}
          style={player.active ? { opacity: 1 } : { opacity: 0.5 }}
        >
          <div className={local.playerData}>
            <h3>{player.name}</h3>
            <p>
              {!player.currentClub
                ? "Available"
                : player.currentClub.substring(0, 14)}
            </p>
            <p>
              Year: <b>{player.year}</b>
            </p>
            <br />
            <p>
              Max codeforces rating: <b>{player.codeforces}</b>
            </p>
            <p>
              Max codechef rating: <b>{player.codechef}</b>
            </p>
            <br />
            <p>
              Sold Price: <b>{player.soldPrice ? player.soldPrice : 0}</b>
            </p>
          </div>
        </div>
      </Col>
    );
  }

  render() {
    return (
      <Grid fluid style={{ margin: 0, padding: 0, overflowX: "hidden" }}>
        {/* navbar */}
        <Row className={local.navBar}>
          <Col xs={12} lg={2} md={3}>
            <div className={local.heading}>
              <h1 style={{ marginBottom: "10%", paddingBottom: "15%" }}>
                PCPL Auction
              </h1>
            </div>
          </Col>
          <Col xs={12} lg={10} md={9}>
            <div className={local.mainNavBar}>
              <img
                src={Auction}
                alt="auction"
                className={local.nav_icon}
                onClick={() => this.navigateTo("")}
              />
              <img
                src={List}
                alt="list"
                className={local.nav_icon}
                onClick={() => this.navigateTo("list")}
              />
              <img
                src={Squad}
                alt="squad"
                className={local.nav_icon}
                onClick={() => this.navigateTo("squad")}
              />
              <img className={local.nav_icon} />
              <img className={local.nav_icon} />
              <img
                src={Refresh}
                alt="refresh"
                className={local.nav_icon}
                onClick={() => this.navigateTo("teamselect")}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={12} lg={12} md={12} style={{ textAlign: "center" }}>
            <h1> ALL PLAYERS </h1>
          </Col>
        </Row>

        <Row className={local.mainContainer}>
          <Col xs={12} lg={1} md={1} />
          <Col xs={12} lg={10} md={10} className={local.playerListContainer}>
            <Row className={local.playerList}>
              {this.state.listPlayers.length === 0 ? (
                <div>No players found</div>
              ) : (
                this.state.listPlayers.map((player) =>
                  this.renderPlayers(player)
                )
              )}
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    listPlayers: state.listPlayers,
  };
}

export default connect(mapStateToProps, { fetchPlayers })(PlayerList);

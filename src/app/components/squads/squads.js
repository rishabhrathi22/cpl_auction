import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Row, Col } from "react-flexbox-grid";

// css
import * as local from "./squads.module.css";

// helper function
import { fetchAllPlayers, updateClubData } from "../../actions";

// assets
import Squad from "../../../assets/images/squad.svg";
import Refresh from "../../../assets/images/refresh.svg";
import Auction from "../../../assets/images/auction.svg";
import List from "../../../assets/images/list.svg";

class Squads extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentClubIndex: 0,
    };
  }

  componentDidMount() {
    // check if localStorage has club values
    if (!localStorage.getItem("clubs")) {
      this.props.history.push("/teamselect");
      return;
    }

    if (!this.props.clubs[0]) {
      this.props.updateClubData({}, JSON.parse(localStorage.getItem("clubs")));
    }
    this.props.fetchAllPlayers();
  }

  renderClubList(club, index) {
    return (
      <div
        className={local.clubContainer_item}
        onClick={() => {
          this.setState({
            currentClubIndex: index,
          });
        }}
        style={
          this.state.currentClubIndex === index
            ? { background: "white", width: "100%" }
            : { background: "rgba(255, 255, 255, 0.7)", width: "95%" }
        }
      >
        <p className={local.clubContainer_item_name}>{club.club}</p>
      </div>
    );
  }

  renderPlayer(player) {
    return (
      <Col xs={6} lg={2} md={3} style={{ padding: 0 }} key={player.name}>
        <div className={local.playerItem} style={{ opacity: 1 }}>
          <div className={local.playerData}>
            <h3>{player.name}</h3>
            <p>
              Year: <b>{player.year}</b>
            </p>
            <p>
              Sold Price: <b>{player.soldPrice ? player.soldPrice : 0}</b>
            </p>
          </div>
        </div>
      </Col>
    );
  }

  navigateTo(urlParam) {
    this.props.history.push(`/${urlParam}`);
  }

  render() {
    console.log("%c Squads", "color: red");
    console.log(this.props);
    console.log(this.state);

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

        <Row className={local.squadMainContainer}>
          {/* teams */}
          <Col lg={3} md={3} xs={3}>
            <div className={local.clubContainer}>
              {this.props.clubs.length === 0
                ? null
                : this.props.clubs.map((club, index) =>
                    this.renderClubList(club, index)
                  )}
            </div>
          </Col>

          {/* players */}
          <Col lg={8} md={8} xs={9}>
            <div className={local.playerThumbnail_Container}>
              {this.props.clubs.length === 0 ? null : (
                <div>
                  <p className={local.playerThumbnail_clubname}>
                    {this.props.clubs[this.state.currentClubIndex].club}
                  </p>
                  <p className={local.playerThumbnail_clubdata}>
                    TEAM BUDGET -{" "}
                    {this.props.clubs[this.state.currentClubIndex].clubBudget}{" "}
                    Points
                  </p>
                  <p className={local.playerThumbnail_clubdata}>
                    TEAM SIZE -{" "}
                    {
                      this.props.clubs[this.state.currentClubIndex].players
                        .length
                    }
                  </p>
                </div>
              )}

              {this.props.clubs.length === 0 ? (
                <p className={local.nosquadMessage}>No squads available</p>
              ) : this.props.clubs[this.state.currentClubIndex].players
                  .length === 0 ? (
                <p className={local.nosquadMessage}>No members present</p>
              ) : (
                <Row style={{ marginTop: "4%" }}>
                  {this.props.clubs[this.state.currentClubIndex].players.map(
                    (player) => this.renderPlayer(player)
                  )}
                </Row>
              )}
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    clubs: state.clubs,
  };
}

export default connect(mapStateToProps, { fetchAllPlayers, updateClubData })(
  Squads
);

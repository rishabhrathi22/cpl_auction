import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Grid, Col } from "react-flexbox-grid";

// css
import * as local from "./home.module.css";

// player card flip
import ReactCardFlip from "react-card-flip";

import {
  fetchAllPlayers,
  updateCurrentPlayer,
  updateClubData,
  fetchLocalPlayerData,
  updateLocalPlayerData,
} from "../../actions";

// assets
import Squad from "../../../assets/images/squad.svg";
import Refresh from "../../../assets/images/refresh.svg";
import Auction from "../../../assets/images/auction.svg";
import List from "../../../assets/images/list.svg";
import PlayerCard from "../../../assets/images/player_card.png";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startNextIndex: 1,
      isFlipped: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // check if localStorage has club values
    // console.log(localStorage.getItem("clubs"));

    if (!localStorage.getItem("clubs")) {
      this.props.history.push("/teamselect");
      return;
    }

    if (localStorage.getItem("currentIndex")) {
      this.setState({
        startNextIndex: parseInt(localStorage.getItem("currentIndex")) + 1,
      });
    }

    let currentBidClub = "";
    localStorage.getItem("currentIndex")
      ? this.props.fetchAllPlayers(
          parseInt(localStorage.getItem("currentIndex")) + 1
        )
      : this.props.fetchAllPlayers();

    if (!this.props.clubs[0]) {
      this.props.updateClubData({}, JSON.parse(localStorage.getItem("clubs")));
      currentBidClub = JSON.parse(localStorage.getItem("clubs"))[0].club;
    } else {
      currentBidClub = this.props.clubs[0].club;
    }

    this.props.fetchLocalPlayerData(0, currentBidClub);
  }

  valueChange(e, type) {
    if (type === "CurrentPrice") {
      const numPattern = /^[0-9\b]+$/;
      if (e.target.value === "" || numPattern.test(e.target.value)) {
        this.props.updateLocalPlayerData(
          e.target.value,
          this.props.localPlayerData.currentBidClub
        );
      }
    } else if (type === "ClubChange") {
      this.props.updateLocalPlayerData(
        this.props.localPlayerData.currentPlayerValue,
        e.target.value
      );
    }
  }

  updatePlayer(sellType) {
    if (sellType === "sold") {
      let endForce = false;

      this.props.clubs.map((club) => {
        if (club.club === this.props.localPlayerData.currentBidClub) {
          if (club.clubBudget <= 0 || club.players.length === 20) {
            alert("Current team is out of the bid");
            endForce = true;
          } else if (
            this.props.localPlayerData.currentPlayerValue > club.clubBudget
          ) {
            alert("Current team is out of budget");
            endForce = true;
          }
        }
      });

      if (endForce) {
        return;
      }

      if (
        parseInt(this.props.localPlayerData.currentPlayerValue) >=
        this.props.players.currentPlayer.basePrice
      ) {
        this.props.players.currentPlayer.soldPrice =
          this.props.localPlayerData.currentPlayerValue;
        this.props.players.currentPlayer.currentClub =
          this.props.localPlayerData.currentBidClub;
        this.props.players.currentPlayer.active = false;

        this.props.updateClubData(
          this.props.players.currentPlayer,
          this.props.clubs
        );

        console.log(JSON.stringify(this.props.clubs));

        localStorage.setItem("clubs", JSON.stringify(this.props.clubs));
      } else {
        alert("Purchase price cannot be less than base price.");
        return;
      }
    } else if (sellType === "pass") {
      this.props.players.currentPlayer.active = false;
      this.props.players.currentPlayer.passPlayer = true;
    }

    this.props.updateCurrentPlayer(
      this.props.players.currentPlayerIndex,
      this.state.startNextIndex
    );
    this.props.fetchLocalPlayerData(
      this.props.players.currentPlayerIndex,
      this.props.localPlayerData.currentBidClub
    );

    localStorage.setItem("currentIndex", this.props.players.currentPlayerIndex);

    this.setState({
      startNextIndex: this.state.startNextIndex + 1,
    });
  }

  handleClick(e) {
    this.setState((prevState) => ({ isFlipped: !prevState.isFlipped }));
  }

  renderParticipantClubs(club) {
    return (
      <Col
        xs={6}
        md={6}
        lg={4}
        key={club.club}
        className={local.clubListContainer_item}
      >
        {/* <div className={local.clubListContainer_item_clubtile}> */}
        <div className={local.clubListContainer_item_data}>
          <p
            className={local.clubListContainer_item_datadetail}
            style={{
              fontSize: "24px",
              textTransform: "uppercase",
            }}
          >
            {club.club}
          </p>
          <p className={local.clubListContainer_item_datadetail}>
            Captain - <font color="gold">{club.captain}</font>
          </p>
          <p className={local.clubListContainer_item_datadetail}>
            Budget: <font color="gold">{club.clubBudget}</font> Crores
          </p>
          <p className={local.clubListContainer_item_datadetail}>
            Members: <font color="gold">{club.players.length}</font>
          </p>
        </div>
        {/* </div> */}
      </Col>
    );
  }

  renderNextlist(player) {
    return (
      <div key={player.name} className={local.nextContainer_item}>
        <font>{player.name}</font>
      </div>
    );
  }

  navigateTo(urlParam) {
    this.props.history.push(`/${urlParam}`);
  }

  render() {
    if (!this.props.players.currentPlayer) {
      // this.navigateTo("squad");
      return <div>Go To Squads</div>;
    }

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

        <Row className={local.homeMainContainer}>
          {/* buy sell box */}
          <Col xs={12} lg={5} md={5}>
            <ReactCardFlip
              isFlipped={this.state.isFlipped}
              flipDirection="horizontal"
            >
              {/* front side */}
              <div className={local.imageContainer}>
                <img
                  src={PlayerCard}
                  onClick={this.handleClick}
                  style={{ height: "500px" }}
                />
              </div>

              {/* back side */}
              <div className={local.playerContainer}>
                <div
                  className={local.playerContainer_currentPlayer}
                  onClick={this.handleClick}
                >
                  <p className={local.playerContainer_currentPlayer_name}>
                    {this.props.players.currentPlayer.name}
                  </p>
                  <div className={local.playerContainer_currentPlayer_data}>
                    <p>
                      <b>Branch - {this.props.players.currentPlayer.branch}</b>
                      <br />
                      <b>{this.props.players.currentPlayer.year} year</b>
                      <br />
                      <br />
                      Max Codeforces rating -{" "}
                      <b>{this.props.players.currentPlayer.codeforces}</b>
                      <br />
                      Max CodeChef Rating -{" "}
                      <b>{this.props.players.currentPlayer.codechef}</b>
                    </p>
                    {this.props.players.currentPlayer.achievements.length >
                    0 ? (
                      <p>
                        <b>Achievements</b>
                        <br />
                        {this.props.players.currentPlayer.achievements.map(
                          (element) => {
                            return <font>{element}</font>;
                          }
                        )}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <br />
                <input
                  className={local.playerContainer_bidInput}
                  type="text"
                  onChange={(e) => this.valueChange(e, "CurrentPrice")}
                  value={this.props.localPlayerData.currentPlayerValue}
                />
                <select
                  className={local.playerContainer_clubSelect}
                  onChange={(e) => this.valueChange(e, "ClubChange")}
                >
                  {this.props.clubs.map((club) => {
                    return (
                      <option key={club.club} value={club.club}>
                        {club.club}
                      </option>
                    );
                  })}
                </select>
                <br />
                <br />
                <button
                  className={local.playerContainer_confirmbtn}
                  onClick={() => {
                    this.handleClick();
                    this.updatePlayer("sold");
                  }}
                >
                  SELL
                </button>
                <button
                  className={local.playerContainer_confirmbtn}
                  onClick={() => {
                    this.handleClick();
                    this.updatePlayer("pass");
                  }}
                  style={{ background: "rgba(220, 20, 60, 0.7" }}
                >
                  PASS
                </button>
              </div>
            </ReactCardFlip>
            {/* <div>
              <Row className={local.nextContainer}>
                {this.props.players.nextPlayers.map((player) =>
                  this.renderNextlist(player)
                )}
              </Row>
            </div> */}
          </Col>

          {/* budget box */}
          <Col xs={12} lg={7} md={7}>
            <div className={local.clubContainer}>
              <Row className={local.clubListContainer}>
                {this.props.clubs.length === 0
                  ? "No clubs available"
                  : this.props.clubs.map((club) =>
                      this.renderParticipantClubs(club)
                    )}
              </Row>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    players: state.players,
    clubs: state.clubs,
    localPlayerData: state.localPlayerData,
  };
}

export default connect(mapStateToProps, {
  fetchAllPlayers,
  updateCurrentPlayer,
  updateClubData,
  fetchLocalPlayerData,
  updateLocalPlayerData,
})(Home);

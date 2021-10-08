import React, {useContext} from "react";
import {Button, ButtonGroup, Container, Form, FormGroup, Row, Table} from "reactstrap";
import {Card, FormControl, InputGroup,} from "react-bootstrap";
import {getToken} from "../../api/authenticationService";
import {getCurrentGame} from "../player/AvailablePlayers";
import AppNavbar from "../AppNavbar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {
    decrementAdditionalPoints,
    decrementBestMove,
    decrementDefeatBlack,
    decrementDefeatRed,
    decrementDon,
    decrementPenalties,
    decrementPoints,
    decrementSheriff,
    decrementVictoryBlack,
    decrementVictoryRed,
    decrementWasKilled, endGame,
    incrementAdditionalPoints,
    incrementBestMove,
    incrementDefeatBlack,
    incrementDefeatRed,
    incrementDon,
    incrementPenalties,
    incrementPoints,
    incrementSheriff,
    incrementVictoryBlack,
    incrementVictoryRed,
    incrementWasKilled
} from "./IncrementButtons";
import {Link} from "react-router-dom";


class GameTicket extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [],
            search: "",
            pageNumber: 1,
            pageSize: 10,
            sortBy: "nickName",
            sortDir: "asc",
            gameNumber: null,
            gameUuid: null,
            gamePlayers: [],
            gameName: 'Новый стол'
        };

    }

    componentDidMount() {
        this.getCurrentGameAfterMount()
    }

    getCurrentGameAfterMount() {
        fetch('/game/' + getCurrentGame(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        })
            .then(response => response.json())
            .then(data => this.setState({
                        gameNumber: data.gameNumber,
                        gameUuid: data.gameUuid,
                        gamePlayers: data.players.sort((a, b) => a.nickName.localeCompare(b.nickName)),
                        gameName: data.name
                    }
                )
            );
    }

    render() {
        return <div>
            <Container>
                Hello game ticket
            </Container>
        </div>
    }
}

export default GameTicket;


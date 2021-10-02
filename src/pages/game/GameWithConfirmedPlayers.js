import React, {useContext} from "react";
import {Button, ButtonGroup, Container, Form, FormGroup, Row, Table} from "reactstrap";
import {Card, FormControl, InputGroup,} from "react-bootstrap";

import {getToken} from "../../api/authenticationService";
import {getCurrentGame} from "../player/AvailablePlayers";
import AppNavbar from "../AppNavbar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {
    decrementAdditionalPoints, decrementPenalties,
    decrementPoints, decrementWasKilled,
    incrementAdditionalPoints,
    incrementPenalties,
    incrementPoints, incrementWasKilled
} from "./IncrementButtons";


class GameWithConfirmedPlayers extends React.Component {

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
                        gamePlayers: data.players,
                        gameName: data.name
                    }
                )
            );
        console.log("gamePlayers -> " + this.state.gamePlayers)
    }

    render() {
        const {
            gamePlayers,
            gameName,
            isLoading
        } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }
        return (
            <div className={"bg-dark"}>
                <AppNavbar/>
                <div>
                    <Container>
                        <Row>
                            <h3>Название игры : {gameName} </h3>
                        </Row>
                    </Container>
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Body>
                        <Table bordered hover striped variant="dark">
                            <thead className={"text-white"}>
                            <tr>
                                <th>Имя</th>
                                <th>Очки</th>
                                <th>Доп.Очки</th>
                                <th>Штрафы</th>
                                <th>First Night kill</th>
                                <th>Количество игр</th>
                            </tr>
                            </thead>
                            <tbody className={"text-white"}>
                            {gamePlayers.length === 0 ? (
                                <tr align="center">
                                    <td colSpan="7">No players Available.</td>
                                </tr>
                            ) : (
                                gamePlayers.map((player) => (
                                    <tr key={player.playerUuid}>
                                        <td>{player.nickName}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementPoints(this,player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding:"10px"}}>
                                                {player.points}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementPoints(this,player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementAdditionalPoints(this,player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                             <span style={{padding:"10px"}}>
                                                {player.additionalPoints}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementAdditionalPoints(this,player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementPenalties(this,player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding:"10px"}}>
                                                {player.penalties}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementPenalties(this,player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementWasKilled(this,player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding:"10px"}}>
                                                {player.wasKilled}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementWasKilled(this,player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>{player.games}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default GameWithConfirmedPlayers;


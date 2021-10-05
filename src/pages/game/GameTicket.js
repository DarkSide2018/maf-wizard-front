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
                        <Table bordered hover striped variant="dark" style={{width: "100%"}}>
                            <thead className={"text-white"}>
                            <tr>
                                <th className={"confTh"}>Имя</th>
                                <th className={"confTh"}>Очки</th>
                                <th className={"confTh"}>Доп.Очки</th>
                                <th className={"confTh"}>Штрафы</th>
                                <th className={"confTh"}>First Night kill</th>
                                <th className={"confTh"}>Лучший ход</th>
                                <th className={"confTh"}>Победа за красных</th>
                                <th className={"confTh"}>Поражение за красных</th>
                                <th className={"confTh"}>Победа за черных</th>
                                <th className={"confTh"}>Поражение за черных</th>
                                <th className={"confTh"}>Шериф</th>
                                <th className={"confTh"}>Дон</th>
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
                                                onClick={() => decrementPoints(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding: "10px"}}>
                                                {player.points}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementPoints(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementAdditionalPoints(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding: "10px"}}>
                                                {player.additionalPoints}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementAdditionalPoints(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementPenalties(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding: "10px"}}>
                                                {player.penalties}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementPenalties(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementWasKilled(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding: "10px"}}>
                                                {player.wasKilled}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementWasKilled(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementBestMove(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding: "10px"}}>
                                                {player.bestMove}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementBestMove(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementVictoryRed(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding: "10px"}}>
                                                {player.victoriesRed}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementVictoryRed(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementDefeatRed(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding: "10px"}}>
                                                {player.defeatRed}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementDefeatRed(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementVictoryBlack(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding: "10px"}}>
                                                {player.victoriesBlack}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementVictoryBlack(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementDefeatBlack(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding: "10px"}}>
                                                {player.defeatBlack}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementDefeatBlack(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementSheriff(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding: "10px"}}>
                                                {player.sheriff}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementSheriff(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => decrementDon(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faMinus}/>
                                            </Button>
                                            <span style={{padding: "10px"}}>
                                                {player.don}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => incrementDon(this, player.playerUuid)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            <tr>
                                <td colSpan={"12"} style={{textAlign: "center"}}>

                                    <Button
                                        onClick={() => endGame(this)}
                                        style={{padding: "15px",margin:"15px"}}
                                        color="success" tag={Link} to="/dashboard"> Закончить игру</Button>
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default GameTicket;


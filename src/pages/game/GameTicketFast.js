import React from "react";
import {Button, Container, Table} from "reactstrap";
import {Card} from "react-bootstrap";
import {getToken} from "../../api/authenticationService";
import Drop from "./dropDowns/Drop";
import AppNavbar from "../AppNavbar";
import DropDownVictory from "./dropDowns/DropDownVictory";
import {getCurrentGame, setGameUuid} from "../player/AvailablePlayers";
import AdditionalPoints from "./dropDowns/AdditionalPoints";
import DropDownElection from "./dropDowns/DropDownElection";
import {currentTime} from "../../common/Time";
import './style-general.css';
import {Checkbox} from "./elements/CheckBox";
import {Stopwatch} from "./elements/StopWatch";
import {RolesTable} from "./elements/RolesTable";
import {Search} from "./dropDowns/DropDownSearch";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus} from "@fortawesome/free-solid-svg-icons";
import {withRouter} from "react-router-dom";

class GameTicketFast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showRoles: false,
            currentElection: [],
            players: [],
            election: [],
            selectPlayers: [],
            playersForElection: [],
            elections: [],
            nights: [],
            gameUuid: null,
            playerToSlot: [],
            gamePlayers: [],
            pushedSlots: [],
            availableSlots: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            edit: false,
            availableRoles: [
                'Шериф',
                'Дон',
                'Мафиози',
                'Мирный'],
            gameName: 'Новый стол'
        };
        this.endGame = this.endGame.bind(this);
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        console.log("start mount GameTicketFast")
        if (id === "new") {
            this.getCurrentGameAfterMount()
        } else {
            this.getOldGame(id)
            this.setState({
                edit:true
            })
        }
    }

    getOldGame(id) {
        fetch('/game/' + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        }).then(response => {
            if (response.status === 404) {
                this.newTable()
            } else {
                return response.json()
            }
        }).then(data => {
                let responsePlayers = data.players.sort((a, b) => a.nickName.localeCompare(b.nickName));
                data.playerToCardNumber.forEach(value => {
                    value.nickName = responsePlayers.filter(it => it.playerUuid === value.playerUuid).nickName
                })

                this.setState({
                        currentVictory: data.victory,
                        gameNumber: data.gameNumber,
                        gameUuid: data.gameUuid,
                        nights: data.nights,
                        elections: data.elections,
                        oldElections: this.generateOldElections(data.elections),
                        gamePlayers: responsePlayers,
                        availableSlots: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        gameName: data.name,
                        playerToSlot: data.playerToCardNumber,
                        pushedSlots: [],
                        currentElection: [],
                        election: <tr key={generateGuid()}>
                            <td key={generateGuid()}>Голосование</td>
                            <td key={generateGuid()} colSpan={"7"}>
                                <Button key={generateGuid()} style={{width: "100%"}}
                                        color="secondary"
                                        onClick={() => this.startElection()}
                                >Начать голосование</Button>
                            </td>
                        </tr>,
                        selectPlayers: []
                    }
                )
            }
        );
    }

    generateOldElections(elections) {
        if (elections !== [] && elections !== undefined) {
            return elections.sort((a, b) => a.sortOrder > (b.sortOrder)).map(item => {
                let key = generateGuid();
                let sortElection = item.sortOrder + 1;
                let gamblers = item.dropdowns.map(drop => {
                    return <Button key={generateGuid()} color="secondary">Cлот: {drop.slot} |
                        Голоса: {drop.numberOfVotes}</Button>
                })
                return <tr key={generateGuid()}>
                    <td key={key}>
                        Голосование {sortElection}
                    </td>
                    <td key={generateGuid()} colSpan={"7"}>
                        {gamblers} <Button style={{marginLeft: "10px"}}
                                           onClick={() => this.deleteElectionDropDown(item)}
                                           color="secondary"><FontAwesomeIcon icon={faMinus}/></Button>
                    </td>
                </tr>
            })
        }
    }

    getCurrentGameAfterMount() {
        let currentGame = getCurrentGame();
        console.log("currentGameUuid => " + currentGame)
        if (currentGame === null || currentGame === undefined || currentGame === 'undefined') {
            this.newTable()
        } else {
            this.getOldGame(currentGame)
        }

    }

    newTable() {
        let queryItem = {
            messageType: 'CreateGameRequest',
            gameUuid: null,
            name: 'Игра : ' + currentTime(),
            gameNumber: '',
            players: []
        }
        fetch('/game', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(queryItem),
        })
            .then(response => response.json())
            .then((data) => {
                console.log("created game response => " + JSON.stringify(data))
                setGameUuid(data.entityUuid)
                this.setState(
                    {
                        availableSlots: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    }
                )
            });
    }

    showRoles() {
        let roles = this.state.showRoles;
        this.setState(
            {
                showRoles: !roles
            }
        )
        this.getOldGame(getCurrentGame())
    }

    deleteElectionDropDown(value) {
        let electionId = value.electionId;
        let filtered = this.state.elections.filter(it => it.electionId !== electionId);
        fetch('/game/election/' + getCurrentGame() + '/' + electionId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        });
        this.setState(
            {
                elections: filtered,
                oldElections: this.generateOldElections(filtered)
            })
    }

    endGame(players) {
        let gameCommand = {
            gameUuid: getCurrentGame(),
            status: 'FINISHED',
            messageType: 'UpdateGameRequest',
            players: players
        }
        fetch('/game/finish', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(gameCommand),
        });
        localStorage.removeItem('GAME_UUID');
        this.props.history.push('/dashboard');
    }

    randomLanding() {
        let pls = this.state.playerToSlot
        this.state.gamePlayers.forEach((player, index) => {

            pls[index] = {
                slot: index + 1,
                playerUuid: player.playerUuid
            }
        })
        this.setState({
                playerToSlot: pls
            }
        )
        let gameCommand = {
            gameUuid: getCurrentGame(),
            status: 'ACTIVE',
            messageType: 'UpdateGameRequest',
            playerToCardNumber: pls
        }
        fetch('/game', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(gameCommand),
        });
    }

    deleteSlotFromElection(slot) {
        let filter = this.state.pushedSlots.filter(it => it !== slot);
        this.setState({
                pushedSlots: filter,
                election: this.generateElection(filter)
            }
        )
    }

    pushPlayerToElection(slot) {
        let modSlot = {
            slot: slot,
            numberOfVotes: 0
        }
        let pushedSlots = this.state.pushedSlots
        pushedSlots.push(modSlot)
        let currentElectionUpdated = this.state.currentElection;
        currentElectionUpdated.dropdowns = pushedSlots

        let availableSlotsList = this.generateAvailablePlayersForElection(this.state.availableSlots)
        this.setState({
            currentElection: currentElectionUpdated,
            selectPlayers: <tr key={generateGuid()}>
                <td>Выбор игроков</td>
                <td colSpan={"7"}>
                    {availableSlotsList}
                </td>
            </tr>,
            pushedSlots: pushedSlots,
            election: this.generateElection(pushedSlots)
        })

    }

    generateElection(pushedSlots) {
        let slotDropDownList = pushedSlots.map(slot => {
            return <div>
                <DropDownElection style={{marginRight: "10px", marginTop: '10px'}}
                                  size="sm" thatObject={this}
                                  pushedPlayer={slot}
                                  key={generateGuid()}
                                  variant="outline-danger">
                </DropDownElection>
            </div>
        });
        let minusSlotList = pushedSlots.map(slot => {
            return <div>
                <Button
                    size="sm"
                    style={{marginTop: "5px"}}
                    variant="outline-danger"
                    onClick={() => this.deleteSlotFromElection(slot)}
                >
                    <FontAwesomeIcon icon={faMinus}/>
                </Button>
            </div>
        });
        return <tr key={generateGuid()}>
            <td>Голосование</td>
            <td colSpan={"6"}>
                {slotDropDownList}
                <Button style={{marginRight: "10px", marginTop: '10px'}}
                        size="sm"
                        onClick={() => this.endElection()}
                        key={generateGuid()}
                        variant="outline-danger"> Закончить голосование
                </Button>
            </td>
            <td>
                {minusSlotList}
            </td>
        </tr>
    }

    endElection() {
        let body = JSON.stringify(this.state.currentElection);
        console.log("end election body request => " + body)
        fetch('/game/election', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: body,
        }).then(response => {
            this.setState({
                pushedPlayers: [],
                currentElection: [],
                election: <tr key={generateGuid()}>
                    <td>Голосование</td>
                    <td colSpan={"7"}>
                        <Button style={{width: "100%"}}
                                color="secondary"
                                onClick={() => this.startElection()}
                        >Начать голосование</Button>
                    </td>
                </tr>,
                selectPlayers: []
            })
            this.getCurrentGameAfterMount()
        })
    }

    generateAvailablePlayersForElection(slots) {
        return slots.map(slot => {
            return <Button style={{marginRight: "10px", marginTop: '10px'}}
                           size="sm"
                           key={generateGuid()}
                           onClick={() => this.pushPlayerToElection(slot)}
                           variant="outline-danger"> | Cлот : {slot} |
            </Button>
        });
    }

    startElection() {
        let gamePlayersList = this.generateAvailablePlayersForElection(this.state.availableSlots)
        let electionDto = {
            electionId: generateGuid(),
            gameUuid: getCurrentGame(),
            dropdowns: []
        }
        this.setState({
            currentElection: electionDto,
            election: <tr key={generateGuid()}>
                <td>Голосование</td>
                <td colSpan={"7"}>
                    Выбранные слоты :
                </td>
            </tr>,
            selectPlayers: <tr key={generateGuid()}>
                <td>Выбор игроков</td>
                <td colSpan={"7"}>
                    {gamePlayersList}
                </td>
            </tr>
        })
    }

    exportCsv() {
        fetch('/game/export/'+getCurrentGame(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/xml',
                'Authorization': 'Bearer ' + getToken()
            }
        }).then(res => {
            return res.blob();
        }).then(blob => {
            const href = window.URL.createObjectURL(blob);
            const a = this.linkRef.current;
            a.download = 'report.xml';
            a.href = href;
            a.click();
            a.href = '';
        }).catch(err => console.error(err));
    }


    toPlayersSelection(players) {
        let gameCommand = {
            gameUuid: getCurrentGame(),
            status: 'DRAFT',
            messageType: 'UpdateGameRequest',
            players: players
        }
        fetch('/game', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(gameCommand),
        });
        this.props.history.push('/new/table');
    }

    linkRef = React.createRef();

    render() {
        console.log("render start")
        const {
            nights,
            currentVictory,
            gamePlayers,
            playerToSlot,
            isLoading,
            availableSlots,
            selectPlayers,
            election,
            edit
        } = this.state;

        let availablePlayersForMurderList = ''
        let availablePlayersForSheriffList = ''
        let availablePlayersForDonList = ''
        let availableForLeftGameList = ''
        if (gamePlayers !== [] && gamePlayers !== undefined) {
            availablePlayersForMurderList = makeArray(7, "").map((item, index) => {
                let key = generateGuid();
                return <td key={key}>
                    <Drop nightNumber={index} type='killedPlayer' nights={nights} key={key + 'dr'}
                          players={gamePlayers}/>
                </td>
            })
            availablePlayersForSheriffList = makeArray(7, "").map((item, index) => {
                let key = generateGuid();
                return <td key={key}>
                    <Drop nightNumber={index} type='sheriffChecked' nights={nights} key={key + 'dr'}
                          players={gamePlayers}/>
                </td>
            })
            availablePlayersForDonList = makeArray(7, "").map((item, index) => {
                let key = generateGuid();
                return <td key={key}>
                    <Drop nightNumber={index} type='donChecked' key={key + 'dr'} nights={nights} players={gamePlayers}/>
                </td>
            })
            availableForLeftGameList = makeArray(7, "").map((item, index) => {
                let key = generateGuid();
                return <td key={key}>
                    <Drop nightNumber={index} type='leftGame' key={key + 'dr'} nights={nights} players={gamePlayers}/>
                </td>
            })
        }
        if (isLoading) {
            return <p>Loading...</p>;
        }
        let playerSelectionButton = <Button
            style={{float: "right"}}
            type="button"
            variant="outline-info"
            onClick={() => this.toPlayersSelection(gamePlayers)}>
            Вернуться к подбору игроков
        </Button>
        let endGameButton = <Button
            style={{float: "right"}}
            type="button"
            variant="outline-info"
            onClick={() => this.endGame(gamePlayers)}>
            Закончить игру
        </Button>
        let showRolesButton = <Button
            style={{float: "left"}}
            type="button"
            variant="outline-info"
            onClick={() => this.showRoles()}>
            Показать/Скрыть роли
        </Button>
        if (edit) {
            playerSelectionButton = []
            endGameButton = []

        }

        return <div className={"bg-general"}>
            <Container style={{width: "50%"}}>
                <AppNavbar/>
                <Card className={"bg-dark text-white"} style={{width: '100%', opacity: '0.8'}}>
                    <Card.Header>
                        {playerSelectionButton}
                    </Card.Header>
                    <Card.Body>
                        <Table bordered variant="dark">
                            <thead className={"text-white"}>
                            <tr key={generateGuid()}>
                                <th>Ночь №</th>
                                <th>1</th>
                                <th>2</th>
                                <th>3</th>
                                <th>4</th>
                                <th>5</th>
                                <th>6</th>
                                <th>7</th>
                            </tr>
                            </thead>
                            <tbody className={"text-white"}>
                            <tr key={generateGuid()}>
                                <td>Убийство</td>
                                {availablePlayersForMurderList}
                            </tr>
                            <tr key={generateGuid()}>
                                <td>Дон проверил</td>
                                {availablePlayersForDonList}
                            </tr>
                            <tr key={generateGuid()}>
                                <td>Шериф проверил</td>
                                {availablePlayersForSheriffList}
                            </tr>
                            <tr key={generateGuid()}>
                                <td>Покинул игру</td>
                                {availableForLeftGameList}
                            </tr>
                            {this.state.oldElections}
                            {election}
                            {selectPlayers}
                            <tr key={generateGuid()}>
                                <td>Победа</td>
                                <td colSpan={"7"}>
                                    <DropDownVictory victory={currentVictory}>

                                    </DropDownVictory>
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
                <div style={{
                    textAlign: "center",
                    height: '150px',
                    marginTop: "60px",
                    marginBottom: "60px"
                }}>
                    <div className={"bg-dark text-white"} style={{
                        width: "30%",
                        marginLeft: "30px",
                        paddingTop: "30px",
                        borderRadius: "50px",
                        textAlign: "center"
                    }}>
                        <Stopwatch className={"text-white"}/>
                    </div>
                </div>
                <Card className={"bg-dark text-white"} style={{opacity: '0.8'}}>
                    <Card.Body>
                        <Table bordered variant="dark">
                            <thead className={"text-white"}>
                            <tr key={generateGuid()}>
                                <th>Номер слота</th>
                                <th>Имя игрока</th>
                                <th>Замечание</th>
                                <th>Баллы</th>
                            </tr>
                            </thead>
                            <tbody className={"text-white"}>
                            {availableSlots.map((item, index) => {
                                let checks = generateCheckBoxes(index + 1, playerToSlot);
                                return <tr key={generateGuid()}>
                                    <td key={generateGuid()}>
                                        {index + 1}
                                    </td>
                                    <td key={generateGuid()}>
                                        <Search slot={index + 1} pls={playerToSlot}/>
                                    </td>
                                    <td key={generateGuid()}>
                                        <Checkbox slot={index + 1} pls={playerToSlot} checks={checks}/>
                                    </td>
                                    <td key={generateGuid()}>
                                        <AdditionalPoints playersToSlot={playerToSlot} slot={index + 1}
                                                          editProp={edit}
                                                          key={generateGuid()}>
                                        </AdditionalPoints>
                                    </td>
                                </tr>
                            })}
                            </tbody>
                        </Table>
                        {endGameButton}
                        <Button
                            type="button"
                            style={{marginLeft: "15px"}}
                            variant="outline-info"
                            onClick={() => this.exportCsv()}>
                            ExportXml
                        </Button>
                        <a ref={this.linkRef}/>
                        {showRolesButton}
                    </Card.Body>
                </Card>
                {this.state.showRoles === true ? (
                    <RolesTable playersToSlot={playerToSlot}>

                    </RolesTable>
                ) : (
                    <div>

                    </div>
                )}
            </Container>
        </div>
    }
}

function generateCheckBoxes(slot, playerToCardNumber) {
    let pls = playerToCardNumber.filter(it => it.slot === slot)[0]
    if (pls === undefined) return
    let value1 = false
    let value2 = false
    let value3 = false
    let value4 = false
    for (let i = 0; i < pls.note; i++) {
        if (i === 0) value1 = true
        if (i === 1) value2 = true
        if (i === 2) value3 = true
        if (i === 3) value4 = true
    }
    return {
        checked1: value1,
        checked2: value2,
        checked3: value3,
        checked4: value4
    }
}

function makeArray(count, content) {
    let result = [];
    if (typeof content == "function") {
        for (let i = 0; i < count; i++) {
            result.push(content(i));
        }
    } else {
        for (let i = 0; i < count; i++) {
            result.push(content);
        }
    }
    return result;
}

export default withRouter(GameTicketFast);

export function generateGuid() {
    let result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
        if (j === 8 || j === 12 || j === 16 || j === 20)
            result = result + '-';
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result = result + i;
    }
    return result;
}
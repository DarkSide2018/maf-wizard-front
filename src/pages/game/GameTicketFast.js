import React from "react";
import {Button, Container, Table} from "reactstrap";
import {Card,} from "react-bootstrap";
import {getToken} from "../../api/authenticationService";
import Drop from "./dropDowns/Drop";
import AppNavbar from "../AppNavbar";
import DropDownPlayers from "./dropDowns/DropDownPlayers";
import DropDownVictory from "./dropDowns/DropDownVictory";
import {getCurrentGame, setGameUuid} from "../player/AvailablePlayers";
import AdditionalPoints from "./dropDowns/AdditionalPoints";
import DropDownElection from "./dropDowns/DropDownElection";
import {currentTime} from "../../common/Time";
import './style.css';
import {Checkbox} from "./elements/CheckBox";
import {Stopwatch} from "./elements/StopWatch";

class GameTicketFast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentElection: '',
            players: [],
            election: '',
            selectPlayers: '',
            playersForElection: '',
            nights: [],
            gameUuid: null,
            playerToSlot:[],
            gamePlayers: [],
            pushedPlayers: [],
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
        console.log("id -> " + id)
        if (id === "new") {
            this.getCurrentGameAfterMount()
        } else {
            this.setState({
                edit: true
            })
            setGameUuid(id)
            this.getOldGame(id)
        }

        this.setState({
            election: <tr key={generateGuid()}>
                <td> Голосование </td>
                <td colSpan={"7"}>
                    <Button style={{width: "100%"}}
                            color="secondary"
                            onClick={() => this.startElection()}
                    >Начать голосование</Button>
                </td>
            </tr>
        })
    }

    getOldGame(id) {
        fetch('/game/' + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        })
            .then(response => response.json())
            .then(data => {
                    let responsePlayers = data.players.sort((a, b) => a.nickName.localeCompare(b.nickName));
                    this.setState({
                            currentVictory: data.victory,
                            gameNumber: data.gameNumber,
                            gameUuid: data.gameUuid,
                            nights: data.nights,
                            elections: data.elections,
                            election:'',
                            gamePlayers: responsePlayers,
                            gameName: data.name,
                            playerToSlot: data.playerToCardNumber
                        }
                    )
                }
            );
    }

    getCurrentGameAfterMount() {
        fetch('/game/active', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        })
            .then(response => {
                if(response.status === 200){
                    let data = response.json()
                    console.log("gameActive => " + JSON.stringify(data))
                    let responsePlayers = data.players.sort((a, b) => a.nickName.localeCompare(b.nickName));
                    this.setState({
                            elections: data.elections,
                            currentVictory: data.victory,
                            gameNumber: data.gameNumber,
                            gameUuid: data.gameUuid,
                            nights: data.nights,
                            gamePlayers: responsePlayers,
                            playersForElection: responsePlayers,
                            gameName: data.name,
                            playerToSlot: data.playerToCardNumber
                        }
                    )
                }else if(response.status === 404){
                    this.newTable()
                }
            });
    }
    newTable() {
        let queryItem = {
            messageType: 'CreateGameRequest',
            gameUuid: null,
            name: 'Новая игра от ' + currentTime(),
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
                setGameUuid(data.entityUuid)
                this.setState(
                    {
                        gamePlayers: [1,2,3,4,5,6,7,8,9,10],
                    }
                )
            });
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

    pushPlayerToElection(player) {
        let pushPlayers = this.state.pushedPlayers
        let filteredPlayersForElection = this.state.playersForElection.filter(item => item.playerUuid !== player.playerUuid)
        let pls = this.state.playerToSlot.filter(item => item.playerUuid === player.playerUuid)
        player.slot = pls[0].slot
        pushPlayers.push(player)
        let currentElectionUpdated = this.state.currentElection;
        currentElectionUpdated.dropdowns = pushPlayers

        let pushPlayersList = pushPlayers.map(player => {

            return <div>
                <DropDownElection style={{marginRight: "10px", marginTop: '10px'}}
                                  size="sm" thatObject={this}
                                  pushedPlayer={player}
                                  key={generateGuid()}
                                  variant="outline-danger">
                </DropDownElection>

            </div>

        });
        let gamePlayersList = this.generateAvailablePlayersForElection(filteredPlayersForElection)
        this.setState({
            currentElection: currentElectionUpdated,
            playersForElection: filteredPlayersForElection,
            selectPlayers: <tr key={generateGuid()}>
                <td>Выбор игроков</td>
                <td colSpan={"7"}>
                    {gamePlayersList}
                </td>
            </tr>,
            pushedPlayers: pushPlayers,
            election: <tr key={generateGuid()}>
                <td>Голосование</td>
                <td colSpan={"7"}>
                    {pushPlayersList}
                    <Button style={{marginRight: "10px", marginTop: '10px'}}
                            size="sm"
                            onClick={() => this.endElection()}
                            key={generateGuid()}
                            variant="outline-danger"> Закончить голосование
                    </Button>
                </td>
            </tr>
        })

    }

    endElection(){
        fetch('/game/election', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(this.state.currentElection),
        }).then(response => {
            this.setState({
                pushedPlayers:[],
                currentElection: '',
                election: <tr key={generateGuid()}>
                    <td>Голосование</td>
                    <td colSpan={"7"}>
                        <Button style={{width: "100%"}}
                                color="secondary"
                                onClick={() => this.startElection()}
                        >Начать голосование</Button>
                    </td>
                </tr>,
                selectPlayers:''
            })
            this.getCurrentGameAfterMount()
        })
    }

    generateAvailablePlayersForElection(players) {
        return players.map(player => {
            let pls = this.state.playerToSlot.filter(item => item.playerUuid === player.playerUuid)
            return <Button style={{marginRight: "10px", marginTop: '10px'}}
                           size="sm"
                           key={generateGuid()}
                           onClick={() => this.pushPlayerToElection(player)}
                           variant="outline-danger"> | Cлот : {pls[0].slot} | {player.nickName} |
            </Button>
        });
    }

    startElection() {
        if(this.state.playersForElection.length !== this.state.playerToSlot.length){
            alert("Игроки не на своих местах")
            return
        }
        let gamePlayersList = this.generateAvailablePlayersForElection(this.state.playersForElection)
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
                    Выбранные игроки :
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

    render() {
        const {
            nights,
            elections,
            currentVictory,
            gamePlayers,
            playerToSlot,
            isLoading,
            selectPlayers,
            election,
            edit
        } = this.state;

        let availablePlayersForMurderList = ''
        let availablePlayersForSheriffList = ''
        let availablePlayersForDonList = ''
        let availableForLeftGameList = ''
        let oldElections = ''
        if(elections !== [] && elections !== undefined){
            oldElections = elections.sort((a, b) => a.sortOrder > (b.sortOrder)).map(item=>{
                let key = generateGuid();
                let sortElection = item.sortOrder+1;
                let gamblers = item.dropdowns.map(drop=>{
                 return  <Button color="secondary"> {drop.nickName} | {drop.numberOfVotes}</Button>})
                return <tr key={key}>
                        <td>
                            Голосование {sortElection}
                        </td>
                          <td colSpan={"7"}>
                              {gamblers}
                          </td>
                </tr>
            })
        }
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
        if (edit) {
            playerSelectionButton = ""
            endGameButton = ""
        }

        return <div className={"bg-general"}>
            <Container>
                <AppNavbar/>
                <Card className={"bg-dark text-white"} style={{width: '103%', opacity: '0.8'}}>
                    <Card.Header>
                        {playerSelectionButton}
                    </Card.Header>
                    <Card.Body>
                        <Table bordered variant="dark">
                            <thead className={"text-white"}>
                            <tr key={generateGuid()}>
                                <th>Ночные действия</th>
                                <th>1 ночь</th>
                                <th>2 ночь</th>
                                <th>3 ночь</th>
                                <th>4 ночь</th>
                                <th>5 ночь</th>
                                <th>6 ночь</th>
                                <th>7 ночь</th>
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
                            {oldElections}
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
                <div style={{height: '250px'}}>
                    <Stopwatch/>
                </div>
                <Card className={"bg-dark text-white"} style={{opacity: '0.8'}}>
                    <Card.Body>
                        <Table bordered variant="dark">
                            <thead className={"text-white"}>
                            <tr key={generateGuid()}>
                                <th>Номер слота</th>
                                <th>Имя игрока</th>
                                <th>Замечание</th>
                                <th>Доп.Баллы</th>
                            </tr>
                            </thead>
                            <tbody className={"text-white"}>
                            {gamePlayers.map((item, index) => {
                                return <tr key={generateGuid()}>
                                    <td key={generateGuid()}>
                                        {index + 1}
                                    </td>
                                    <td key={generateGuid()}>
                                        <DropDownPlayers playersToSlot={playerToSlot} slot={index + 1}
                                                         key={generateGuid()} players={gamePlayers}>

                                        </DropDownPlayers>
                                    </td>
                                    <td key={generateGuid()}>
                                        <Checkbox/>
                                    </td>
                                    <td key={generateGuid()}>
                                        <AdditionalPoints playersToSlot={playerToSlot} slot={index + 1}
                                                          key={generateGuid()}>

                                        </AdditionalPoints>
                                    </td>
                                </tr>
                            })}
                            </tbody>
                        </Table>
                        {endGameButton}
                    </Card.Body>
                </Card>
            </Container>
        </div>
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

export default GameTicketFast;

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
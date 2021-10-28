import React from "react";
import {Button, Container, Table} from "reactstrap";
import {Card,} from "react-bootstrap";
import {getToken} from "../../api/authenticationService";
import Drop from "./Drop";
import DropDownRole from "./DropDownRole";
import AppNavbar from "../AppNavbar";
import DropDownPlayers from "./DropDownPlayers";
import Notes from "./Notes";
import DropDownVictory from "./DropDownVictory";
import {getCurrentGame, setGameUuid} from "../player/AvailablePlayers";


class GameTicket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            nights: [],
            gameUuid: null,
            gamePlayers: [],
            edit: false,
            availableRoles: [
                'Шериф',
                'Дон',
                'Мафиози1',
                'Мафиози2',
                'Мирный1',
                'Мирный2',
                'Мирный3',
                'Мирный4',
                'Мирный5',
                'Мирный6'],
            gameName: 'Новый стол'
        };
        this.endGame = this.endGame.bind(this);
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        console.log("id -> " + id)
        if(id === "new"){
            this.getCurrentGameAfterMount()
        }else{
            this.setState({
                edit:true
            })
            setGameUuid(id)
            this.getOldGame(id)
        }
    }
    getOldGame(id){
        fetch('/game/'+id, {
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
                            currentVictory:data.victory,
                            gameNumber: data.gameNumber,
                            gameUuid: data.gameUuid,
                            nights: data.nights,
                            gamePlayers: responsePlayers,
                            gameName: data.name,
                            playerToSlot:data.playerToCardNumber
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
            .then(response => response.json())
            .then(data => {
                    let responsePlayers = data.players.sort((a, b) => a.nickName.localeCompare(b.nickName));
                    this.setState({
                            currentVictory:data.victory,
                            gameNumber: data.gameNumber,
                            gameUuid: data.gameUuid,
                            nights: data.nights,
                            gamePlayers: responsePlayers,
                            gameName: data.name,
                            playerToSlot:data.playerToCardNumber
                        }
                    )
                }
            );
    }
    endGame(players){
        console.log("finish game")
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
    toPlayersSelection(players){
        console.log("toPlayersSelection")
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
            currentVictory,
            availableRoles,
            gamePlayers,
            playerToSlot,
            isLoading,
            edit
        } = this.state;


        let availablePlayersForMurderList = ''
        let availablePlayersForSheriffList = ''
        let availablePlayersForDonList = ''
        let availableForLeftGameList = ''
        if (gamePlayers !== [] && gamePlayers !== undefined) {
            availablePlayersForMurderList = makeArray(7, "").map((item,index) => {
                let key = generateGuid();
                return <td key={key}>
                    <Drop nightNumber={index} type='killedPlayer' nights={nights} key={key+'dr'}  players={gamePlayers}/>
                </td>
            })
            availablePlayersForSheriffList = makeArray(7, "").map((item,index) => {
                let key = generateGuid();
                return <td key={key}>
                    <Drop nightNumber={index} type='sheriffChecked' nights={nights} key={key+'dr'} players={gamePlayers}/>
                </td>
            })
            availablePlayersForDonList = makeArray(7, "").map((item,index) => {
                let key = generateGuid();
                return <td key={key}>
                    <Drop nightNumber={index} type='donChecked' key={key+'dr'}  nights={nights} players={gamePlayers}/>
                </td>
            })
            availableForLeftGameList = makeArray(7, "").map((item,index) => {
                let key = generateGuid();
                return <td key={key}>
                    <Drop nightNumber={index} type='leftGame' key={key+'dr'}  nights={nights} players={gamePlayers}/>
                </td>
            })
        }
        if (isLoading) {
            return <p>Loading...</p>;
        }
        let playerSelectionButton = <Button
            style={{float:"right"}}
            type="button"
            variant="outline-info"
            onClick={()=>this.toPlayersSelection(gamePlayers)}>
            Вернуться к подбору игроков
        </Button>
        let endGameButton =        <Button
            style={{float:"right"}}
            type="button"
            variant="outline-info"
            onClick={()=>this.endGame(gamePlayers)}>
            Закончить игру
        </Button>
        if(edit){
            playerSelectionButton = ""
            endGameButton=""
        }

        return <div className={"bg-dark"}>
            <AppNavbar/>
            <Container>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        {playerSelectionButton}
                    </Card.Header>
                    <Card.Body>
                        <Table bordered hover striped variant="dark">
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

                <Card  className={"border border-dark bg-dark text-white"}>
                <Card.Body>
                    <Table bordered hover striped variant="dark">
                        <thead className={"text-white"}>
                        <tr key={generateGuid()}>
                            <th>Номер слота</th>
                            <th>Имя игрока</th>
                            <th>Роль игрока</th>
                            <th>Замечание</th>
                        </tr>
                        </thead>
                        <tbody className={"text-white"}>
                        {gamePlayers.map((item,index) => {
                            return <tr key={generateGuid()}>
                                <td key={generateGuid()}>
                                    {index+1}
                                </td>
                                <td key={generateGuid()}>
                                    <DropDownPlayers playersToSlot={playerToSlot} slot={index+1} key={generateGuid()} players={gamePlayers}>

                                    </DropDownPlayers>
                                </td>
                                <td key={generateGuid()}>
                                    <DropDownRole playersToSlot={playerToSlot} slot={index+1} key={generateGuid()} players={gamePlayers} roles={availableRoles}>

                                    </DropDownRole>
                                </td>
                                <td key={generateGuid()}>
                                    <Notes playersToSlot={playerToSlot} slot={index+1} key={generateGuid()}>

                                    </Notes>
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

export default GameTicket;

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
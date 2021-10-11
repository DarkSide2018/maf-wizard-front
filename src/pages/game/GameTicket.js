import React from "react";
import {Container, Table} from "reactstrap";
import {Card,} from "react-bootstrap";
import {getToken} from "../../api/authenticationService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons";
import Drop from "./Drop";
import DropDownRole from "./DropDownRole";
import AppNavbar from "../AppNavbar";


class GameTicket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            nights: [],
            gameUuid: null,
            gamePlayers: [],
            availablePlayersForMurder: [],
            availablePlayersForSheriff: [],
            availablePlayersForDon: [],
            availableForLeftGame: [],
            availableRoles: [
                'шериф',
                'Дон',
                'мафиози1',
                'мафиози2',
                'мирный1',
                'мирный2',
                'мирный3',
                'мирный4',
                'мирный5',
                'мирный6'],
            gameName: 'Новый стол'
        };
    }

    componentDidMount() {
        this.getCurrentGameAfterMount()
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
                            gameNumber: data.gameNumber,
                            gameUuid: data.gameUuid,
                            nights: data.nights,
                            gamePlayers: responsePlayers,
                            gameName: data.name,
                            availablePlayersForMurder: responsePlayers,
                            availablePlayersForSheriff: responsePlayers,
                            availableForLeftGame: responsePlayers,
                            availablePlayersForDon: responsePlayers,
                        }
                    )
                }
            );
    }

    render() {
        const {
            nights,
            availablePlayersForMurder,
            availablePlayersForSheriff,
            availablePlayersForDon,
            availableForLeftGame,
            availableRoles,
            gamePlayers,
            gameName,
            isLoading
        } = this.state;


        let availablePlayersForMurderList = ''
        if (availablePlayersForMurder !== [] && availablePlayersForMurder !== undefined) {
            availablePlayersForMurderList = makeArray(7, "").map((item,index) => {
                let key = generateGuid();
                return <td key={key}>
                    <Drop nightNumber={index} type='killedPlayer' nights={nights} key={key+'dr'}  players={availablePlayersForMurder}/>
                </td>
            })
        }
        let availablePlayersForSheriffList = ''
        if (availablePlayersForSheriff !== [] && availablePlayersForSheriff !== undefined) {
            availablePlayersForSheriffList = makeArray(7, "").map((item,index) => {
                let key = generateGuid();
                return <td key={key}>
                    <Drop nightNumber={index} type='sheriffChecked' nights={nights} key={key+'dr'} players={availablePlayersForSheriff}/>
                </td>
            })
        }
        let availablePlayersForDonList = ''
        if (availablePlayersForDon !== [] && availablePlayersForDon !== undefined) {
            availablePlayersForDonList = makeArray(7, "").map((item,index) => {
                let key = generateGuid();
                return <td key={key}>
                    <Drop nightNumber={index} type='donChecked' key={key+'dr'}  nights={nights} players={availablePlayersForDon}/>
                </td>
            })
        }

        let availableForLeftGameList = ''
        if (availableForLeftGame !== [] && availableForLeftGame !== undefined) {
            availableForLeftGameList = makeArray(7, "").map((item,index) => {
                let key = generateGuid();
                return <td key={key}>
                    <Drop nightNumber={index} type='leftGameList' key={key+'dr'}  nights={nights} players={availableForLeftGame}/>
                </td>
            })
        }
        if (isLoading) {
            return <p>Loading...</p>;
        }

        return <div>
            <AppNavbar/>
            <Container>
                {gameName}
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div style={{float: "left"}}>
                            <FontAwesomeIcon icon={faList}/> Ночи
                        </div>
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
                                <td>
                                    {index+1}
                                </td>
                                <td>
                                    {index}
                                </td>
                                <td>
                                    <DropDownRole roles={availableRoles}>

                                    </DropDownRole>
                                </td>
                                <td>
                                    {index}
                                </td>
                            </tr>
                        })}
                        </tbody>
                    </Table>
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
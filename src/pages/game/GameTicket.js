import React from "react";
import {Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table} from "reactstrap";
import {Card,} from "react-bootstrap";
import {getToken} from "../../api/authenticationService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons";


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
            availableForLeftGame:[],
            gameName: 'Новый стол'
        };
        this.drop = this.drop.bind(this);
    }
    drop = () => {
        return (
            <Dropdown isOpen={false}>
                <DropdownToggle caret>
                    Dropdown
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>Header</DropdownItem>
                    <DropdownItem>Some Action</DropdownItem>
                    <DropdownItem text>Dropdown Item Text</DropdownItem>
                    <DropdownItem disabled>Action (disabled)</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Foo Action</DropdownItem>
                    <DropdownItem>Bar Action</DropdownItem>
                    <DropdownItem>Quo Action</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
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
                            availablePlayersForDon: responsePlayers,
                        }
                    )
                }
            );
    }

    render() {
        const {
            availablePlayersForMurder,
            availablePlayersForSheriff,
            availablePlayersForDon,
            availableForLeftGame,
            gamePlayers,
            gameName,
            isLoading
        } = this.state;



        let availablePlayersForMurderList = ''
        if (availablePlayersForMurder !== [] && availablePlayersForMurder !== undefined) {
            availablePlayersForMurderList = makeArray(7, "").map(item => {
                return <td>
                    {this.drop()}
                </td>
            })
        }
        let availablePlayersForSheriffList = ''
        if (availablePlayersForSheriff !== [] && availablePlayersForSheriff !== undefined) {
            availablePlayersForSheriffList = makeArray(7, "").map(item => {
                return <td>
                    {this.drop()}
                </td>
            })
        }
        let availablePlayersForDonList = ''
        if (availablePlayersForDon !== [] && availablePlayersForDon !== undefined) {
            availablePlayersForDonList = makeArray(7, "").map(item => {
                return <td>
                    {this.drop()}
                </td>
            })
        }
        let availableForLeftGameList = ''
        if (availableForLeftGame !== [] && availableForLeftGame !== undefined) {
            availableForLeftGameList = makeArray(7, "").map(item => {
                return <td>
                    {this.drop()}
                </td>
            })
        }


        if (isLoading) {
            return <p>Loading...</p>;
        }

        return <div>
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
                            <tr>
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
                            <tr>
                                <td>Убийство</td>
                                {availablePlayersForMurderList}
                            </tr>
                            <tr>
                                <td>Дон проверил</td>
                                {availablePlayersForDonList}
                            </tr>
                            <tr>
                                <td>Шериф проверил</td>
                                {availablePlayersForSheriffList}
                            </tr>
                            <tr>
                                <td>Покинул игру</td>
                                {availableForLeftGameList}
                            </tr>
                            </tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer>
                    </Card.Footer>
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


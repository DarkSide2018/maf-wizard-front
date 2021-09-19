import {Component} from "react";
import {Link} from "react-router-dom";
import {Button, ButtonGroup, Container, Table} from "reactstrap";
import AppNavbar from "../AppNavbar";
import axios from "axios";
import {FormControl, InputGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

class PlayerList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [],
            search: ""
        };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.findAllPlayers()
    }

    findAllPlayers() {
        fetch('/player/all')
            .then(response => response.json())
            .then(data => this.setState({players: data}));
    }

    searchData = () => {
        fetch("/player/like/?nick=" + this.state.search)
            .then(response => response.json())
            .then((data) => {
                this.setState({players: data.players,
                });
            });
    };

    async remove(id) {
        await fetch(`/player/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedPlayers = [...this.state.players].filter(i => i.playerUuid !== id);
            this.setState({players: updatedPlayers});
        });
    }

    searchChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };
    cancelSearch = () => {
        this.setState({search: ""});
        this.findAllPlayers();
    };


    render() {
        const {players, search, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const playerList = players.map(player => {
            return <tr key={player.playerUuid}>
                <td style={{whiteSpace: 'nowrap'}}>{player.nickName}</td>
                <td>{player.points}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/player/" + player.playerUuid}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(player.playerUuid)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });
        return (
            <div>
                <AppNavbar/>
                <div style={{float: "right"}}>
                    <InputGroup size="sm">
                        <FormControl
                            placeholder="Search"
                            name="search"
                            value={search}
                            className={"info-border bg-dark text-white"}
                            onChange={this.searchChange}
                        />
                        <InputGroup.Append>
                            <Button
                                size="sm"
                                variant="outline-info"
                                type="button"
                                onClick={this.searchData}
                            >
                                <FontAwesomeIcon icon={faSearch}/>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-danger"
                                type="button"
                                onClick={this.cancelSearch}
                            >
                                <FontAwesomeIcon icon={faTimes}/>
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/player/new">Add Client</Button>
                    </div>
                    <h3>Игроки</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="30%">Name</th>
                            <th width="30%">Очки</th>
                            <th width="40%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {playerList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default PlayerList;


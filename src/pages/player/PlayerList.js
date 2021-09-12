import {Component} from "react";
import {Link} from "react-router-dom";
import {Button, ButtonGroup, Container, Table} from "reactstrap";
import AppNavbar from "../AppNavbar";
class PlayerList extends Component {

    constructor(props) {
        super(props);
        this.state = {players: []};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        fetch('/player/all')
            .then(response => response.json())
            .then(data => this.setState({players: data}));
    }
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
    render() {
        const {players, isLoading} = this.state;

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
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/player/new">Add Client</Button>
                    </div>
                    <h3>Players</h3>
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


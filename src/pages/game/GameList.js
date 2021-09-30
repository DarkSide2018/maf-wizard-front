import {Component} from "react";
import {Link} from "react-router-dom";
import {Button, ButtonGroup, Container, Table} from "reactstrap";
import AppNavbar from "../AppNavbar";
import {getToken} from "../../api/authenticationService";
class GameList extends Component {

    constructor(props) {
        super(props);
        this.state = {games: []};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        fetch('/game/all',{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization':'Bearer '+getToken()
            }
        })
            .then(response => response.json())
            .then(data => this.setState({games: data.games}));
    }
    async remove(id) {
        await fetch(`/game/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedGames = [...this.state.games].filter(i => i.gameUuid !== id);
            this.setState({games: updatedGames});
        });
    }
    render() {
        const {games, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const gameList = games.map(game => {
            return <tr key={game.gameUuid}>
                <td style={{whiteSpace: 'nowrap'}}>{game.gameNumber}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/game/component/" + game.gameUuid}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(game.gameUuid)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/game/new">Add Game</Button>
                    </div>
                    <h3>Игры</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="30%">Name</th>
                            <th width="40%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {gameList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}
export default GameList;


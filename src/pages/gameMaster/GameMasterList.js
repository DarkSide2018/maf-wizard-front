import {Component} from "react";
import {Link} from "react-router-dom";
import {Button, ButtonGroup, Container, Table} from "reactstrap";
import AppNavbar from "../AppNavbar";
import {getToken} from "../../api/authenticationService";
class GameMasterList extends Component {

    constructor(props) {
        super(props);
        this.state = {gameMasters: []};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        fetch('/game/master/all',{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization':'Bearer '+getToken()
            }
        })
            .then(response => response.json())
            .then(data => this.setState({gameMasters: data.gameMasters}));
    }
    async remove(id) {
        await fetch(`/game/master/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedGameMasters = [...this.state.gameMasters].filter(i => i.gameMasterUuid !== id);
            this.setState({gameMasters: updatedGameMasters});
        });
    }
    render() {
        const {gameMasters, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const gameMasterList = gameMasters.map(gameMaster => {
            return <tr key={gameMaster.gameMasterUuid}>
                <td style={{whiteSpace: 'nowrap'}}>{gameMaster.nickName}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/game/master/" + gameMaster.gameMasterUuid}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(gameMaster.gameMasterUuid)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/game/master/new">Add Client</Button>
                    </div>
                    <h3>Ведущие</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="30%">Name</th>
                            <th width="40%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {gameMasterList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}
export default GameMasterList;


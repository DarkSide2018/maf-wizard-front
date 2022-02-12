import {Component} from "react";
import {Link} from "react-router-dom";
import {Button, ButtonGroup, Container, Table} from "reactstrap";
import AppNavbar from "../AppNavbar";
import {getToken} from "../../api/authenticationService";
import '../dashboard/DashBoard.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStepBackward, faStepForward} from "@fortawesome/free-solid-svg-icons";

class GameHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games: [],
            pageNumber: 0,
            pageSize: 10
        };
    }

    componentDidMount() {
        this.findGames(this.state.pageNumber)
    }

    findGames = (pageNumber) => {
        let req = {
            pageNumber: pageNumber,
            pageSize: 10
        }
        fetch('/game/all', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(req)
        })
            .then(response => response.json())
            .then(data => this.setState({
                games: data.games,
                pageNumber: data.pageNumber
            }));
    }

    prevPage = () => {
        let pageNumber = this.state.pageNumber;
        if (pageNumber === 0) return
        this.findGames(pageNumber - 1);

    };
    nextPage = () => {
        this.findGames(this.state.pageNumber + 1);
    };

    render() {
        const {games, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const gameList = games.map(game => {
            return <tr key={game.gameUuid}>
                <td style={{whiteSpace: 'nowrap'}}>{game.name}</td>
                <td>
                    <ButtonGroup>
                        <Button size="md" className={"bg-dark border-white"} tag={Link}
                                to={"/ticket/" + game.gameUuid}>Просмотреть</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });
        return (
            <div className={"bg-general"}>
                <Container className={"bg-second text-white"}>
                    <AppNavbar/>
                    <h3>Игры</h3>
                    <Table className="mt-4 text-white">
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
                    <Button
                        type="button"
                        variant="outline-info"
                        onClick={this.prevPage}>
                        <FontAwesomeIcon icon={faStepBackward}/> Prev
                    </Button>
                    <Button
                        type="button"
                        variant="outline-info"
                        onClick={this.nextPage}>
                        <FontAwesomeIcon icon={faStepForward}/> Next
                    </Button>
                </Container>
            </div>
        );
    }
}

export default GameHistory;


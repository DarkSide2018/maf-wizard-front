import {Component} from "react";
import {Link} from "react-router-dom";
import {Button, ButtonGroup, Container, Table} from "reactstrap";
import AppNavbar from "../AppNavbar";
import {FormControl, InputGroup, Card} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faFastBackward,
    faFastForward, faList,
    faSearch,
    faStepBackward,
    faStepForward,
    faTimes, faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {getToken} from "../../api/authenticationService";
import {UploadImage} from "./UploadImage";

class PlayerList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [],
            search: "",
            pageNumber: 1,
            pageSize: 10,
            sortBy: "nickName",
            sortDir: "asc",
        };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.findAllPlayers(this.state.pageNumber)
    }

    sortData = () => {
        setTimeout(() => {
            this.state.sortDir === "asc"
                ? this.setState({sortDir: "desc"})
                : this.setState({sortDir: "asc"});
            this.findAllPlayers(this.state.pageNumber);
        }, 500);
    };

    findAllPlayers(currentPage) {
        currentPage -= 1;

        fetch('/player/all', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(
                {
                    messageType: "ReadAllPlayersRequest",
                    nickName: this.state.search,
                    pageSize: this.state.pageSize,
                    pageNumber: currentPage,
                    sortBy: this.state.sortBy,
                    sortDir: this.state.sortDir
                }
            )
        })
            .then(response => response.json())
            .then(data => this.setState({
                players: data.players,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                pageNumber: data.pageNumber + 1
            }));
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


    changePage = (event) => {
        console.log("event->" + event.target.value)
        let targetPage = parseInt(event.target.value);
        if (this.state.search) {
            this.searchData(targetPage);
        } else {
            this.findAllPlayers(targetPage);
        }
        this.setState({
            [event.target.name]: targetPage,
        });
    };
    firstPage = () => {
        let firstPage = 1;
        if (this.state.pageNumber > firstPage) {
            if (this.state.search) {
                this.searchData(firstPage);
            } else {
                this.findAllPlayers(firstPage);
            }
        }
    };
    prevPage = () => {
        let prevPage = 1;
        if (this.state.pageNumber > prevPage) {
            if (this.state.search) {
                this.searchData(this.state.pageNumber - prevPage);
            } else {
                this.findAllPlayers(this.state.pageNumber - prevPage);
            }
        }
    };
    lastPage = () => {
        let condition = Math.ceil(
            this.state.totalElements / this.state.pageSize
        );
        if (this.state.pageNumber < condition) {
            if (this.state.search) {
                this.searchData(condition);
            } else {
                this.findAllPlayers(condition);
            }
        }
    };
    nextPage = () => {
        let result = this.state.pageNumber < Math.ceil(this.state.totalElements / this.state.pageSize);

        if (result) {
            if (this.state.search) {
                this.searchData(this.state.pageNumber + 1);
            } else {
                console.log("findAllPlayers")
                this.findAllPlayers(this.state.pageNumber + 1);
            }
        }
    };
    searchChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };
    cancelSearch = () => {
        this.setState({search: ""});
        this.findAllPlayers();
    };
    searchData = (currentPage) => {
        currentPage -= 1;
        fetch("/player/like", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    messageType: "SearchPlayerRequest",
                    nickName: this.state.search,
                    pageSize: this.state.pageSize,
                    pageNumber: currentPage,
                    sortBy: this.state.sortBy,
                    sortDir: this.state.sortDir
                }
            )
        })
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    players: data.players,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    pageNumber: data.pageNumber + 1,
                });
            });
    };

    render() {
        const {players, search, pageNumber, totalPages, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }
        return (
            <div className={"bg-dark"}>
                <Container>
                    <AppNavbar/>
                    <Card className={"border border-dark bg-dark text-white"}>
                        <Card.Header>
                            <div style={{float: "left"}}>
                                <FontAwesomeIcon icon={faList}/> Игроки
                            </div>
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
                        </Card.Header>
                        <Card.Body>
                            <div className="float-right">
                                <Button size="md" variant="outline-danger" tag={Link} to="/player/new">Добавить
                                    игрока</Button>
                            </div>
                            <Table bordered hover striped variant="dark">
                                <thead className={"text-white"}>
                                <tr>
                                    <th>Имя</th>
                                    <th>Фото</th>
                                    <th>Очки</th>
                                    <th>Доп.Очки</th>
                                    <th>Штрафы</th>
                                    <th>First Night kill</th>
                                    <th>Количество игр</th>
                                </tr>
                                </thead>
                                <tbody className={"text-white"}>
                                {players.length === 0 ? (
                                    <tr align="center">
                                        <td colSpan="7">No players Available.</td>
                                    </tr>
                                ) : (

                                    players.map((player) => (
                                        <tr key={player.playerUuid}>
                                            <td>{player.nickName}</td>
                                            <td>{player.image === "" ? (
                                                <UploadImage playerUuid={player.playerUuid}/>) : (
                                                <img src={"data:image/jpeg;base64," + player.image}/>)
                                            }</td>
                                            <td>{player.points}</td>
                                            <td>{player.additionalPoints}</td>
                                            <td>{player.penalties}</td>
                                            <td>{player.wasKilled}</td>
                                            <td>{player.games}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Link to={"/player/" + player.playerUuid}
                                                          className="btn btn-sm btn-outline-primary"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit}/>
                                                    </Link>{" "}
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </Table>
                        </Card.Body>
                        {players.length > 0 ? (
                            <Card.Footer>
                                <div style={{float: "left"}}>
                                    Showing Page {pageNumber} of {totalPages}
                                </div>
                                <div style={{float: "right"}}>
                                    <InputGroup size="sm">
                                        <InputGroup.Prepend>
                                            <Button
                                                type="button"
                                                variant="outline-info"
                                                disabled={pageNumber === 1}
                                                onClick={this.firstPage}
                                            >
                                                <FontAwesomeIcon icon={faFastBackward}/> First
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline-info"
                                                disabled={pageNumber === 1}
                                                onClick={this.prevPage}
                                            >
                                                <FontAwesomeIcon icon={faStepBackward}/> Prev
                                            </Button>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            className={"page-num bg-dark"}
                                            name="currentPage"
                                            onChange={this.changePage}
                                        />
                                        <InputGroup.Append>
                                            <Button
                                                type="button"
                                                variant="outline-info"
                                                disabled={pageNumber === totalPages}
                                                onClick={this.nextPage}
                                            >
                                                <FontAwesomeIcon icon={faStepForward}/> Next
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline-info"
                                                disabled={pageNumber === totalPages}
                                                onClick={this.lastPage}
                                            >
                                                <FontAwesomeIcon icon={faFastForward}/> Last
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </div>
                            </Card.Footer>
                        ) : null}
                    </Card>
                </Container>
            </div>
        );
    }

}

export default PlayerList;


import {Component} from "react";
import {Link} from "react-router-dom";
import {Button,ButtonGroup, Table} from "reactstrap";
import AppNavbar from "../AppNavbar";
import {FormControl,InputGroup,Card,} from "react-bootstrap";
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

class PlayerList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [],
            search: "",
            pageNumber: 1,
            pageSize: 5,
            sortBy:"nickName",
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
                ? this.setState({ sortDir: "desc" })
                : this.setState({ sortDir: "asc" });
            this.findAllPlayers(this.state.pageNumber);
        }, 500);
    };
    findAllPlayers(currentPage) {
        currentPage -= 1;

        fetch('/player/all',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    messageType:"ReadAllPlayersRequest",
                    nickName:this.state.search,
                    pageSize:this.state.pageSize,
                    pageNumber:currentPage,
                    sortBy:this.state.sortBy,
                    sortDir: this.state.sortDir
                }
            )
        })
            .then(response => response.json())
            .then(data => this.setState({
                players: data.players,
                totalPages: data.totalPages,
                totalElements:data.totalElements
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
        if (this.state.pageNumber < Math.ceil(this.state.totalElements / this.state.pageSize)) {
            if (this.state.search) {
                this.searchData(this.state.pageNumber + 1);
            } else {
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
        fetch("/player/like",{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    messageType:"SearchPlayerRequest",
                    nickName:this.state.search,
                    pageSize:this.state.pageSize,
                    pageNumber:currentPage,
                    sortBy:this.state.sortBy,
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
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div style={{ float: "left" }}>
                            <FontAwesomeIcon icon={faList} /> Book List
                        </div>
                        <div style={{ float: "right" }}>
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
                                        <FontAwesomeIcon icon={faSearch} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        type="button"
                                        onClick={this.cancelSearch}
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Table bordered hover striped variant="dark">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                            </tr>
                            </thead>
                            <tbody>
                            {players.length === 0 ? (
                                <tr align="center">
                                    <td colSpan="7">No players Available.</td>
                                </tr>
                            ) : (
                                players.map((player) => (
                                    <tr key={player.playerUuid}>
                                        <td>{player.nickName}</td>
                                        <td>{player.points}</td>
                                        <td>
                                            <ButtonGroup>
                                                <Link
                                                    to={"/player/" + player.playerUuid}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Link>{" "}
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => this.remove(player.playerUuid)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
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
                                <div style={{ float: "left" }}>
                                    Showing Page {pageNumber} of {totalPages}
                                </div>
                                <div style={{ float: "right" }}>
                                    <InputGroup size="sm">
                                        <InputGroup.Prepend>
                                            <Button
                                                type="button"
                                                variant="outline-info"
                                                disabled={pageNumber === 1}
                                                onClick={this.firstPage}
                                            >
                                                <FontAwesomeIcon icon={faFastBackward} /> First
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline-info"
                                                disabled={pageNumber === 1}
                                                onClick={this.prevPage}
                                            >
                                                <FontAwesomeIcon icon={faStepBackward} /> Prev
                                            </Button>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            className={"page-num bg-dark"}
                                            name="currentPage"
                                            value={pageNumber}
                                            onChange={this.changePage}
                                        />
                                        <InputGroup.Append>
                                            <Button
                                                type="button"
                                                variant="outline-info"
                                                disabled={pageNumber === totalPages}
                                                onClick={this.nextPage}
                                            >
                                                <FontAwesomeIcon icon={faStepForward} /> Next
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline-info"
                                                disabled={pageNumber === totalPages}
                                                onClick={this.lastPage}
                                            >
                                                <FontAwesomeIcon icon={faFastForward} /> Last
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </div>
                            </Card.Footer>
                    ) : null}
                </Card>
            </div>
        );
    }
}

export default PlayerList;


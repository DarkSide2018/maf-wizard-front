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
        }).then(response => response.json())
            .then(data => this.setState({
                players: data.players.sort(function (a, b) {
                    if (a.rating < b.rating) {
                        return 1;
                    }
                    if (a.rating > b.rating) {
                        return -1;
                    }
                    return 0;
                }),
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                pageNumber: data.pageNumber + 1
            }));
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
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
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
            <div className={"bg-general"}>
                <Container>
                    <AppNavbar/>
                    <Card className={"bg-dark text-white"} style={{opacity: "0.8"}}>
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
                                    <th>R</th>
                                    <th>P</th>
                                    <th>AP</th>
                                    <th>PS</th>
                                    <th>FNK</th>
                                    <th>VP</th>
                                    <th>VR</th>
                                    <th>VRP</th>
                                    <th>VB</th>
                                    <th>VBP</th>
                                    <th>DR</th>
                                    <th>DB</th>
                                    <th>GA</th>
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
                                            <td>{player.nickName}

                                            </td>
                                            <td> {player.image === "" ? (
                                                <UploadImage playerUuid={player.playerUuid}/>) : (
                                                <img src={"data:image/jpeg;base64," + player.image}/>)
                                            }
                                            </td>
                                            <td>{player.rating}</td>
                                            <td>{player.points}</td>
                                            <td>{player.additionalPoints}</td>
                                            <td>{player.penalties}</td>
                                            <td>{player.wasKilled}</td>
                                            <td>{player.victoriesPercent}</td>
                                            <td>{player.victoriesRed}</td>
                                            <td>{player.victoriesRedPercent}</td>
                                            <td>{player.victoriesBlack}</td>
                                            <td>{player.victoriesBlackPercent}</td>
                                            <td>{player.defeatRed}</td>
                                            <td>{player.defeatBlack}</td>
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
                    <div className={"text-white"}>P-баллы</div>
                    <div className={"text-white"}>AP-дополнительные баллы</div>
                    <div className={"text-white"}>PS-штрафы</div>
                    <div className={"text-white"}>FNK-был убит в первую ночь</div>
                    <div className={"text-white"}>VP-процент побед</div>
                    <div className={"text-white"}>VR-Количество побед за красных</div>
                    <div className={"text-white"}>VB-Количество побед за черных</div>
                    <div className={"text-white"}>VBP-Процент побед за черных</div>
                    <div className={"text-white"}>VRP-Процент побед за красных</div>
                    <div className={"text-white"}>DB-Поражения за черных</div>
                    <div className={"text-white"}>DR-Поражения за красных</div>
                    <div className={"text-white"}>GA-Количество сыгранных игр</div>
                </Container>
            </div>
        );
    }

}

export default PlayerList;


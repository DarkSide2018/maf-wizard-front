import React, {Component} from "react";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {getCurrentGame, setGameUuid} from "../../player/AvailablePlayers";
import {getToken} from "../../../api/authenticationService";
import './Drop.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {generateGuid} from "../GameTicket";

class DropDownPlayers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName: '',
            players: props.players,
            currentPlayer: '',
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.setPlayer = this.setPlayer.bind(this);
    }

    componentDidMount() {
        const {playersToSlot, slot, players} = this.props
        let filteredSlot = playersToSlot.filter(item => item.slot === slot)
        let playerUuid
        let playerName = ''
        let filteredPLayers
        if (filteredSlot !== undefined && filteredSlot.length > 0) {
            if (filteredSlot[0].playerUuid !== undefined) {
                playerUuid = filteredSlot[0].playerUuid
            }
        }
        if (playerUuid !== undefined) {
            filteredPLayers = players.filter(item => item.playerUuid === playerUuid)
        }

        if (filteredPLayers !== undefined && filteredPLayers.length > 0) {
            playerName = filteredPLayers[0].nickName
        }
        this.setState(
            {
                playerName: playerName,
                players: this.props.players
            }
        )
    }

    toggle() {
        let currentState = this.state.isOpen
        this.setState(
            {
                isOpen: !currentState
            }
        )
    }

    setPlayer(value) {
        const {slot} = this.props
        let name = value.nickName
        let pls = {
            slot: slot,
            playerUuid: value.playerUuid
        }
        this.setState(
            {
                currentPlayer: value
            }
        )
        let gameCommand = {
            gameUuid: getCurrentGame(),
            status: 'ACTIVE',
            messageType: 'UpdateGameRequest',
            playerToCardNumber: [pls]
        }
        fetch('/game', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(gameCommand),
        });
    }

    render() {
        return <div>

            <Search/>
        </div>
    }
}

export default DropDownPlayers;

function Search() {

    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchResults, setSearchResults] = React.useState([""]);
    const [currentName, setCurrentName] = React.useState("");
    const [createdPlayer, setCreatedPlayer] = React.useState("");
    const [isOpen, toggle] = React.useState(false);
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };
    const handlePlayerChange = event => {
        setCreatedPlayer(event.target.value);
    };

    React.useEffect(() => {
        let players = ["Новый Игрок"]
        fetch('/player/like/all/' + searchTerm, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        }).then(response => {
            if (response.ok) {
                response.json().then(data => {
                        data.players.sort((a, b) => a.nickName.localeCompare(b.nickName));
                        players = data.players.map(it => it.nickName);
                        console.log("players like => " + JSON.stringify(players))
                        setSearchResults(players);
                    }
                )
            }
        })
        setSearchResults(players);
    }, [searchTerm]);

    React.useEffect(() => {
     console.log("createdPlayer => " + createdPlayer)

    }, [setCreatedPlayer]);
    return (
        <div className="App">
            <Dropdown isOpen={isOpen} toggle={() => toggle(!isOpen)}>
                <DropdownToggle className={"dropStyle"} caret>
                    {currentName === "" ? (
                        <input
                            type="text"
                            placeholder="Search Player"
                            value={searchTerm}
                            onChange={handleChange}
                        />
                    ) : null}
                    {currentName}
                    {currentName !== "" ? (
                        <Button
                            size="sm"
                            variant="outline-danger"
                            style={{marginLeft: "10px"}}
                            onClick={() => setCurrentName("")}>
                            <FontAwesomeIcon icon={faMinus}/>
                        </Button>
                    ) : null}
                </DropdownToggle>
                <DropdownMenu>
                    {searchResults.map(item => (
                        <DropdownItem className={"dropStyle"} onClick={() => setCurrentName(item)} key={generateGuid()}>
                            {item}
                            <Button
                                size="sm"
                                variant="outline-danger"
                                style={{marginLeft: "10px"}}
                                onClick={() => assignPlayer(item)}>
                                <FontAwesomeIcon icon={faPlus}/>
                            </Button>
                        </DropdownItem>
                    ))}
                </DropdownMenu>
                {currentName === "Новый Игрок" ? (
                    <div style={{marginTop:"10px"}}>
                        <input
                            type="text"
                            placeholder="Создать нового игрока"
                            value={createdPlayer}
                            onChange={handlePlayerChange}
                        /> <Button
                        size="sm"
                        variant="outline-danger"
                        style={{marginTop: "10px"}}
                        onClick={() => assignPlayer(createdPlayer)}>
                        Создать
                    </Button>
                    </div>
                ) : null}
            </Dropdown>
        </div>
    );
}

function assignPlayer(value) {
    console.log("assignPlayer -> " + value)
}

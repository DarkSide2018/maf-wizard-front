import React, {Component} from "react";
import {Button} from "reactstrap";
import {getCurrentGame, setGameUuid} from "../../player/AvailablePlayers";
import {getToken} from "../../../api/authenticationService";
import './Drop.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";

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

    deletePlayer(value) {
        console.log(JSON.stringify(value))
    }


    render() {
        const people = [
            "Siri",
            "Alexa",
            "Google",
            "Facebook",
            "Twitter",
            "Linkedin",
            "Sinkedin"
        ];

        const {players, currentPlayer} = this.state
        return <div>
            <Button
                size="sm"
                variant="outline-danger"
                style={{marginLeft: "10px"}}
                onClick={() => this.deletePlayer(currentPlayer)}>
                <FontAwesomeIcon icon={faMinus}/>
            </Button>
            <Search/>
        </div>
    }
}

export default DropDownPlayers;

const people = [
    "Siri",
    "Alexa",
    "Google",
    "Facebook",
    "Twitter",
    "Linkedin",
    "Sinkedin"
];

function Search() {

    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchResults, setSearchResults] = React.useState(["-"]);
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };
    React.useEffect(() => {
        let players=["P"]
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
                        players = data.players.map(it=> it.nickName);
                        console.log("players like => " + JSON.stringify(players))
                        setSearchResults(players);
                    }
                )
            }
        })
        setSearchResults(players);
    }, [searchTerm]);
    return (
        <div className="App">
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
            />
            <ul>
                {searchResults.map(item => (
                    <li>{item} <Button
                        size="sm"
                        variant="outline-danger"
                        style={{marginLeft: "10px"}}
                        onClick={() => assignPlayer(item)}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function assignPlayer(value) {
    console.log("assignPlayer -> " + value)
}

import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {generateGuid} from "./GameTicket";
import {getCurrentGame} from "../player/AvailablePlayers";
import {getToken} from "../../api/authenticationService";


class Drop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName: '',
            players: props.players,
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.setPlayerName = this.setPlayerName.bind(this);
    }

    componentDidMount() {
        const {type, nightNumber, players, nights} = this.props
        console.log('nights=>' + JSON.stringify(nights[0]))
        console.log('type=>' + type)
        console.log('nightNumber=>' + nightNumber)
        let filteredNight = nights.filter(item => item.nightNumber === nightNumber)
        console.log('filteredNight=>' + JSON.stringify(filteredNight[0]))
        let playerUuid = ''
        let playerName = ''
        if (type === 'killedPlayer' && filteredNight !== undefined && filteredNight.killedPlayer !== undefined) {
            console.log('killed player branch')
            playerUuid = filteredNight.killedPlayer
        } else if (type === 'sheriffChecked' && filteredNight.sheriffChecked !== undefined) {
            playerUuid = filteredNight.sheriffChecked
        } else if (type === 'donChecked' && filteredNight.donChecked !== undefined) {
            playerUuid = filteredNight.donChecked
        }
        console.log('player-uuid=>' + playerUuid)

        this.setState(
            {
                playerName: playerName,
                players: players
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

    setPlayerName(value) {
        const {type, nightNumber} = this.props
        let night = {
            nightNumber: nightNumber
        }
        if (type === 'killedPlayer') {
            night.killedPlayer = value.playerUuid
        } else if (type === 'sheriffChecked') {
            night.sheriffChecked = value.playerUuid
        } else if (type === 'donChecked') {
            night.donChecked = value.playerUuid
        }
        let gameCommand = {
            gameUuid: getCurrentGame(),
            status: 'ACTIVE',
            messageType: 'UpdateGameRequest',
            nights: [night]
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
        this.setState(
            {
                playerName: value.nickName
            }
        )

    }


    render() {
        const {players} = this.state
        let dropDownTogglePlayerName = 'Cвободно'
        if (this.state.playerName !== '') {
            dropDownTogglePlayerName = this.state.playerName
        }
        return <div>

            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    {dropDownTogglePlayerName}
                </DropdownToggle>
                <DropdownMenu>
                    {players.map(item => {
                        return <DropdownItem onClick={() => this.setPlayerName(item)}
                                             key={generateGuid()}>{item.nickName}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default Drop;
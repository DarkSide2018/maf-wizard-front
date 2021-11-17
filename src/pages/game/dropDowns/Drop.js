import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {generateGuid} from "../GameTicket";
import {getCurrentGame} from "../../player/AvailablePlayers";
import {getToken} from "../../../api/authenticationService";

import './Drop.css';

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
        let filteredNight = nights.filter(item => item.nightNumber === nightNumber)
        let playerUuid
        let playerName = ''
        let filteredPLayers
        if (filteredNight !== undefined && filteredNight.length > 0) {
            if (type === 'killedPlayer' && filteredNight[0].killedPlayer !== undefined) {
                playerUuid = filteredNight[0].killedPlayer
            } else if (type === 'sheriffChecked' && filteredNight[0].sheriffChecked !== undefined) {
                playerUuid = filteredNight[0].sheriffChecked
            } else if (type === 'donChecked' && filteredNight[0].donChecked !== undefined) {
                playerUuid = filteredNight[0].donChecked
            } else if (type === 'leftGame' && filteredNight[0].playerLeftGame !== undefined) {
                playerUuid = filteredNight[0].playerLeftGame
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
        } else if (type === 'leftGame') {
            night.playerLeftGame = value.playerUuid
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
                <DropdownToggle className={"dropStyle"} caret>
                    {dropDownTogglePlayerName}
                </DropdownToggle>
                <DropdownMenu>
                    {players.map(item => {
                        return <DropdownItem className={"dropStyle"} onClick={() => this.setPlayerName(item)}
                                             key={generateGuid()}>{item.nickName}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default Drop;
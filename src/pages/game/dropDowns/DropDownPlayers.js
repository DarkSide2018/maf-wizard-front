import React, {Component} from "react";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {generateGuid} from "../GameTicket";
import {getCurrentGame} from "../../player/AvailablePlayers";
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
        const {playersToSlot,slot,players} = this.props
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
                playerName:playerName,
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
    setPlayer(value){
        const {slot} = this.props
        let name = value.nickName
        let pls = {
            slot:slot,
            playerUuid:value.playerUuid
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
    deletePlayer(value){
        console.log(JSON.stringify(value))
    }
    render() {
        const {players,currentPlayer} = this.state
        let playerName='Свободно'
        if (this.state.currentPlayer !== '') {
            playerName = this.state.currentPlayer.nickName
        }
        return <div>
            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle className={"dropStyle"} caret>
                    {playerName}
                    <Button
                    size="sm"
                    variant="outline-danger"
                    style={{marginLeft:"10px"}}
                    onClick={() => this.deletePlayer(currentPlayer)}>
                    <FontAwesomeIcon icon={faMinus}/>
                </Button>
                </DropdownToggle>
                <DropdownMenu>
                    {players.map(item => {
                        return <DropdownItem className={"dropStyle"} onClick={()=>this.setPlayer(item)} key={generateGuid()}>{item.nickName}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default DropDownPlayers;
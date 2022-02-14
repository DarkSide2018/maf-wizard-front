import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {getCurrentGame} from "../../player/AvailablePlayers";
import {getToken} from "../../../api/authenticationService";

import './Drop.css';
import {generateGuid} from "../GameTicketFast";

class LeftGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            availableSlots: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            playerSlot: 0,
            players: props.players,
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.setPlayerSlot = this.setPlayerSlot.bind(this);
    }

    componentDidMount() {
        const {nightNumber, leftIndex, nights} = this.props
        console.log("nights object => " + JSON.stringify(nights))
        console.log("leftIndex => " + leftIndex)
        let filteredNight = nights.filter(item => item.nightNumber === nightNumber)
        let slot = 0
        if (filteredNight !== undefined && filteredNight.length > 0) {
            if (filteredNight[0].playerLeftGame !== undefined) {
                console.log("left game => " + JSON.stringify(filteredNight[0].playerLeftGame))
                slot = filteredNight[0].playerLeftGame
            }
        }
        this.setState(
            {
                playerSlot: slot,
                arrayIndex: leftIndex
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

    setPlayerSlot(value, leftIndex) {
        const {nightNumber} = this.props
        let night = {
            nightNumber: nightNumber,
            playerLeftGame: [{
                leftIndex: leftIndex,
                playerNumber: value
            }]
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
                arrayIndex: leftIndex,
                playerSlot: value
            }
        )
    }


    render() {
        let slots = this.state.availableSlots
        let leftIndex = this.props.leftIndex;
        return <div>
            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle className={"dropStyle"} caret>
                    {this.state.playerSlot[leftIndex]}
                </DropdownToggle>
                <DropdownMenu>
                    {slots.map(item => {
                        return <DropdownItem className={"dropStyle"} onClick={() => this.setPlayerSlot(item, leftIndex)}
                                             key={generateGuid()}>{item}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default LeftGame;
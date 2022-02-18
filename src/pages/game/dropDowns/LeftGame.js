import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {getToken} from "../../../api/authenticationService";

import './Drop.css';
import {generateAvailableSlots, generateGuid, getCurrentGame} from "../../../common/Common";

class LeftGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            availableSlots: generateAvailableSlots(),
            playerSlot: 0,
            arrayIndex: 0,
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.setPlayerSlot = this.setPlayerSlot.bind(this);
    }

    componentDidMount() {
        const {nightNumber, leftIndex, nights} = this.props
        let filteredNight = nights.filter(item => item.nightNumber === nightNumber)
        let slot = 0
        if (filteredNight !== undefined && filteredNight.length > 0) {
            if (filteredNight[0].playerLeftGame !== undefined) {
                slot = filteredNight[0].playerLeftGame[leftIndex].playerNumber
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

        return <Dropdown isOpen={this.state.isOpen} toggle={this.toggle} style={{marginTop:"5px"}}>
                <DropdownToggle className={"dropStyle"} caret>
                    {this.state.playerSlot}
                </DropdownToggle>
                <DropdownMenu>
                    {slots.map(item => {
                        return <DropdownItem className={"dropStyle"} onClick={() => this.setPlayerSlot(item, leftIndex)}
                                             key={generateGuid()}>{item}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
    }
}

export default LeftGame;


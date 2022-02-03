import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {getCurrentGame} from "../../player/AvailablePlayers";
import {getToken} from "../../../api/authenticationService";

import './Drop.css';
import {generateGuid} from "../GameTicketFast";
class DropDownVictory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            availableVictories: ['Красные','Черные'],
            currentVictory: this.props.victory,
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.setVictory = this.setVictory.bind(this);
    }

    componentDidMount() {
        console.log("current victory => " + JSON.stringify(this.props.victory))
        this.setState(
                {
                    currentVictory: this.props.victory
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
    setVictory(value){
        this.setState(
            {
                currentVictory: value
            }
        )
        let gameCommand = {
            gameUuid: getCurrentGame(),
            status: 'ACTIVE',
            victory:value,
            messageType: 'UpdateGameRequest'
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
        const {availableVictories} = this.state
        let currentVictory = 'Неизвестно'
        if (this.state.currentVictory !== '' && this.state.currentVictory !== undefined) {
            currentVictory = this.state.currentVictory
        }

        return <div>
            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle className={"dropStyle"}  caret>
                    {currentVictory}
                </DropdownToggle>
                <DropdownMenu>
                    {availableVictories.map(item => {
                        return <DropdownItem className={"dropStyle"}  onClick={()=>this.setVictory(item)} key={generateGuid()}>{item}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default DropDownVictory;
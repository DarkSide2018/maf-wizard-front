import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {generateGuid} from "../GameTicket";

import './Drop.css';

export class DropDownRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName: '',
            availablePlayers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            currentPlayer: 0,
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.setRole = this.setRole.bind(this);
    }

    componentDidMount() {
        this.setState(
            {
                availablePlayers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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

    setRole(value) {
        this.setState(
            {
                currentPlayer: value
            }
        )
    }

    render() {
        const {availablePlayers} = this.state
        let currentPlayer = '0'
        if (this.state.currentPlayer !== '') {
            currentPlayer = this.state.currentPlayer

        }
        return <div>
            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle className={"dropStyle"} caret>
                    {currentPlayer}
                </DropdownToggle>
                <DropdownMenu>
                    {availablePlayers.map(item => {
                        return <DropdownItem className={"dropStyle"} onClick={() => this.setRole(item)}
                                             key={generateGuid()}>{item}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default DropDownRole;
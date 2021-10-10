import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {generateGuid} from "./GameTicket";


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
        this.setState(
            {
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
    setPlayerName(value){
        this.setState(
            {
                playerName: value
            }
        )
    }


    render() {
        const {players} = this.props

        if (this.state.playerName !== '') {
            return <div>
                {this.state.playerName}
            </div>
        }
        return <div>

            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    Dropdown
                </DropdownToggle>
                <DropdownMenu>
                    {players.map(item => {
                        return <DropdownItem onClick={()=>this.setPlayerName(item.nickName)} key={generateGuid()}>{item.nickName}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default Drop;
import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {generateGuid} from "../GameTicket";
import {getCurrentGame} from "../../player/AvailablePlayers";
import {getToken} from "../../../api/authenticationService";
import './Drop.css';

class DropDownElection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerVote:'',
            currentPlayer: this.props.pushedPlayer,
            availableVotes:[1,2,3,4,5,6,7,8,9],
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.setVote = this.setVote.bind(this);
    }

    componentDidMount() {

    }

    toggle() {
        let currentState = this.state.isOpen
        this.setState(
            {
                isOpen: !currentState
            }
        )
    }
    setVote(value){
        this.setState(
            {
                playerVote: value
            }
        )
    }
    render() {
        const {availableVotes,currentPlayer} = this.state
        let currentVote=0
        if (this.state.playerVote !== '') {
            currentVote = this.state.playerVote
        }
        return <div>
            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle className={"dropStyle"} caret>
                    | Cлот : {currentPlayer.slot} | {currentPlayer.nickName} | Голоса : {currentVote}
                </DropdownToggle>
                <DropdownMenu>
                    {availableVotes.map(item => {
                        return <DropdownItem className={"dropStyle"} onClick={()=>this.setVote(item)} key={generateGuid()}>  {item}  </DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default DropDownElection;
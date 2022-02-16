import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import './Drop.css';
import {generateGuid} from "../../../common/Common";

class DropDownElection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerVote: '',
            currentSlot: this.props.pushedPlayer,
            availableVotes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
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

    setVote(value) {
        this.setState(
            {
                playerVote: value
            }
        )
        let thatObject = this.props.thatObject;
        let pushedSlots = thatObject.state.pushedSlots;
        console.log("slots filtering => " + JSON.stringify(pushedSlots))
        let element = pushedSlots.filter(it => it.slot === this.state.currentSlot.slot)[0];
        console.log("element => " + JSON.stringify(element))
        element.numberOfVotes = value
        thatObject.setState({
            pushedSlots: pushedSlots
        })
    }

    render() {
        const {availableVotes, currentSlot} = this.state
        let currentVote = 0
        if (this.state.playerVote !== '') {
            currentVote = this.state.playerVote
        }
        return <div>
            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle className={"dropStyle"} caret>
                    | Cлот : {currentSlot.slot} | Голоса : {currentVote}
                </DropdownToggle>
                <DropdownMenu>
                    {availableVotes.map(item => {
                        return <DropdownItem className={"dropStyle"} onClick={() => this.setVote(item)}
                                             key={generateGuid()}>  {item}  </DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>

        </div>
    }


}

export default DropDownElection;
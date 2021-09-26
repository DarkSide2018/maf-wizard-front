import {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import {getToken} from "../../api/authenticationService";

import React from 'react';
import {getCurrentGame} from "../player/AvailablePlayers";
import {authenticate, authFailure, authSuccess} from "../../redux/authActions";
import {connect} from "react-redux";

class CreateGame extends React.Component {
    async componentDidMount() {
        let queryItem = this.state;
        queryItem.messageType = 'CreateGameRequest'
        console.log("gameUUID -> " + this.state.gameUuid)
        if (this.state.gameUuid === null) {
            console.log("CreateGameRequest")
            queryItem.name = 'Новый Стол'
            this.state.name = queryItem.name
            fetch('/game', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify(queryItem),
            })
                .then(response => response.json())
                .then((data) => {
                    this.setState({
                        gameUuid: data.entityUuid
                    });

                });
        } else {
            fetch('/game/' + this.state.gameUuid, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                }
            })
                .then(response => response.json())
                .then(data => this.setState({
                    gameNumber: data.gameNumber,
                    gameUuid: data.gameUuid,
                    players: data.players,
                    name: data.name
                })
                );
        }

    }




    constructor(props) {
        super(props);
        console.log("props-> " + props.pageSize)
        this.state = {
            gameUuid: null,
            name: 'Новый Стол',
            gameNumber: '',
            players: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        console.log("target -> " + target)
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }



    async handleSubmit(event) {
        setGameUuid(this.state.gameUuid)
        console.log("handleSubmit event")
        // event.preventDefault();
        // let item = this.state;
        // let queryItem = item.item;
        // if (queryItem.gameUuid === '') {
        //     queryItem.messageType = 'CreateGameRequest'
        // } else {
        //     queryItem.messageType = 'UpdateGameRequest'
        // }
        // await fetch('/game', {
        //     method: (queryItem.gameUuid) ? 'PUT' : 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Authorization':'Bearer '+getToken()
        //     },
        //     body: JSON.stringify(queryItem),
        // });
        // this.props.history.push('/game/all');
    }


    render() {
        const game = this.state;
        return <div>
            <Container>
                <Row>
                    <h3>Название игры : {game.name} : UUID: {this.state.gameUuid}</h3>
                </Row>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Button color="primary" type="submit">Создать игру</Button>
                        {' '}
                        <Button color="secondary" tag={Link} to="/dashboard">Cancel</Button>

                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}
export const setGameUuid= (content)=>{
    localStorage.setItem('GAME_UUID',content);
}


export default withRouter(CreateGame);
import React, {useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, ButtonGroup, Container, Form, FormGroup, Row} from 'reactstrap';
import {getToken} from "../../api/authenticationService";
import {getCurrentGame} from "../player/AvailablePlayers";
import PlayersContext from "../player/PlayersContext";

class CreateGame extends React.Component {

    componentDidMount() {
        fetch('/game/' + getCurrentGame(), {
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
        let players = this.state.players
        this.context = players
        const playersList = players.map(player => {
            return <span key={player.playerUuid}>
              {player.nickName}
            </span>
        });
        const game = this.state;

        return <div>
            <Container>
                <Row>
                    <h3>Название игры : {game.name} : UUID: {this.state.gameUuid}</h3>
                </Row>
                <Row>
                    {playersList}
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

CreateGame.contextType = PlayersContext;

export default withRouter(CreateGame);
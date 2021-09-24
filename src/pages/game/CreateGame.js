import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import {getToken} from "../../api/authenticationService";


class CreateGame extends Component {
    async componentDidMount() {
        const {gameUuid} = this.state.gameUuid;
        let queryItem = this.state.game;
        queryItem.messageType = 'CreateGameRequest'
        if (gameUuid === '') {
            queryItem.name = 'Новый Стол'
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
                .then(data => this.setState({gameUuid: data.entityUuid}));
        } else {
            
        }

    }

    emptyItem = {
        name: '',
        gameNumber: '',
        players: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            gameUuid: '',
            game: this.emptyItem
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
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
        const {item} = this.state;
        const title = <h2>Новая игра</h2>;

        return <div>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="gameNumber">Номер игры</Label>
                        <Input type="text" name="gameNumber" id="gameNumber" value={item.gameNumber || ''}
                               onChange={this.handleChange} autoComplete="gameNumber"/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>
                        {' '}
                        <Button color="secondary" tag={Link} to="/game/all">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>

        </div>
    }
}

export default withRouter(CreateGame);
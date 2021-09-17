import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import {getToken} from "../../api/authenticationService";


class GameEdit extends Component {
    async componentDidMount() {
        console.log("GameEdit componentDidMount")
        if (this.props.match.params.id !== 'new') {
            const game = await (await fetch(`/game/${this.props.match.params.id}`)).json();
            this.setState({item: game});
        }
    }

    emptyItem = {
        gameUuid: '',
        gameNumber: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem
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
        console.log("handel submit")
        event.preventDefault();
        let item = this.state;
        let queryItem = item.item;
        if (queryItem.gameUuid === '') {
            queryItem.messageType = 'CreateGameRequest'
        } else {
            queryItem.messageType = 'UpdateGameRequest'
        }
        await fetch('/game', {
            method: (queryItem.gameUuid) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization':'Bearer '+getToken()
            },
            body: JSON.stringify(queryItem),
        });
        this.props.history.push('/game/all');
    }

    render() {
        const {item} = this.state;
        const title = <h2>{item.gameUuid ? 'Edit Game' : 'Add Game'}</h2>;

        return <div>
            <AppNavbar/>
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

export default withRouter(GameEdit);
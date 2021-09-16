import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import {getToken} from "../../api/authenticationService";


class GameMasterEdit extends Component {
    async componentDidMount() {
        console.log("GameMasterEdit componentDidMount")
        if (this.props.match.params.id !== 'new') {
            const gameMaster = await (await fetch(`/game/master/${this.props.match.params.id}`)).json();
            this.setState({item: gameMaster});
        }
    }

    emptyItem = {
        gameMasterUuid: '',
        nickName: ''
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
        event.preventDefault();
        let item = this.state;
        let queryItem = item.item;
        if (queryItem.gameMasterUuid === '') {
            queryItem.messageType = 'CreateGameMasterRequest'
        } else {
            queryItem.messageType = 'UpdateGameMasterRequest'
        }
        await fetch('/game/master', {
            method: (queryItem.gameMasterUuid) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization':'Bearer '+getToken()
            },
            body: JSON.stringify(queryItem),
        });
        this.props.history.push('/game/master/all');
    }

    render() {
        const {item} = this.state;
        const title = <h2>{item.gameMasterUuid ? 'Edit Client' : 'Add Client'}</h2>;

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="nickName">Имя</Label>
                        <Input type="text" name="nickName" id="nickName" value={item.nickName || ''}
                               onChange={this.handleChange} autoComplete="nickName"/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>
                        {' '}
                        <Button color="secondary" tag={Link} to="/game/master/all">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(GameMasterEdit);
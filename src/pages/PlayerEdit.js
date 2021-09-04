
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup,Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';


class PlayerEdit extends Component {
    async componentDidMount() {
        console.log("PlayerEdit componentDidMount")
        if (this.props.match.params.id !== 'new') {
            const player = await (await fetch(`/player/${this.props.match.params.id}`)).json();
            this.setState({item: player});
        }
    }
    emptyItem = {
        nickName: '',
        points: ''
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
        const {item} = this.state;
        item.messageType = 'CreatePlayerRequest'
        await fetch('/player' + (item.playerUuid ? '/' + item.playerUuid : ''), {
            method: (item.playerUuid) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/players');
    }
    render() {
        const {item} = this.state;
        const title = <h2>{item.playerUuid ? 'Edit Client' : 'Add Client'}</h2>;

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="nickName">Name</Label>
                        <Input type="text" name="nickName" id="nickName" value={item.nickName || ''}
                               onChange={this.handleChange} autoComplete="nickName"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="points">points</Label>
                        <Input type="text" name="points" id="points" value={item.points || ''}
                               onChange={this.handleChange} autoComplete="points"/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/players">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}
export default withRouter(PlayerEdit);
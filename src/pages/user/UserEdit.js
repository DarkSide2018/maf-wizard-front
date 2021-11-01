import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Col, Container, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import './UserEdit.css';

class UserEdit extends Component {
    async componentDidMount() {
        console.log("UserEdit componentDidMount")
        if (this.props.match.params.id !== 'new') {
            const user = await (await fetch(`/user/${this.props.match.params.id}`)).json();
            this.setState({item: user});
        }
    }

    emptyItem = {
        userUuid: null,
        userName: '',
        password: '',
        createdAt: '',
        updatedAt: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
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
        if (queryItem.userUuid == null) {
            queryItem.messageType = 'CreateUserRequest'
        } else {
            queryItem.messageType = 'UpdateUserRequest'
        }
        console.log("item -> " + JSON.stringify(item))
        await fetch('/user', {
            method: (queryItem.userUuid) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(queryItem),
        });
        this.props.history.push('/');
    }

    render() {
        const {item} = this.state;
        const title = <p>Регистрация ведущего</p>;

        return <div className={"bg-mafia text-white"}>
            <Container>
                <AppNavbar/>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col md={"4"}>
                            <FormGroup>
                                <Label for="userName">Логин</Label>
                                <Input minLength={"8"} maxLength={"16"} required={"true"} className={"registerInput"} type="text" name="userName" id="userName"
                                       value={item.userName || ''}
                                       onChange={this.handleChange} autoComplete="userName"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Пароль</Label>
                                <Input minLength={"8"} maxLength={"16"} required={"true"} className={"registerInput"} type="text" name="password" id="password"
                                       value={item.password || ''}
                                       onChange={this.handleChange} autoComplete="password"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="firstName">Имя</Label>
                                <Input required={"true"} minLength={"4"} maxLength={"16"} className={"registerInput"} type="text" name="firstName" id="firstName"
                                       value={item.firstName || ''}
                                       onChange={this.handleChange} autoComplete="firstName"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="lastName">Фамилия</Label>
                                <Input className={"registerInput"} type="text" name="lastName" id="lastName"
                                       value={item.lastName || ''}
                                       onChange={this.handleChange} autoComplete="lastName"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">email</Label>
                                <Input className={"registerInput"} type="text" name="email" id="email"
                                       value={item.email || ''}
                                       onChange={this.handleChange} autoComplete="email"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="phoneNumber">Номер телефона</Label>
                                <Input className={"registerInput"} type="text" name="phoneNumber" id="phoneNumber"
                                       value={item.phoneNumber || ''}
                                       onChange={this.handleChange} autoComplete="phoneNumber"/>
                            </FormGroup>

                            <FormGroup>
                                <Button color="secondary" type="submit">Save</Button>{' '}
                                <Button color="secondary" tag={Link} to="/">Cancel</Button>
                            </FormGroup>
                        </Col>
                        <Col md={"8"}>

                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(UserEdit);
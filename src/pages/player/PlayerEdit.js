import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import {getToken} from "../../api/authenticationService";


class PlayerEdit extends Component {
    async componentDidMount() {
        console.log("PlayerEdit componentDidMount")
        if (this.props.match.params.id !== 'new') {
            const player = await (await fetch(`/player/${this.props.match.params.id}`,{
                method:'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer '+getToken()

                }
              })).json();
            this.setState({item: player});
        }
    }

    emptyItem = {
        nickName: '',
        points: '',
        playerUuid: '',
        foulAmount: '',
        additionalPoints: '',
        penalties: '',
        bestMove: '',
        victoriesRed: '',
        victoriesBlack: '',
        defeatBlack: '',
        defeatRed: '',
        don: '',
        image: '',
        sheriff: '',
        wasKilled: '',
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

     handleSubmit(event) {
        event.preventDefault();
        let item = this.state;
        let queryItem = item.item;
        if(queryItem.playerUuid === ''){
            queryItem.messageType = 'CreatePlayerRequest'
        }else{
            queryItem.messageType =  'UpdatePlayerRequest'
        }
        fetch('/player', {
            method: (queryItem.playerUuid) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(queryItem),
        });
        this.props.history.push('/player/all');
    }

    render() {
        const {item} = this.state;
        const title = <h4 className={"text-white"}>{item.playerUuid ? 'Редактировать игрока' : 'Добавить Игрока'}</h4>;

        return     <div className={"bg-general"}>
            <Container >
            <AppNavbar/>
                {title}
                <Form className={"text-white"} onSubmit={this.handleSubmit} style={{width:'30%'}}>
                    <FormGroup>
                        <Label for="nickName">Имя</Label>
                        <Input type="text" name="nickName" id="nickName" value={item.nickName || ''}
                               onChange={this.handleChange} autoComplete="nickName"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="points">Баллы</Label>
                        <Input type="text" name="points" id="points" value={item.points || ''}
                               onChange={this.handleChange} autoComplete="points"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="foulAmount">Фолов</Label>
                        <Input type="text" name="foulAmount" id="foulAmount" value={item.foulAmount || ''}
                               onChange={this.handleChange} autoComplete="foulAmount"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="additionalPoints">Дополнительные баллы</Label>
                        <Input type="text" name="additionalPoints" id="additionalPoints"
                               value={item.additionalPoints || ''}
                               onChange={this.handleChange} autoComplete="additionalPoints"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="penalties">Штрафы</Label>
                        <Input type="text" name="penalties" id="penalties" value={item.penalties || ''}
                               onChange={this.handleChange} autoComplete="penalties"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="victoriesRed">Победы за красных</Label>
                        <Input type="text" name="victoriesRed" id="victoriesRed" value={item.victoriesRed || ''}
                               onChange={this.handleChange} autoComplete="victoriesRed"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="victoriesBlack">Победы за Черных</Label>
                        <Input type="text" name="victoriesBlack" id="victoriesBlack" value={item.victoriesBlack || ''}
                               onChange={this.handleChange} autoComplete="victoriesBlack"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="defeatBlack">Поражения за Черных</Label>
                        <Input type="text" name="defeatBlack" id="defeatBlack" value={item.defeatBlack || ''}
                               onChange={this.handleChange} autoComplete="defeatBlack"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="defeatRed">Поражения за Красных</Label>
                        <Input type="text" name="defeatRed" id="defeatRed" value={item.defeatRed || ''}
                               onChange={this.handleChange} autoComplete="defeatRed"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="don">Игра за дона</Label>
                        <Input type="text" name="don" id="don" value={item.don || ''}
                               onChange={this.handleChange} autoComplete="don"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="sheriff">Игра за шерифа</Label>
                        <Input type="text" name="sheriff" id="sheriff" value={item.sheriff || ''}
                               onChange={this.handleChange} autoComplete="sheriff"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="wasKilled">Был убит в первую ночь</Label>
                        <Input type="text" name="wasKilled" id="wasKilled" value={item.wasKilled || ''}
                               onChange={this.handleChange} autoComplete="wasKilled"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="games">Количество сыгранных игр</Label>
                        <Input type="text" name="games" id="games" value={item.games || ''}
                               onChange={this.handleChange} autoComplete="games"/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/player/all">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(PlayerEdit);
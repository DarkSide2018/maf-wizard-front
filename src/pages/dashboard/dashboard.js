import React, {useState, useEffect} from 'react';
import {Button, Container} from 'react-bootstrap';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {fetchUserData, getToken} from '../../api/authenticationService';
import {Row} from "reactstrap";


const MainWrapper = styled.div`
    padding-top:40px;
`;

export const Dashboard = (props) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        fetchUserData().then((response) => {
            setData(response.data);
        }).catch((e) => {
            localStorage.clear();
            props.history.push('/');
        })
    }, [])

    const logOut = () => {

        localStorage.clear();
        props.history.push('/');

    }
    const callPlayers = () => {
        props.history.push('/player/all');
    }
    const newTable = () => {
        let queryItem = {
            messageType: 'CreateGameRequest',
            gameUuid: null,
            name: 'Новый Стол',
            gameNumber: '',
            players: []
        }
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
                setGameUuid(props,data.entityUuid)
            });
        console.log("game creteed")

    }
    const callGameMasters = () => {
        props.history.push('/game/master/all');
    }
    const callGames = () => {
        props.history.push('/game/all');
    }

    return (
        <Container>
            <MainWrapper>
                <h4>Hello {data && `${data.firstName} ${data.lastName}`}</h4>
                <br></br>
                {data && data.roles && data.roles.filter(value => value.roleCode === 'ADMIN').length > 0 &&
                <Button type="variant">Add User</Button>}
                <br></br>
                <Container>
                    <Row>
                        <Button style={{marginTop: '5px'}} onClick={() => callPlayers()}>Edit players</Button>
                    </Row>
                    <Row>
                        <Button style={{marginTop: '5px'}} onClick={() => newTable()}>New Table</Button>
                    </Row>
                    <Row>
                        <Button style={{marginTop: '5px'}} onClick={() => callGameMasters()}>Edit gameMasters</Button>
                    </Row>
                    <Row>
                        <Button style={{marginTop: '5px'}} onClick={() => callGames()}>Edit games</Button>
                    </Row>
                    <Row>
                        <Button style={{marginTop: '5px'}} onClick={() => logOut()}>Logout</Button>
                    </Row>
                </Container>
            </MainWrapper>
        </Container>
    )
}

export const setGameUuid= (props,content)=>{
    localStorage.setItem('GAME_UUID',content);
    props.history.push('/new/table');
}
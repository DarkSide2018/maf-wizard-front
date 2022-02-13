import React, {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {getToken} from '../../api/authenticationService';
import {Button, ButtonGroup, Row} from "reactstrap";
import {Link} from "react-router-dom";
import './DashBoard.css';

const MainWrapper = styled.div`
    padding-top:40px;
`;

export const Dashboard = (props) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        localStorage.removeItem('GAME_UUID');
        fetchUserData().then((response) => {
            setData(response);
        }).catch((e) => {
            localStorage.clear();
            props.history.push('/');
        })
    }, [])
    const fetchUserData = () => {
        let urlRequest = `/api/v1/auth/userinfo`
        return fetch(urlRequest, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        }).then(response=>response.json())
    }
    const logOut = () => {
        localStorage.clear();
        props.history.push('/');

    }
    const callPlayers = () => {
        props.history.push('/player/all');
    }

    return (
        <div className={"bg-general"}>
            <Container className={"text-white"}>
                <MainWrapper>
                    <div className={"gameMaster bg-dark"}>
                        <p>Ведущий : {data && `${data.firstName} ${data.lastName}`}</p>
                    </div>
                    <Container>
                        <Row>
                            <ButtonGroup>
                                <Button className={"bg-dark border-white"} style={{marginTop: '5px'}} tag={Link}
                                        to="/fast/new">Быстрая игра</Button>
                            </ButtonGroup>
                        </Row>
                        <Row>
                            <ButtonGroup>
                                <Button className={"bg-dark border-white"} style={{marginTop: '5px'}} tag={Link}
                                        to="/game/history">История игр</Button>
                            </ButtonGroup>
                        </Row>
                        <Row>
                            <Button className={"bg-dark border-white"} style={{marginTop: '5px'}}
                                    onClick={() => callPlayers()}>Статистика Игроков</Button>
                        </Row>
                        <Row>
                            <Button className={"bg-dark border-white"} style={{marginTop: '5px'}}
                                    onClick={() => logOut()}>Выход</Button>
                        </Row>
                    </Container>
                </MainWrapper>
            </Container>
        </div>
    )
}


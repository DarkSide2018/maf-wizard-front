import React, {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {fetchUserData, getToken} from '../../api/authenticationService';
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
        fetchUserData().then((response) => {
            console.log("response -> " + JSON.stringify(response.data))
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
                                <Button className={"bg-dark border-white"} style={{marginTop: '5px'}} tag={Link} to="/new/table">Создать игру</Button>
                            </ButtonGroup>
                        </Row>
                        <Row>
                            <ButtonGroup>
                                <Button className={"bg-dark border-white"} style={{marginTop: '5px'}} tag={Link} to="/game/history">История игр</Button>
                            </ButtonGroup>
                        </Row>
                        <Row>
                            <Button className={"bg-dark border-white"} style={{marginTop: '5px'}} onClick={() => callPlayers()}>Статистика Игроков</Button>
                        </Row>
                        <Row>
                            <Button className={"bg-dark border-white"} style={{marginTop: '5px'}} onClick={() => logOut()}>Выход</Button>
                        </Row>
                    </Container>
                </MainWrapper>
            </Container>
        </div>
    )
}


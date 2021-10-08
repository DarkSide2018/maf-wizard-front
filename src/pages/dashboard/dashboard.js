import React, {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {fetchUserData, getToken} from '../../api/authenticationService';
import {Button, ButtonGroup, Row} from "reactstrap";
import {Link} from "react-router-dom";


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
                        <ButtonGroup>
                            <Button color="success" tag={Link} to="/new/table">create table</Button>
                        </ButtonGroup>
                    </Row>
                    <Row>
                        <Button style={{marginTop: '5px'}} onClick={() => callPlayers()}>Edit players</Button>
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


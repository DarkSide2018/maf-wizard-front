import React, {useState} from 'react';
import './loginpage.css';
import './dashboard/DashBoard.css';
import {AUTH_FAILURE, AUTH_REQ, AUTH_SUCCESS} from "../redux/types";

export function LoginPage({loading, error, ...props}) {
    const userLogin = (authRequest) => {
        return fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authRequest),
        }).then(response => {
            return response.json()
        }).then(response =>{
                console.log("json-> " + JSON.stringify(response))
                authSuccess(response);
                props.history.push('/dashboard');
        })
    }
    const [values, setValues] = useState({
        userName: '',
        password: ''
    });

    const handleSubmit = (evt) => {
        evt.preventDefault();
        authenticate();
        userLogin(values)
    }
    const authenticate = () => {
        return {
            type: AUTH_REQ
        }
    }


    const authSuccess = (content) => {
        localStorage.setItem('USER_KEY', content.token);
        return {
            type: AUTH_SUCCESS,
            payload: content
        }
    }

    const authFailure = (error) => {
        return {
            type: AUTH_FAILURE,
            payload: error
        }
    }

    const handleChange = (e) => {
        e.persist();
        setValues(values => ({...values, [e.target.name]: e.target.value}));
    };

    return (
        <div className={"login-page bg-mafia text-white"}>
            <section className="h-100">
                <div className="container h-100">

                    <div className="row justify-content-md-left h-100" style={{opacity: 0.8}}>
                        <div className="card-wrapper">
                            <div style={{height: "100px"}}>

                            </div>

                            <div className="text-white">
                                <div className="card-body bg-dark text-white">
                                    <h4 className="card-title">Login</h4>

                                    <form className="my-login-validation" onSubmit={handleSubmit} noValidate={false}>
                                        <div className="form-group">
                                            <label htmlFor="email">User Name</label>
                                            <input id="username" type="text" className="form-control" minLength={5}
                                                   value={values.userName} onChange={handleChange} name="userName"
                                                   required/>

                                            <div className="invalid-feedback">
                                                UserId is invalid
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <input id="password" type="password" className="form-control" minLength={8}
                                                   value={values.password} onChange={handleChange} name="password"
                                                   required/>
                                            <div className="invalid-feedback">
                                                Password is required
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input"
                                                       id="customCheck1"/>
                                                <label className="custom-control-label" htmlFor="customCheck1">Remember
                                                    me</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group m-0">
                                                    <button type="submit"
                                                            className="btn border-white text-white bg-dark">
                                                        Login
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-md-6">

                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LoginPage;
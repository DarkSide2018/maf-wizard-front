import React from 'react';
import axios from 'axios';


let settings = require('./../settings.json');
export const getToken=()=>{
    return localStorage.getItem('USER_KEY');
}

export const userLogin=(authRequest)=>{
    console.log(settings)
    let urlRequest = `${settings.backendUrl}/api/v1/auth/login`
    console.log(urlRequest)
    return axios({
        'method':'POST',
        'url': urlRequest,
        'data':authRequest
    })
}

export const fetchUserData=(authRequest)=>{
    let urlRequest = `${settings.backendUrl}/api/v1/auth/userinfo`
    console.log(urlRequest)
    return axios({
        method:'GET',
        url:urlRequest,
        headers:{
            'Authorization':'Bearer '+getToken()
        }
    })
}
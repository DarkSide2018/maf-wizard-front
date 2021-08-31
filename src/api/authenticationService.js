import React from 'react';
import axios from 'axios';
import {readFile, readFileSync} from "fs";

let settings = require('./../settings.json');
const getToken=()=>{
    return localStorage.getItem('USER_KEY');
}

export const userLogin=(authRequest)=>{
    console.log(settings)
    let urlRequest = `https://${settings.backendUrl}.herokuapp.com/api/v1/auth/login`
    console.log(urlRequest)
    return axios({
        'method':'POST',
        'url': urlRequest,
        'data':authRequest
    })
}

export const fetchUserData=(authRequest)=>{
    let urlRequest = `https://${settings.backendUrl}.herokuapp.com/api/v1/auth/userinfo`
    console.log(urlRequest)
    return axios({
        method:'GET',
        url:urlRequest,
        headers:{
            'Authorization':'Bearer '+getToken()
        }
    })
}
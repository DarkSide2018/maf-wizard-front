import React from 'react';


export const getToken = () => {
    return localStorage.getItem('USER_KEY');
}


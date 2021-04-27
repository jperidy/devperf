import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getTransparentNewToken, logout } from '../actions/userActions';

const TokenIsValide = ({ history, children }) => {

    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!userInfo || !userInfo.lastConnexion) {
            history.push('/login');
        }
    }, [userInfo, history]);

    useEffect(() => {
        // get new Token if close to end of current token
        if (userInfo && userInfo.accountType === 'LOCAL') {
            const currentTime = new Date(Date.now());
            const delay = (currentTime - new Date(userInfo.lastConnexion))/(1000 * 24 * 3600);
            if (delay > 0.7 && delay < 1) {
                dispatch(getTransparentNewToken({email: userInfo.email, delay: delay}, userInfo));
            }
        }
    }, [dispatch, userInfo]);

    useEffect(() => {
        // logout user if token not valide
        if (userInfo && userInfo.accountType === 'LOCAL') {
            const currentTime = new Date(Date.now());
            const delay = (currentTime - new Date(userInfo.lastConnexion))/(1000 * 24 * 3600);
            if (delay >= 1) {
                dispatch(logout());
            }
        }
    }, [dispatch, userInfo]);
    
    return (
        <span>
            {children}
        </span>
    )
}

export default TokenIsValide;

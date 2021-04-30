import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getTransparentNewToken, logout } from '../actions/userActions';

const TokenIsValide = ({ history, children }) => {

    const dispatch = useDispatch();
    let grantedAccess = true;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!userInfo) {
            grantedAccess = false;
            history.push('/login');
        }
    }, [userInfo, history]);

    // to avoid errors with migration
    useEffect(() => {
        if (userInfo && !userInfo.lastConnexion) {
            grantedAccess = false;
            dispatch(logout());
        }
    });

    useEffect(() => {
        // get new Token if close to end of current token
        if (userInfo && userInfo.accountType === 'LOCAL') {
            const currentTime = new Date(Date.now());
            const delay = (currentTime - new Date(userInfo.lastConnexion))/(1000 * 24 * 3600);
            if (delay > 0.7 && delay < 1) {
                grantedAccess = false;
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
                grantedAccess = false;
                dispatch(logout());
            }
        }
    }, [dispatch, userInfo]);
    
    return (
        <span>
            {grantedAccess && children && children}
        </span>
    )
}

export default TokenIsValide;

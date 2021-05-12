import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getTransparentNewToken, logout } from '../actions/userActions';

const TokenIsValide = ({ history, children }) => {

    const dispatch = useDispatch();
    const [grantedAccess, setGrantedAccess] = useState(true);
    //let grantedAccess = true;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!userInfo) {
            //grantedAccess = false;
            setGrantedAccess(false);
            history.push('/login');
        }
    }, [userInfo, history]);

    useEffect(() => {
        if (userInfo && userInfo.lastConnexion && children) {
            //grantedAccess = false;
            setGrantedAccess(true);
        }
    }, [userInfo, dispatch, children]);

    // to avoid errors with migration
    useEffect(() => {
        if (userInfo && !userInfo.lastConnexion) {
            //grantedAccess = false;
            setGrantedAccess(false);
            dispatch(logout());
            history.push('/login');
        }
    }, [userInfo, dispatch, history]);

    useEffect(() => {
        // get new Token if close to end of current token
        if (userInfo && userInfo.accountType === 'LOCAL') {
            const currentTime = new Date(Date.now());
            const delay = (currentTime - new Date(userInfo.lastConnexion))/(1000 * 24 * 3600);
            if (delay > 0.7 && delay < 1) {
                //grantedAccess = false;
                setGrantedAccess(false);
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
                setGrantedAccess(false);
                dispatch(logout());
                history.push('/login');
            }
        }
    }, [dispatch, userInfo, history]);
    
    return (
        <span>
            {grantedAccess && children && children}
        </span>
    )
}

export default TokenIsValide;

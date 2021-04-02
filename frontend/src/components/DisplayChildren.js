import React from 'react';
import { useSelector } from 'react-redux';

const DisplayChildren = ({ access, children }) => {

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    let grantedAccess = false;

    if (userInfo) {
        const rule = userInfo.profil.frontAccess.filter(x => x.id === access);
        if (rule.length > 0) {
            grantedAccess = rule[0].mode !== 'no' ? true : false
        }
    }

    return (
        <span>
            {grantedAccess && children}
        </span>
    )
}

export default DisplayChildren;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMyAdminConsultants } from '../actions/consultantActions';
import ConsultantsTab from '../components/ConsultantsTab';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { CONSULTANT_MY_RESET } from '../constants/consultantConstants';

const ManageConsultantScreen = ({history}) => {

    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantsMyAdminList = useSelector(state => state.consultantsMyAdminList);
    const { loading, error, consultantsMyAdmin } = consultantsMyAdminList;

    const consultantMy = useSelector(state => state.consultantMy);
    const { consultant } = consultantMy;

    useEffect(() => {

        if (!userInfo) {
            history.push('/login');
        }

        if(!userInfo.isAdmin){
            history.push('/');
        }

        // initialisation of consultantMy selector
        if (consultant && consultant._id) {
            dispatch({ type: CONSULTANT_MY_RESET });
            //console.log('dispatch reset');
        }

        dispatch(getAllMyAdminConsultants());
        
    },[dispatch, history, userInfo])

    return (
        <>
            {consultantsMyAdmin.length === 0 ? <Message variant='information'>You have not access to these information</Message> :
                loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                    <ConsultantsTab 
                        history={history}
                        consultantsMy={consultantsMyAdmin}
                    />
            )}
        </>
    )
}

export default ManageConsultantScreen;

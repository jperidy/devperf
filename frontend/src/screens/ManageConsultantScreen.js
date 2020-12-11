import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMyAdminConsultants } from '../actions/consultantActions';
import ConsultantsTab from '../components/ConsultantsTab';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
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

    const addConsultantHandler = () => {
        console.log('AddConsultantHandler');
        history.push('/admin/consultant/add');
    }

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
            <Button className="mb-3" onClick={() => addConsultantHandler()}>
                <i className="fas fa-user-edit mr-2"></i>Add
            </Button>

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

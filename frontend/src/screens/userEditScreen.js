import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormContainer from '../components/FormContainer';
//import Alertuser from '../components/AlertUser';
import Loader from '../components/Loader';
import Message from '../components/Message';

const userEditScreen = () => {

    const consultantId = match.params.id;

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    


    useEffect(() => {

        // only admin level 0 and 1 are authorized to manage consultants
        if (userInfo && !(userInfo.adminLevel <= 2)) {
            history.push('/login');
        }
    }, []);

    return (
        <div>
            
        </div>
    )
};

export default userEditScreen;

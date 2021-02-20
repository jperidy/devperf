import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';
import { getContactsList } from '../actions/emailActions';

const EnvoyerMailsScreen = () => {

    const dispatch = useDispatch();
    const [contactList, setContactList] = useState([])
    
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const contactsList = useSelector(state => state.contactsList);
    const { loading, error, contacts } = contactsList;

    useEffect(() => {
        dispatch(getContactsList());
    },[dispatch]);

    useEffect(() => {
        if(contacts) {
            setContactList(contacts)
        }
    },[contacts])

    //console.log(contacts);
    
    return (
        <div>
            <ProgressBar animated={false} now={45} variant='primary' />
            <Table responsive hover striped className='mt-3'>
                <thead>
                    <tr className='table-primary'>
                        <th className='align-middle text-light text-center'>Name</th>
                        <th className='align-middle text-light text-center'>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {contactList && contactList.map( (contact, incr) => (
                        <tr key={incr}>
                            <td className='align-middle text-center'>{contact.name}</td>
                            <td className='align-middle text-center'>{contact.email}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            
        </div>
    )
}

export default EnvoyerMailsScreen;

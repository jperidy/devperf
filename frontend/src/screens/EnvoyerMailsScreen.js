import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//import Message from '../components/Message';
import Meta from '../components/Meta';
import { getContactsList, sendDecisionEmail } from '../actions/emailActions';
import Loader from '../components/Loader';
import { EMAIL_SEND_DECISION_RESET } from '../constants/emailConstants';

const EnvoyerMailsScreen = ({history}) => {

    const dispatch = useDispatch();

    const [contactList, setContactList] = useState([]);
    const [messsagesSendSuccess, setMessagesSendSuccess] = useState(0);
    const [messsagesSendError, setMessagesSendError] = useState(0);
    const [totalToSend, setTotalToSend] = useState(0);
    
    const [massSending, setMassSending] = useState(false);
    const [progress, setProgress] = useState(0);

    // const userLogin = useSelector(state => state.userLogin);
    // const { userInfo } = userLogin;

    const contactsList = useSelector(state => state.contactsList);
    const { loading, contacts } = contactsList;

    const sendOneEmail = useSelector(state => state.sendOneEmail);
    const { success, error, email } = sendOneEmail;

    // const sleep = (milliseconds) => {
    //     const date = Date.now();
    //     let currentDate = null;
    //     do {
    //         currentDate = Date.now();
    //     } while (currentDate - date < milliseconds);
    // }

    const handlerSendADecision = (email, name) => {
        const newContactsInfo = contactList.slice();
        for (let incr = 0 ; incr < newContactsInfo.length; incr++){
            if(newContactsInfo[incr].email === email){
                newContactsInfo[incr].status = 'loading'
            }
        }
        setContactList(newContactsInfo);
        dispatch(sendDecisionEmail(email, name))
    }

    const handlerSendAllDecisions = () => {
        dispatch({ type: EMAIL_SEND_DECISION_RESET });
        setProgress(0);
        setMassSending(true);
    }

    useEffect(() => {
        dispatch(getContactsList());
    }, [dispatch]);

    useEffect(() => {
        if (contacts) {
            setContactList(contacts.map(x => ({ ...x, status: 'not sent' })));
            setTotalToSend(contacts.length);
        }
    }, [contacts]);

    useEffect(() => {
        if(massSending) {
            if(contactList[progress].status !== 'send') {
                //sleep(1000);
                handlerSendADecision(contactList[progress].email, contactList[progress].name);
            } else {
                if(progress < contactList.length - 1){
                    setProgress(progress+1);
                }
            }
        }
    // eslint-disable-next-line
    },[massSending, progress]);

    useEffect(() => {
        if(success) {
            const successEmail = email;
            const newContactsInfo = contactList.slice();
            for (let incr = 0; incr < newContactsInfo.length; incr++) {
                if (newContactsInfo[incr].email === successEmail) {
                    newContactsInfo[incr].status = 'send'
                }
            }
            setContactList(newContactsInfo);

            if (massSending){
                if (progress < contactList.length - 1){
                    setProgress(progress+1);
                } else {
                    setMassSending(false);
                }
            }
        }
    // eslint-disable-next-line
    }, [success]);

    useEffect(() => {
        if(error) {
            //console.log('error', error);
            const errorEmail = error;
            const newContactsInfo = contactList.slice();
            for (let incr = 0; incr < newContactsInfo.length; incr++) {
                if (newContactsInfo[incr].email === errorEmail) {
                    newContactsInfo[incr].status = 'error';
                }
            }
            setContactList(newContactsInfo);

            if (massSending){
                if (progress < contactList.length - 1){
                    setProgress(progress+1);
                } else {
                    setMassSending(false);
                    setProgress(0);
                }
            }
        }
    // eslint-disable-next-line
    }, [error]);

    useEffect(() => {
        setMessagesSendSuccess(contactList.filter(x => x.status === 'send').length);
        setMessagesSendError(contactList.filter(x => x.status === 'error').length);
        setTotalToSend(contactList.length);
    },[contactList, error, success]);

    return (
        <div>
            <Meta />
            {loading && <Loader />}
            <Button
                variant='primary'
                onClick={() => history.go(-1)}
            >Go Back</Button>
            <Row className='align-items-center pt-3'>
                <Col>
                    {`${messsagesSendSuccess} messages send / ${totalToSend} - ${messsagesSendError} messages with error`}
                </Col>
                <Col className='text-right'>
                    <Button
                        variant='ligth'
                        className='text-primary'
                        onClick={() => handlerSendAllDecisions()}
                    ><i className="fas fa-envelope"></i> {massSending ? <Loader /> : 'Send all messages'}</Button>
                </Col>
            </Row>
            <Row className='pt-3'>
                <Col>
                    <ProgressBar>
                        <ProgressBar animated={massSending} now={100* messsagesSendSuccess / totalToSend} variant='primary' />
                        <ProgressBar animated={massSending} now={100* messsagesSendError / totalToSend} variant='danger' />
                    </ProgressBar>
                </Col>
            </Row>

            <Row className='pt-3'>
                <Col>
                    <Table responsive hover striped className='mt-3'>
                        <thead>
                            <tr className='table-primary'>
                                <th className='align-middle text-light text-center col-md-5'>Name</th>
                                <th className='align-middle text-light text-center col-md-5'>Email</th>
                                <th className='align-middle text-light text-center col-md-2'>status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactList && contactList.map((contact, incr) => (
                                <tr key={incr}>
                                    <td className='align-middle text-center'>{contact.name ? contact.name : "Unknown"}</td>
                                    <td className='align-middle text-center'>{contact.email}</td>
                                    <td className='align-middle text-center'>
                                        <Button
                                            variant='ligth'
                                            className={contact.status === 'error' ? 'text-danger' 
                                                        : contact.status === 'send' ? 'text-success'
                                                        : 'text-primary'}
                                            size='sm'
                                            onClick={() => handlerSendADecision(contact.email, contact.name)}
                                            disabled={contact.status === 'send' || massSending === true}
                                        ><i className="fas fa-envelope"></i>  
                                            {contact.status === 'not sent' && '  send'}
                                            {contact.status === 'loading' && <Loader />}
                                            {contact.status === 'error' && '  Error send again'}
                                            {contact.status === 'send' && '  sent'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

        </div>
    )
}

export default EnvoyerMailsScreen;

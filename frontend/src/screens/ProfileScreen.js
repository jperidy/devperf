import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import DisplayChildren from '../components/DisplayChildren';
import { getAllDeals } from '../actions/dealActions';
import SelectInput from '../components/SelectInput';
import { getAllCDM, updateDelegateConsultant } from '../actions/consultantActions';


const ProfileScreen = ({ history }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [messageUpdate, setMessageUpdate] = useState(null);

    const [delegation, setDelegation] = useState(null);

    const dispatch = useDispatch();

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdateProfil = useSelector((state) => state.userUpdateProfil);
    const { success: successUpdate, error: errorUpdate } = userUpdateProfil;

    const dealAllList = useSelector(state => state.dealAllList);
    const { deals } = dealAllList;

    const consultantCDMList = useSelector(state => state.consultantCDMList);
    const { cdmList } = consultantCDMList;

    const consultantDelegateUpdate = useSelector(state => state.consultantDelegateUpdate);
    const { loading: loadingDelegate } = consultantDelegateUpdate;

    useEffect(() => {
        if (!userInfo) {
            history.push('/login');
        } else {
            if (!user || !user.name) {
                dispatch(getUserDetails(userInfo._id));
            } else {
                setName(user.name);
                setEmail(user.email);
            }
        }
    }, [dispatch, history, userInfo, user]);

    useEffect(() => {
        if (successUpdate) {
            setMessageUpdate({ type: 'success', message: 'Profile updated' });
        }
    }, [successUpdate]);

    useEffect(() => {
        if (errorUpdate) {
            setMessageUpdate({ type: 'danger', message: 'Profile not updated' });
        }
    }, [errorUpdate]);

    useEffect(() => {
        if (userInfo) {
            const keyword = {
                title: '',
                contact: '',
                company: '',
                status: '',
                request: '',
                staff: '',
                filterMy: true
            }
            dispatch(getAllDeals(keyword, 1, 1000, 'active'));
        }
    }, [dispatch, userInfo]);

    useEffect(() => {
        if(user) {
            setDelegation(user.consultantProfil.cdmDelegation.map(x => ({id: x.cdmId, value: x.name})));
        }
    }, [user]);

    useEffect(() => {
        if(!cdmList) {
            dispatch(getAllCDM(userInfo.consultantProfil.practice))
        }
    }, [dispatch, cdmList, userInfo]);

    const submitHandlerDelegation = () => {
        const delegationToUpdate = delegation.map(x => ({cdmId: x.id, name: x.value}))
        dispatch(updateDelegateConsultant(user.consultantProfil._id, delegationToUpdate))
    }

    const submitHandler = (e) => {
        const form = e.currentTarget;
        // Verification of validity of data
        if (form.checkValidity() === false) {
            setMessage('Please check your information');
        } else {
            e.preventDefault(); // to avoid page to refresh
            setMessage(null); // to reinitialize the message before testing
            setMessageUpdate(null);

            //const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            //const lowRegex = new RegExp("([a-zA-Z0-9!@#\$%\^&\*]){1,}");
            const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
            const lowRegex = new RegExp("([a-zA-Z0-9!@#$%^&*]){1,}");
            
            const applyRegex = ['demo', 'poc'].includes(process.env.REACT_APP_ENV) ? strongRegex : lowRegex;
            //console.log(applyRegex);

            if (!password || !confirmPassword) {
                setMessage('Please enter a password');
                return;
            }
            if (password.match(applyRegex)) {
                if (!password || password !== confirmPassword) {
                    setMessage('Passwords do not match');
                    return;
                } else {
                    dispatch(updateUserProfile({ id: user._id, name, password }));
                    return;
                }
            } else {
                setMessage(`Please enter strong password: \n
                    - must be eight characters or longer \n
                    - must contain at least 1 lowercase alphabetical character \n
                    - must contain at least 1 uppercase alphabetical character \n
                    - must contain at least 1 numeric character \n
                    - must contain at least one special character (!@#$%^&*)`)
                return;
            }
        }
    };

    return (
        <Row>
            <Col md={3}>
                <h2>User Profil</h2>
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {messageUpdate && messageUpdate.type && <Message variant={messageUpdate.type}>{messageUpdate.message}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Enter Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email'>
                        <Form.Label>Email Adress</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='confirm-password'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button 
                        type='submit' 
                        className='my-3'
                        variant='primary' 
                        block
                    >Update Password</Button>
                    
                    {userInfo && userInfo.consultantProfil.isCDM && (
                        <div>
                            <h3>Delegate </h3>
                            <SelectInput
                                options={cdmList ? cdmList.map(cdm => ({ value: cdm._id, label: cdm.name })) : []}
                                value={delegation ? delegation.map(x => ({ value: x.id, label: x.value })) : []}
                                setValue={setDelegation}
                                multi={true}
                            //disabled={!editRequest}
                            />
                            <Button
                                onClick={submitHandlerDelegation}
                                className='my-3'
                                variant='primary'
                                block
                            >{loadingDelegate ? <Loader /> : 'Update Delegations'}</Button>
                        </div>
                    )}
                </Form>
            </Col>

            <Col md={9}>
                <DisplayChildren access='viewProfilDetails'>
                    <h2>Follow my Requests</h2>
                    <Table striped hover responsive className='table-sm mt-3'>
                        <thead>
                            <tr className='table-light'>
                                <th className='align-middle text-center'>Title</th>
                                <th className='align-middle text-center'>Client</th>
                                <th className='align-middle text-center'>Contacts</th>
                                <th className='align-middle text-center'>Practice</th>
                                <th className='align-middle text-center'>Step</th>
                                <th className='align-middle text-center'>Request status</th>
                                <th className='align-middle text-center'>Starting date</th>
                                <th className='align-middle text-center'>Staffing</th>
                                <th className='align-middle text-center'>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deals && deals.map( deal => (
                                <tr key={deal._id}>
                                    <td className='align-middle text-center'>{deal.title}</td>
                                    <td className='align-middle text-center'>{deal.company}</td>
                                    <td className='align-middle text-center'>{`${deal.contacts && deal.contacts.primary && deal.contacts.primary.name} \n(${deal.contacts && deal.contacts.secondary && deal.contacts.secondary.map(c => c.name).join(', ')})`}</td>
                                    <td className='align-middle text-center'>{`${deal.mainPractice} \n(${deal.othersPractices && deal.othersPractices.join(', ')})`}</td>
                                    <td className='align-middle text-center'>{deal.status}</td>
                                    <td className='align-middle text-center'>{deal.staffingRequest && deal.staffingRequest.requestStatus}</td>
                                    <td className='align-middle text-center'>{deal.startDate.substring(0,10)}</td>
                                    <td className='align-middle text-center'>{deal.staffingDecision && deal.staffingDecision.staff && deal.staffingDecision.staff.map( s => `${s.idConsultant.name} - ${s.responsability} - ${s.priority}`).join(',\n')}</td>
                                    <td className='align-middle text-center'>
                                        <Button
                                            variant='ligth'
                                            style={{ color: 'gray' }}
                                            onClick={() => history.push(`/staffing/${deal._id}`)}
                                            size='md'
                                        ><i className="fas fa-edit"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                </DisplayChildren>
            </Col>

        </Row>
    );
};

export default ProfileScreen;

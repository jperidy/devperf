import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import Alert from 'react-bootstrap/Alert';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions';
import { getAllMyAdminConsultants } from '../actions/consultantActions';
import { USER_STATUS, USER_UPDATE_RESET } from '../constants/userConstants';
import { getAllAccess } from '../actions/accessActions';

const UserEditScreen = ({ match, history }) => {

    const userId = match.params.id;

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [linkConsultant, setLinkConsultant] = useState('');
    const [profil, setProfil] = useState('');
    const [status, setStatus] = useState('');

    const [message, setMessage] = useState('');

    /*
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    */

    const userDetails = useSelector(state => state.userDetails);
    const { error, loading, user } = userDetails;

    const userUpdate = useSelector(state => state.userUpdate);
    const { error: errorUpdate, success: successUpdate } = userUpdate;

    const consultantsMyAdminList = useSelector(state => state.consultantsMyAdminList);
    const { error:errorMyAdmin, consultantsMyAdmin } = consultantsMyAdminList;

    const accessList = useSelector(state => state.accessList);
    const { access } = accessList;

    useEffect(() => {

        if (!loading && !error && (!user || user._id !== userId)) {
            dispatch(getUserDetails(userId));
        }

    }, [dispatch, user, error, userId, loading]);

    useEffect(() => {

        if (user) {
            setName(user.name);
            setEmail(user.email);
            setProfil(user.profil);
            setStatus(user.status);
            if (user.consultantProfil) {
                setLinkConsultant(user.consultantProfil._id);
            } else {
                setLinkConsultant('');
            }
            //console.log(user.profil);
        }

    }, [user]);

    useEffect(() => {

        if (error) {
            setMessage({ message: error, type: 'danger' });
        }
        if (errorMyAdmin) {
            setMessage({ message: errorMyAdmin, type: 'danger' });
        }
        if (errorUpdate) {
            setMessage({ message: errorUpdate, type: 'danger' });
        }
        if (successUpdate) {
            setMessage({ message: 'User profil updated', type: 'success' });
            dispatch({type: USER_UPDATE_RESET});
        }

    }, [dispatch, error, errorMyAdmin, errorUpdate, successUpdate]);

    useEffect(() => {

        if (user && user._id === userId) {
            dispatch(getAllMyAdminConsultants('','',10000));
        }

    }, [dispatch, user, userId]);

    useEffect(() => {
        if (!access) {
            dispatch(getAllAccess());
        }
        //console.log(access)
    },[dispatch, access]);

    const updateProfilHandler = (profil) => {
        const newProfil = access.filter(x => x.profil === profil)[0];
        setProfil(newProfil);
        //console.log('updateProfil');
    }

    const goBackHandler = () => {
        history.go(-1);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const updatedUser = {
            ...user,
            name: name,
            email: email,
            consultantProfil: linkConsultant,
            profil: profil._id,
            status: status
        };
        dispatch(updateUser(updatedUser));

    };

    return (
        <>
            {message && message.message && (

                <Alert variant={message.type} onClose={() => setMessage({})} dismissible>
                    <Alert.Heading>Notification</Alert.Heading>
                    <p>
                        {message.message}
                    </p>
                </Alert>

            )}

            <Button className='mb-3' onClick={() => goBackHandler()}>
                Go Back
            </Button>

            <FormContainer>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label><b>Name</b></Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Enter Name'
                            value={name && name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email'>
                        <Form.Label><b>Email address</b></Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email && email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='consultantProfil'>
                        <Form.Label><b>Linked Consultant Profil</b></Form.Label>
                        <InputGroup>
                            <Form.Control
                                as='select'
                                placeholder='Enter consultant to link'
                                value={linkConsultant && linkConsultant}
                                onChange={(e) => setLinkConsultant(e.target.value)}
                                required
                            >
                                {consultantsMyAdmin && consultantsMyAdmin.map(
                                    x => (
                                        <option
                                            key={x._id}
                                            value={x._id}
                                        >{x.name}</option>
                                    )
                                )}
                            </Form.Control>
                            <InputGroup.Append>
                                <Button onClick={() => history.push(`/editconsultant/${linkConsultant}`)}>Edit user</Button>
                            </InputGroup.Append>
                        </InputGroup>

                    </Form.Group>

                    <Form.Group controlId='user-profil'>
                        <Form.Label><b>User profil</b></Form.Label>
                        <Form.Control
                            as='select'
                            value={profil.profil ? profil.profil : ''}
                            onChange={(e) => updateProfilHandler(e.target.value)}
                            required
                        >
                            <option value=''>--Select--</option>
                            {access && access.map( x => (
                                <option
                                    key={x._id}
                                    value={x.profil}
                                >{x.profil}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='status'>
                        <Form.Label><b>Account Status</b></Form.Label>
                        <Form.Control
                            as='select'
                            placeholder='Select status for account'
                            value={status && status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            {USER_STATUS.map( x => (
                                <option
                                    key={x}
                                    value={x}
                                >{x}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>


                    <Button type='submit' variant='primary'>
                        Update
                    </Button>


                </Form>
            </FormContainer>

        </>
    )
};

export default UserEditScreen;

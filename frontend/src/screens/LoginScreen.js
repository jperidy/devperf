import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Container, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userActions'

const LoginScreen = ({ location, history }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin);
    const { loading, error, userInfo } = userLogin;

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (userInfo && userInfo.status === 'Validated') {
            history.push(redirect);
            // If user is authenticate, there is no search and user is redirect to home page
        }
    });

    const submitHandler = (e) => {
        const form = e.currentTarget;
        // Verification of validity of data
        if (form.checkValidity() === false) {
            setMessage('Please check your information');
        } else {
            e.preventDefault(); // to avoid page to refresh
            // Dispatch Login
            dispatch(login(email, password));
        }
    };

    return (
        <>
            <FormContainer>
                <h1>Sign In</h1>
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
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

                    <Button type='submit' variant='primary'>
                        Sign In
                </Button>

                    <Row className='py-3'>
                        <Col>
                            New User ? <Link to={redirect ?
                                `/register?reditect=${redirect}`
                                : '/register'}>Register</Link>
                        </Col>
                    </Row>
                </Form>

            </FormContainer>

            <Container>
                <Row className='justify-content-md-center'>
                    <Col xs={12} md={6} className='mt-5'>
                        <h3>Disclaimer</h3>
                        <p>Welcome on this demo! Please note that this is not an official Wavestone product.<br />
                        On this online resource management application, you'll be able to:</p>
                        <ul>
                            <li>Login with different profiles (admin, coordinator, CDM, manager)</li>
                            <li>Edit your Pxx</li>
                            <li>Edit your consultants' profiles (position, expertise, partial time, etc.)</li>
                            <li>Create, edit and keep track of your staffing requests</li>
                            <li>Staff your available consultants on staffing requests</li>
                            <li>Check where a consultant is staffed</li>
                            <li>Create and manage a dataset of skills for your consultants</li>
                            <li>Get access to latest KPIs and export the data on Excel</li>
                        </ul>
                        <h4>Test acounts logins:</h4>
                        <Table hover striped>
                            <thead>
                                <tr className='table-secondary'>
                                    <th className='align-middle text-light text-center'>Email</th>
                                    <th className='align-middle text-light text-center'>Password</th>
                                    <th className='align-middle text-light text-center'>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='align-middle text-center'>cdmptc11000@mail.com</td>
                                    <td className='align-middle text-center'>123456</td>
                                    <td className='align-middle text-center'>Admin account with all accreditation on application</td>
                                </tr>
                                <tr>
                                    <td className='align-middle text-center'>cdmptc11001@mail.com</td>
                                    <td className='align-middle text-center'>123456</td>
                                    <td className='align-middle text-center'>Coordinator of practice PTC1 account</td>
                                </tr>
                                <tr>
                                    <td className='align-middle text-center'>cdmptc11004@mail.com</td>
                                    <td className='align-middle text-center'>123456</td>
                                    <td className='align-middle text-center'>CDM of practice PTC1 account</td>
                                </tr>
                                <tr>
                                    <td className='align-middle text-center'>jessicamichelptc179@mail.com</td>
                                    <td className='align-middle text-center'>123456</td>
                                    <td className='align-middle text-center'>Manager of practice PTC1 account</td>
                                </tr>
                                <tr>
                                    <td className='align-middle text-center'>arthurthomasptc112@mail.com</td>
                                    <td className='align-middle text-center'>123456</td>
                                    <td className='align-middle text-center'>Consultant of practice PTC1 account</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default LoginScreen;

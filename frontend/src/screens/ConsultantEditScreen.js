import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getMyConsultant } from '../actions/consultantActions';

const ConsultantEditScreen = ({ history, match }) => {

    const consultantId = match.params.id;

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [matricule, setMatricule] = useState('');
    const [arrival, setArrival] = useState('');
    const [valued, setValued] = useState('');
    const [leaving, setLeaving] = useState('');
    const [seniority, setSeniority] = useState('');

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantMy = useSelector(state => state.consultantMy);
    const { loading, error, consultant } = consultantMy;

    useEffect(() => {

        if (!userInfo) {
            history.push('/login');
        }

        if (!consultant || !consultant.name) {
            dispatch(getMyConsultant(consultantId));
            //console.log('dispatch');
        }

        if (consultant && consultant.name && (!arrival || !leaving)) {
            //console.log('setProps');
            setName(consultant.name);
            setMatricule(consultant.matricule);
            setArrival(consultant.arrival.substring(0, 10));
            setValued(consultant.valued.substring(0, 10));
            setLeaving(consultant.leaving.substring(0, 10));
            setSeniority(consultant.seniority.substring(0, 4));
        }

    }, [
        dispatch,
        history,
        userInfo,
        consultant,
        consultantId,
        name,
        arrival,
        valued,
        leaving,
        seniority
    ]);

    const submitHandler = (e) => {
        e.preventDefault();
        console.log('submitHandler');
    }

    return (
        <>
            <Button onClick={() => history.go(-1)}>
                Go back
            </Button>
            <Form onSubmit={submitHandler}>
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <>
                        <Row>
                            <Col>
                                <Form.Group controlId='name'>
                                    <Form.Label><b>Name</b></Form.Label>
                                    <Form.Control
                                        type='name'
                                        placeholder='Enter Name'
                                        value={name && name}
                                        onChange={(e) => setName(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId='matricule'>
                                    <Form.Label><b>Matricule</b></Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter Matricule'
                                        value={matricule && matricule}
                                        onChange={(e) => setMatricule(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId='seniority'>
                                    <Form.Label><b>Seniority</b></Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter Matricule'
                                        value={seniority && seniority}
                                        onChange={(e) => setSeniority(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId='arrival'>
                                    <Form.Label><b>Arrival date</b></Form.Label>
                                    <Form.Control
                                        type='date'
                                        value={arrival && arrival}
                                        onChange={(e) => {
                                            setArrival(e.target.value);
                                            console.log(e.target.value)
                                        }}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId='valued'>
                                    <Form.Label><b>Valued date</b></Form.Label>
                                    <Form.Control
                                        type='date'
                                        value={valued && valued}
                                        onChange={(e) => setValued(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId='leaving'>
                                    <Form.Label><b>Leaving date</b></Form.Label>
                                    <Form.Control
                                        type='date'
                                        value={leaving && leaving}
                                        onChange={(e) => setLeaving(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button type='submit' variat='primary'>
                                    Update
                        </Button>
                            </Col>
                        </Row>
                    </>
                )}
            </Form>
        </>
    )
}

export default ConsultantEditScreen;

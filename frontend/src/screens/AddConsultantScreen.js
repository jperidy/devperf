import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { createConsultant, getAllCDM, getAllPractice } from '../actions/consultantActions';
import { CONSULTANT_CREATE_RESET } from '../constants/consultantConstants';

const AddConsultantScreen = ({ history }) => {

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [matricule, setMatricule] = useState('');
    const [arrival, setArrival] = useState('');
    const [valued, setValued] = useState('');
    const [seniority, setSeniority] = useState('');
    const [leaving, setLeaving] = useState('');
    const [practice, setPractice] = useState('');
    const [cdm, setCdm] = useState('');
    const [isCDM, setIsCDM] = useState(false);

    const [partialTime, setPartialTime] = useState(false);
    const [startPartialTime, setStartPartialTime] = useState('');
    const [endPartialTime, setEndPartialTime] = useState('');
    const [valueMonday, setValueMonday] = useState(1);
    const [valueTuesday, setValueTuesday] = useState(1);
    const [valueWednesday, setValueWednesday] = useState(1);
    const [valueThursday, setValueThursday] = useState(1);
    const [valueFriday, setValueFriday] = useState(1);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantCreate = useSelector(state => state.consultantCreate);
    const { loading, consultant } = consultantCreate;

    const consultantCDMList = useSelector(state => state.consultantCDMList);
    const { error:errorCDM, cdmList } = consultantCDMList;

    const consultantPracticeList = useSelector(state => state.consultantPracticeList);
    const { error:errorPractice, practiceList } = consultantPracticeList;

    useEffect(() => {

        if (!userInfo) {
            history.push('/login');
        }

        if (consultant && !loading) {
            history.push(`/editconsultant/${consultant._id}`);
            dispatch({ type: CONSULTANT_CREATE_RESET });
        }

        if (!practiceList) {
            dispatch(getAllPractice());
        } 
        if (practiceList && !practice) {
            setPractice(practiceList[0]);
        }
        if (practice) {
            console.log(practice);
            dispatch(getAllCDM(practice));
        }

    }, [
        dispatch,
        history,
        userInfo,
        consultant,
        loading,
        practice,
        practiceList
    ]);

    const submitHandler = (e) => {
        e.preventDefault();
        const consultant = {
            name,
            email,
            matricule,
            arrival,
            valued,
            leaving,
            practice,
            isCDM,
            cdmId: cdm,
            isPartialTime: {
                value: partialTime,
                start: startPartialTime,
                end: endPartialTime,
                week: [
                    { num: 1, worked: valueMonday },
                    { num: 2, worked: valueTuesday },
                    { num: 3, worked: valueWednesday },
                    { num: 4, worked: valueThursday },
                    { num: 5, worked: valueFriday },
                ]
            }
        }
        dispatch(createConsultant(consultant));

    };

    const changePracticeHandler = (value) => {
        setPractice(value);
        //dispatch(getAllCDM(value));
    }

    const changeValueDateHandler = (e) => {
        console.log(e);
        setValued(e.substring(0, 10));
        setSeniority(((new Date(Date.now()) - new Date(e.substring(0, 10))) / (1000 * 3600 * 24 * 365.25)).toString().substring(0, 4));
    }

    return (
        <>
            <Button className="mb-3" onClick={() => history.go(-1)}>
                <i className="fas fa-chevron-circle-left  mr-2"></i>Go Back
            </Button>

            <FormContainer>
                <h1>Consultant</h1>
                <Form onSubmit={(e) => submitHandler(e)}>

                    <Form.Row>
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
                    </Form.Row>

                    <Form.Row>
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
                                    placeholder='-'
                                    value={seniority && seniority + ' years'} 
                                    readOnly
                                ></Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                        <Form.Group controlId='email'>
                                <Form.Label><b>Email Address</b></Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='Enter email'
                                    value={email && email}
                                    onChange={(e) => setEmail(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                    <Form.Row>

                    </Form.Row>

                    <Form.Row>
                        <Col>
                        <Form.Label><b>Practice</b></Form.Label>
                                {!practiceList ? <Loader />
                                    : errorPractice ? <Message variant='Danger'>No Practice found</Message>
                                        : (
                                            <Form.Control
                                                as='select'
                                                value={practice}
                                                disabled={!userInfo.isAdmin}
                                                onChange={(e) => changePracticeHandler(e.target.value)}>
                                                {practiceList.map(x => (
                                                    <option
                                                        key={x}
                                                        value={x}
                                                    >{x}</option>
                                                ))}
                                            </Form.Control>
                                        )}
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Col>
                            <Form.Group controlId='cdm'>
                                <Form.Label><b>CDM</b></Form.Label>
                                {!cdmList ? <Loader />
                                    : errorCDM ? <Message variant='Danger'>No CDM found, please verify Practice</Message>
                                        : (
                                            <Form.Control
                                                as='select'
                                                value={cdm}
                                                disabled={!userInfo.isAdmin}
                                                onChange={(e) => setCdm(e.target.value)}>
                                                {cdmList.map(x => (
                                                    <option
                                                        key={x._id}
                                                        value={x._id}
                                                    >{x.name}</option>
                                                ))}
                                            </Form.Control>
                                        )}

                            </Form.Group>
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Col>
                            <Form.Group controlId='valued'>
                                <Form.Label><b>Valued date</b></Form.Label>
                                <Form.Control
                                    type='date'
                                    value={valued && valued}
                                    onChange={(e) => changeValueDateHandler(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId='arrival'>
                                <Form.Label><b>Arrival date</b></Form.Label>
                                <Form.Control
                                    type='date'
                                    value={arrival && arrival}
                                    min={valued}
                                    onChange={(e) => {
                                        setArrival(e.target.value);
                                        //console.log(e.target.value)
                                    }}
                                ></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId='leaving'>
                                <Form.Label><b>Leaving date</b></Form.Label>
                                <Form.Control
                                    type='date'
                                    value={leaving && leaving}
                                    min={arrival}
                                    onChange={(e) => setLeaving(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Col>
                            <Form.Group controlId="partialtime">
                                <Form.Check
                                    type="checkbox"
                                    label="Partial time"
                                    checked={partialTime ? true : false}
                                    onChange={(e) => {
                                        setPartialTime(e.target.checked)
                                    }} />
                            </Form.Group>
                        </Col>
                        {partialTime && (
                            <>
                                <Col>
                                    <Form.Group controlId='startpartialtime'>
                                        <Form.Label>Start</Form.Label>
                                        <Form.Control
                                            type="Date"
                                            min={arrival}
                                            value={startPartialTime}
                                            onChange={(e) => {
                                                setStartPartialTime(e.target.value.substring(0, 10));
                                                !endPartialTime && setEndPartialTime(e.target.value.substring(0, 10));
                                                (endPartialTime < e.target.value.substring(0, 10)) && setEndPartialTime(e.target.value.substring(0, 10));
                                            }}
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group controlId='endpartialtime'>
                                        <Form.Label>End</Form.Label>
                                        <Form.Control
                                            type="Date"
                                            value={endPartialTime}
                                            min={startPartialTime || ''}
                                            onChange={(e) => {
                                                setEndPartialTime(e.target.value.substring(0, 10))
                                            }}
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                            </>
                        )}
                    </Form.Row>

                    {partialTime && (
                        <Form.Row>
                            <Col>
                                <Form.Group controlId='monday'>
                                    <Form.Label><b>Monday</b></Form.Label>
                                    <Form.Control
                                        type='Number'
                                        min={0}
                                        max={1}
                                        step={0.5}
                                        value={Number(valueMonday)}
                                        onChange={(e) => setValueMonday(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId='tuesday'>
                                    <Form.Label><b>Tuesday</b></Form.Label>
                                    <Form.Control
                                        type='Number'
                                        min={0}
                                        max={1}
                                        step={0.5}
                                        value={Number(valueTuesday)}
                                        onChange={(e) => setValueTuesday(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId='wendnesday'>
                                    <Form.Label><b>Wendnesday</b></Form.Label>
                                    <Form.Control
                                        type='Number'
                                        min={0}
                                        max={1}
                                        step={0.5}
                                        value={Number(valueWednesday)}
                                        onChange={(e) => setValueWednesday(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId='thursday'>
                                    <Form.Label><b>Thursday</b></Form.Label>
                                    <Form.Control
                                        type='Number'
                                        min={0}
                                        max={1}
                                        step={0.5}
                                        value={Number(valueThursday)}
                                        onChange={(e) => setValueThursday(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId='friday'>
                                    <Form.Label><b>Friday</b></Form.Label>
                                    <Form.Control
                                        type='Number'
                                        min={0}
                                        max={1}
                                        step={0.5}
                                        value={Number(valueFriday)}
                                        onChange={(e) => setValueFriday(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                    )}

                    <Form.Row>
                        <Col>
                            <Form.Group controlId="iscdm">
                                <Form.Check
                                    type="checkbox"
                                    label="Is CDM"
                                    checked={isCDM ? true : false}
                                    onChange={(e) => {
                                        setIsCDM(e.target.checked);
                                    }} />
                            </Form.Group>
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Col>
                            <Button type='submit' variat='primary'>
                                <i className="fas fa-plus-circle mr-2"></i>Create
                                </Button>
                        </Col>
                    </Form.Row>

                </Form>
            </FormContainer>
        </>
    )
}

export default AddConsultantScreen;

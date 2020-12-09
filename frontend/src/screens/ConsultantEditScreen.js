import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alertuser from '../components/AlertUser';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getMyConsultant, updateMyConsultant } from '../actions/consultantActions';
import { CONSULTANT_MY_UPDATE_RESET } from '../constants/consultantConstants';

const ConsultantEditScreen = ({ history, match }) => {

    const consultantId = match.params.id;

    const dispatch = useDispatch();

    const [showMissingInfoPartialTime, setShowMissingInfoPartialTime] = useState(false);

    const [name, setName] = useState('');
    const [matricule, setMatricule] = useState('');
    const [arrival, setArrival] = useState('');
    const [valued, setValued] = useState('');
    const [leaving, setLeaving] = useState('');
    const [seniority, setSeniority] = useState('');
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

    const consultantMy = useSelector(state => state.consultantMy);
    const { loading, error, consultant } = consultantMy;

    const consultantMyUpdate = useSelector(state => state.consultantMyUpdate);
    const { loading:loadingUpdate, error:errorUpdate, success:successUpdate } = consultantMyUpdate;

    useEffect(() => {

        if (!userInfo) {
            history.push('/login');
        }

        if (!consultant || !consultant.name) {
            dispatch(getMyConsultant(consultantId));
        }

        if (consultant && consultant.name && (!arrival || !leaving)) {
            dispatch({type: CONSULTANT_MY_UPDATE_RESET});
            setName(consultant.name);
            setMatricule(consultant.matricule);
            setArrival(consultant.arrival.substring(0, 10));
            setValued(consultant.valued.substring(0, 10));
            setLeaving(consultant.leaving.substring(0, 10));
            setSeniority(((new Date(Date.now()) - new Date(consultant.arrival.substring(0, 10))) / (1000 * 3600 * 24 * 365.25)).toString().substring(0, 4));
            setIsCDM(consultant.isCDM || false);
            setPartialTime(consultant.isPartialTime.value);
            setStartPartialTime(consultant.isPartialTime.start.substring(0,10) ? consultant.isPartialTime.start.substring(0,10) : false)
            setEndPartialTime(consultant.isPartialTime.end.substring(0,10) ? consultant.isPartialTime.end.substring(0,10) : false)
            setValueMonday(consultant.isPartialTime.week.filter(x => x.num === 1)[0].worked)
            setValueTuesday(consultant.isPartialTime.week.filter(x => x.num === 2)[0].worked)
            setValueWednesday(consultant.isPartialTime.week.filter(x => x.num === 3)[0].worked)
            setValueThursday(consultant.isPartialTime.week.filter(x => x.num === 4)[0].worked)
            setValueFriday(consultant.isPartialTime.week.filter(x => x.num === 5)[0].worked)
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

        //console.log(startPartialTime);
        //console.log(endPartialTime);
        //console.log(partialTime, !startPartialTime, !endPartialTime)

        if (partialTime && (
                startPartialTime === 'false' 
                || !startPartialTime
                || endPartialTime === 'false'
                || !endPartialTime
        )) {
            setShowMissingInfoPartialTime(true);            
            return;
        }

        const updatedUser = {
            ...consultant,
            name: name,
            matricule: matricule,
            arrival: arrival,
            valued: valued,
            leaving: leaving,
            isCDM: isCDM,
            isPartialTime: {
                value: partialTime,
                start: partialTime && startPartialTime,
                end: partialTime && endPartialTime,
                week: [
                    { num: 1, worked: partialTime ? valueMonday : 1 },
                    { num: 2, worked: partialTime ? valueTuesday : 1 },
                    { num: 3, worked: partialTime ? valueWednesday : 1 },
                    { num: 4, worked: partialTime ? valueThursday : 1 },
                    { num: 5, worked: partialTime ? valueFriday : 1 }
                ]
            }
        }
        dispatch(updateMyConsultant(updatedUser));
        
    }

    const changeValueDateHandler = (e) => {
        setValued(e.substring(0, 10));
        setSeniority(((new Date(Date.now()) - new Date(e.substring(0, 10))) / (1000 * 3600 * 24 * 365.25)).toString().substring(0, 4));
    }

    return (
        <>
            {showMissingInfoPartialTime && (
                <Alertuser 
                    header="Error: missing informations for partial time description"
                    message="Please complete valid starting and ending dates"
                    setShow={setShowMissingInfoPartialTime}
                />
            )}

            {loadingUpdate ? <Loader /> 
                                    : errorUpdate 
                                    ? <Message variant='danger'>{errorUpdate}</Message> 
                                    : successUpdate && <Message variant='success'>User updated</Message>}

            <Link to={`/pxx`} className='btn btn-primary my-3'>
                Go Back
            </Link>

            <Form onSubmit={submitHandler}>
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <>
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
                                    <Form.Label><b>Seniority</b> <i>(years)</i></Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter Matricule'
                                        value={seniority && seniority}
                                        disabled
                                    ></Form.Control>
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
                                        onChange={(e) => {
                                            setArrival(e.target.value);
                                            console.log(e.target.value)
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
                                            //console.log(e.target.checked);
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
                                                value={startPartialTime}
                                                onChange={(e) => setStartPartialTime(e.target.value.substring(0, 10))}
                                            ></Form.Control>
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group controlId='endpartialtime'>
                                            <Form.Label>End</Form.Label>
                                            <Form.Control
                                                type="Date"
                                                value={endPartialTime}
                                                onChange={(e) => setEndPartialTime(e.target.value.substring(0, 10))}
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
                                    Update
                                </Button>
                            </Col>
                        </Form.Row>
                    </>
                )}
            </Form>
        </>
    )
}

export default ConsultantEditScreen;

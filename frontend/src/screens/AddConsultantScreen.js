import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import FormContainer from '../components/FormContainer';
import { createConsultant } from '../actions/consultantActions';
import { CONSULTANT_CREATE_RESET } from '../constants/consultantConstants';

const AddConsultantScreen = ({ history }) => {

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [matricule, setMatricule] = useState('');
    const [arrival, setArrival] = useState('');
    const [valued, setValued] = useState('');
    const [leaving, setLeaving] = useState('');
    const [practice, setPractice] = useState('');
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
    const { loading, error, consultant } = consultantCreate;

    useEffect(() => {

        if (!userInfo) {
            history.push('/login');
        }

        if (consultant && !loading) {

            history.push(`/editconsultant/${consultant._id}`);
            dispatch({type: CONSULTANT_CREATE_RESET});
            //dispatch({ type: CONSULTANT_MY_UPDATE_RESET });
            /*
            setValidateButton('Update');
            setName(consultant.name);
            setEmail(consultant.email);
            setMatricule(consultant.matricule);
            setArrival(consultant.arrival.substring(0, 10));
            setValued(consultant.valued.substring(0, 10));
            setLeaving(consultant.leaving.substring(0, 10));
            setIsCDM(consultant.isCDM);
            setPartialTime(consultant.isPartialTime.value);
            setStartPartialTime(consultant.isPartialTime.start.substring(0, 10) ? consultant.isPartialTime.start.substring(0, 10) : false)
            setEndPartialTime(consultant.isPartialTime.end.substring(0, 10) ? consultant.isPartialTime.end.substring(0, 10) : false)
            setValueMonday(consultant.isPartialTime.week.filter(x => x.num === 1)[0].worked)
            setValueTuesday(consultant.isPartialTime.week.filter(x => x.num === 2)[0].worked)
            setValueWednesday(consultant.isPartialTime.week.filter(x => x.num === 3)[0].worked)
            setValueThursday(consultant.isPartialTime.week.filter(x => x.num === 4)[0].worked)
            setValueFriday(consultant.isPartialTime.week.filter(x => x.num === 5)[0].worked)
            */
        }

    }, [
        dispatch,
        history,
        userInfo,
        consultant
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
            isPartialTime: {
                value: partialTime,
                start: startPartialTime,
                end: endPartialTime,
                week: [
                    {num: 1, worked: valueMonday},
                    {num: 2, worked: valueTuesday},
                    {num: 3, worked: valueWednesday},
                    {num: 4, worked: valueThursday},
                    {num: 5, worked: valueFriday},
                ]
            }      
        }
        dispatch(createConsultant(consultant));
        
    };

    return (
        <>
            <Button className="mb-3" onClick={() => history.go(-1)}>
                <i className="fas fa-chevron-circle-left  mr-2"></i>Go Back
            </Button>

            <FormContainer>
                <h1>Consultant</h1>
                <Form onSubmit={(e) => submitHandler(e)}>

                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='matricule'>
                        <Form.Label>Matricule</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Matricule'
                            value={matricule}
                            onChange={(e) => setMatricule(e.target.value)}
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

                    <Form.Row>
                        <Col>
                            <Form.Group controlId='arrival'>
                                <Form.Label>Arrival</Form.Label>
                                <Form.Control
                                    type='Date'
                                    value={arrival}
                                    onChange={(e) => setArrival(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId='valued'>
                                <Form.Label>Valued date</Form.Label>
                                <Form.Control
                                    type='date'
                                    value={valued}
                                    onChange={(e) => setValued(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId='leaving'>
                                <Form.Label>Leaving date</Form.Label>
                                <Form.Control
                                    type='date'
                                    value={leaving}
                                    onChange={(e) => setLeaving(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>

                    <Form.Group controlId='practice'>
                        <Form.Label>Practice</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Practice'
                            value={practice}
                            onChange={(e) => setPractice(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="iscdm">
                        <Form.Check
                            type="checkbox"
                            label="Is CDM"
                            checked={isCDM ? true : false}
                            onChange={(e) => {
                                setIsCDM(e.target.checked);
                            }} />
                    </Form.Group>

                    <Form.Group controlId="partialtime">
                        <Form.Check
                            type="checkbox"
                            label="Partial time"
                            checked={partialTime ? true : false}
                            onChange={(e) => {
                                setPartialTime(e.target.checked)
                            }} />
                    </Form.Group>

                    {partialTime && (
                        <>
                            <Form.Row>
                                <Col>
                                    <Form.Group controlId='startpartialtime'>
                                        <Form.Label>Start</Form.Label>
                                        <Form.Control
                                            type="Date"
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
                            </Form.Row>


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
                        </>
                    )}


                    <Button type='submit' variat='primary'>
                        <i className="fas fa-plus-circle mr-2"></i>Create
                    </Button>


                </Form>
            </FormContainer>
        </>
    )
}

export default AddConsultantScreen;

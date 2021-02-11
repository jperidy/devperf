import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Message from '../components/Message';
import Loader from '../components/Loader';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import {
    createConsultant,
    getAllCDM,
    getAllPractice,
    getMyConsultant,
    updateMyConsultant
} from '../actions/consultantActions';
import {
    CONSULTANT_CREATE_RESET,
    CONSULTANT_GRADE,
    CONSULTANT_MY_UPDATE_RESET
} from '../constants/consultantConstants';
import SkillsDetails from '../components/SkillsDetails';
import DisplayChildren from '../components/DisplayChildren';

const ConsultantEditScreen = ({ history, match }) => {

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [matricule, setMatricule] = useState('');
    const [practice, setPractice] = useState('');
    const [grade, setGrade] = useState('Analyst');

    const [cdm, setCdm] = useState('');
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

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [update, setUpdate] = useState(false);

    const valueEditType = match.params.id ? 'edit' : 'create';

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantMy = useSelector(state => state.consultantMy);
    const { loading, error, consultant } = consultantMy;

    const consultantMyUpdate = useSelector(state => state.consultantMyUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = consultantMyUpdate;

    const consultantCreate = useSelector(state => state.consultantCreate);
    const { loading: loadingCreate, error: errorCreate, success: successCreate, consultantCreated } = consultantCreate;

    const consultantCDMList = useSelector(state => state.consultantCDMList);
    const { error: errorCDM, cdmList } = consultantCDMList;

    const consultantPracticeList = useSelector(state => state.consultantPracticeList);
    const { error: errorPractice, practiceList } = consultantPracticeList;

    useEffect(() => {
        if (!userInfo) {
            history.push('/login');
        }
    }, [history, userInfo]);

    useEffect(() => {
        if (match.params.id) {
            if (!consultant) {
                dispatch(getMyConsultant(match.params.id));
                /*if (!loading) {
                    //setUpdate(false);
                }*/
            } /*else {
                if (consultant._id !== match.params.id) {
                    dispatch(getMyConsultant(match.params.id));
                    //setUpdate(false);
                }
            }*/
        }
    }, [dispatch, match, consultant]);

    useEffect(() => {
        if (match.params.id) {

            if (consultant && consultant._id !== match.params.id) {
                dispatch(getMyConsultant(match.params.id));
                //setUpdate(false);
            }

        }
    }, [dispatch, match, consultant]);

    useEffect(() => {
        if (update) {
            dispatch(getMyConsultant(match.params.id));
            setUpdate(false);
        }
    }, [dispatch, update, match]);

    useEffect(() => {
        if ((match.params.id) && (successUpdate)) {
            setUpdate(true);
        }
    }, [
        match,
        successUpdate
    ]);

    useEffect(() => {
        // Only in admin Level 0 access we can modify consultant Practice
        if (!practiceList) {
            dispatch(getAllPractice());
        }
    }, [dispatch, userInfo, practiceList]);

    useEffect(() => {
        // Load default data for cdm in the current practice
        if (practice) {
            dispatch(getAllCDM(practice));
        }
    }, [dispatch, practice]);

    useEffect(() => {
        if ((match.params.id) && consultant) {
            setName(consultant.name);
            setEmail(consultant.email);
            setMatricule(consultant.matricule);
            setPractice(consultant.practice);
            setGrade(consultant.grade);
            //setQuality(consultant.quality || []);
            setCdm(consultant.cdmId ? consultant.cdmId : ''); //'waiting affectation'
            setArrival(consultant.arrival.substring(0, 10));
            setValued(consultant.valued ? consultant.valued.substring(0, 10) : '');
            setLeaving(consultant.leaving ? consultant.leaving.substring(0, 10) : '');
            setSeniority(((new Date(Date.now()) - new Date(consultant.arrival.substring(0, 10))) / (1000 * 3600 * 24 * 365.25)).toString().substring(0, 4));
            setIsCDM(consultant.isCDM || false);
            setPartialTime(consultant.isPartialTime.value);
            setStartPartialTime(consultant.isPartialTime.start.substring(0, 10) ? consultant.isPartialTime.start.substring(0, 10) : false)
            setEndPartialTime(consultant.isPartialTime.end.substring(0, 10) ? consultant.isPartialTime.end.substring(0, 10) : false)
            setValueMonday(consultant.isPartialTime.week.filter(x => x.num === 1)[0].worked)
            setValueTuesday(consultant.isPartialTime.week.filter(x => x.num === 2)[0].worked)
            setValueWednesday(consultant.isPartialTime.week.filter(x => x.num === 3)[0].worked)
            setValueThursday(consultant.isPartialTime.week.filter(x => x.num === 4)[0].worked)
            setValueFriday(consultant.isPartialTime.week.filter(x => x.num === 5)[0].worked)
        }
    }, [match, consultant, valueEditType]);

    useEffect(() => {

        // Charge default practice for admin Level 0 user
        if (!practice && userInfo && practiceList) {
            setPractice(practiceList[0]);
        }

    }, [
        userInfo,
        practice,
        practiceList,
        cdm,
        cdmList
    ]);

    useEffect(() => {
        if (errorUpdate) {
            setErrorMessage({ message: errorUpdate, type: 'danger' });
            dispatch({ type: CONSULTANT_MY_UPDATE_RESET })
        }
        if (successUpdate) {
            setSuccessMessage({ message: 'Consultant updated', type: 'success' });
            dispatch({ type: CONSULTANT_MY_UPDATE_RESET })
        }
        if (errorCreate) {
            setErrorMessage({ message: errorCreate, type: 'danger' });
            dispatch({ type: CONSULTANT_CREATE_RESET })
        }
        if (successCreate) {
            setSuccessMessage({ message: 'Consultant created', type: 'success' });
            history.push(`/editconsultant/${consultantCreated._id}`);
            dispatch({ type: CONSULTANT_CREATE_RESET })
        }
    }, [dispatch, history, errorUpdate, successUpdate, successCreate, errorCreate, consultantCreated]);

    const submitHandler = (e) => {

        e.preventDefault();

        if (valueEditType === 'edit') {

            const updatedUser = {
                ...consultant,
                name: name,
                matricule: matricule,
                arrival: new Date(arrival),
                valued: new Date(valued),
                leaving: leaving ? new Date(leaving) : null,
                isCDM: isCDM,
                grade: grade,
                cdmId: cdm,
                isPartialTime: {
                    value: partialTime,
                    start: partialTime ? startPartialTime : '',
                    end: partialTime ? endPartialTime : '',
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

        if (valueEditType === 'create') {
            const consultant = {
                name,
                email,
                matricule,
                arrival,
                valued,
                leaving,
                practice,
                isCDM,
                grade: grade,
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
        }
    }

    const changeValueDateHandler = (e) => {
        setValued(e.substring(0, 10));
        setSeniority(((new Date(Date.now()) - new Date(e.substring(0, 10))) / (1000 * 3600 * 24 * 365.25)).toString().substring(0, 4));
    }

    const goBackHandler = () => {
        history.go(-1);
        setErrorMessage('');
        setSuccessMessage('');
    }

    return (
        <DisplayChildren access='editConsultantProfil'>
            {error && <Message variant='danger'>{error}</Message>}
            {errorMessage && <Message variant='danger'>{errorMessage.message}</Message>}

            {errorCDM && <Message variant='danger'>{errorCDM}</Message>}
            {errorPractice && <Message variant='danger'>{errorPractice}</Message>}

            {loading && <Loader />}

            <Button className='mb-3' onClick={() => goBackHandler()}>
                Go Back
            </Button>

            <Container>
                <Row className='justify-content-md-center'>
                    <Col xs={12} md={8}>
                        
                        <Form onSubmit={submitHandler}>
                            <h2>{name && name}</h2>

                            <DropDownTitleContainer title='Personal' close={valueEditType !== 'create'}>
                                <ListGroup.Item>
                                    <Form.Row>
                                        <Col>
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
                                                    required
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId='seniority'>
                                                <Form.Label><b>Seniority</b> <i>(years)</i></Form.Label>
                                                <Form.Control
                                                    type='text'
                                                    placeholder='-'
                                                    value={seniority && seniority}
                                                    readOnly
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>

                                    <Form.Row>
                                        <Col>
                                            <Form.Group controlId='email'>
                                                <Form.Label><b>Email Address</b></Form.Label>
                                                <Form.Control
                                                    type='email'
                                                    placeholder='Enter email'
                                                    value={email && email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>

                                </ListGroup.Item>
                            </DropDownTitleContainer>

                            {consultant && valueEditType !== 'create' && (
                                <SkillsDetails consultantId={consultant._id} />
                            )}

                            <DropDownTitleContainer title='Profil' close={false}>
                                <ListGroup.Item>
                                    <Form.Row>
                                        <Col>
                                            <Form.Group controlId='practice'>
                                                <Form.Label><b>Practice</b></Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        as='select'
                                                        value={practice ? practice : userInfo ? userInfo.consultantProfil.practice : ""}
                                                        //disabled={userInfo && !(userInfo.adminLevel === 0)}
                                                        onChange={(e) => {
                                                            setPractice(e.target.value)
                                                        }}
                                                        required
                                                    >
                                                        {!practiceList ? <option value={practice && practice}>{practice}</option>
                                                            : errorPractice ? <Message variant='Danger'>No Practice found</Message>
                                                                : (
                                                                    practiceList.map(x => (
                                                                        <option
                                                                            key={x}
                                                                            value={x}
                                                                            disabled={x === '-' ? true : false}
                                                                        >{x}</option>
                                                                    ))
                                                                )}
                                                    </Form.Control>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>

                                    <Form.Row>
                                        <Col>
                                            <Form.Group controlId='grade'>
                                                <Form.Label><b>Grade</b></Form.Label>
                                                <Form.Control
                                                    as='select'
                                                    placeholder='Enter grade'
                                                    value={grade && grade}
                                                    onChange={(e) => setGrade(e.target.value)}
                                                    required
                                                >
                                                    {CONSULTANT_GRADE.map( x => (
                                                        <option key={x} value={x}>{x}</option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>

                                    <Form.Row>
                                        <Col>
                                            <Form.Group controlId='cdm'>
                                                <Form.Label><b>CDM</b></Form.Label>
                                                <Form.Control
                                                    as='select'
                                                    value={cdm ? cdm : 'default'}
                                                    //disabled={userInfo && !(userInfo.adminLevel <= 2)}
                                                    onChange={(e) => setCdm(e.target.value)}
                                                    required
                                                >
                                                    <option value='default'>Please Select</option>
                                                    {!cdmList ? 'No cdm'
                                                        : errorCDM ? <Message variant='danger'>No CDM found, please verify Practice</Message>
                                                            : cdmList.length && (
                                                                cdmList.map(x => (
                                                                    <option
                                                                        key={x._id}
                                                                        value={x._id}
                                                                    >{x.name}</option>
                                                                ))
                                                            )}
                                                </Form.Control>

                                            </Form.Group>
                                        </Col>
                                    </Form.Row>

                                    <ListGroup.Item>
                                        <Form.Row>
                                            <Col>
                                                <Form.Group controlId='valued'>
                                                    <Form.Label><b>Valued date</b></Form.Label>
                                                    <Form.Control
                                                        type='date'
                                                        value={valued && valued}
                                                        onChange={(e) => changeValueDateHandler(e.target.value)}
                                                        required
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
                                                        }}
                                                        required
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
                                    </ListGroup.Item>

                                    <ListGroup.Item>
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
                                                                min={arrival && arrival}
                                                                value={startPartialTime && startPartialTime}
                                                                onChange={(e) => {
                                                                    setStartPartialTime(e.target.value.substring(0, 10));
                                                                    !endPartialTime && setEndPartialTime(e.target.value.substring(0, 10));
                                                                    (endPartialTime < e.target.value.substring(0, 10)) && setEndPartialTime(e.target.value.substring(0, 10));
                                                                }}
                                                                required
                                                            ></Form.Control>
                                                        </Form.Group>
                                                    </Col>

                                                    <Col>
                                                        <Form.Group controlId='endpartialtime'>
                                                            <Form.Label>End</Form.Label>
                                                            <Form.Control
                                                                type="Date"
                                                                value={endPartialTime && endPartialTime}
                                                                min={startPartialTime || ''}
                                                                onChange={(e) => {
                                                                    setEndPartialTime(e.target.value.substring(0, 10))
                                                                }}
                                                                required
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
                                    </ListGroup.Item>

                                    <ListGroup.Item>
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
                                    </ListGroup.Item>
                                </ListGroup.Item>
                            </DropDownTitleContainer>

                            <Form.Row className='pt-3'>
                                <Col>
                                    <Button
                                        type='submit'
                                        variant='primary'
                                        block
                                        disabled={!name || !email || !matricule || !practice || !cdm || !valued || !arrival}
                                    >{(loadingUpdate || loadingCreate) ? <Loader /> : valueEditType === 'create' ? "Create" : "Update"}
                                    </Button>
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col>
                                    {successMessage && <Message variant='success'><i className="fas fa-check-circle">  Your information is correctly registered</i></Message>}
                                </Col>
                            </Form.Row>

                        </Form>


                    </Col>
                </Row>
            </Container>
        </DisplayChildren>
    )
}

export default ConsultantEditScreen;

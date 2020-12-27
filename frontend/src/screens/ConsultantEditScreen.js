import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormContainer from '../components/FormContainer';
import Alert from 'react-bootstrap/Alert';
import Message from '../components/Message';
import {
    createConsultant,
    getAllCDM,
    getAllConsultantSkills,
    getAllPractice,
    getMyConsultant,
    updateMyConsultant
} from '../actions/consultantActions';
import {
    CONSULTANT_CREATE_RESET,
    CONSULTANT_MY_UPDATE_RESET
} from '../constants/consultantConstants';

const ConsultantEditScreen = ({ history, match }) => {

    const consultantId = match.params.id;

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [matricule, setMatricule] = useState('');
    const [practice, setPractice] = useState('');
    
    const [quality, setQuality] = useState([]);
    const [skillCategory, setSkillCategory] = useState('default');
    const [skillName, setSkillName] = useState('default');
    const [skillLevel, setSkillLevel] = useState('default');
    const [skillCategoryList, setSkillCategoryList] = useState([]);

    const [displayQuality, setDisplayQuality] = useState(false);
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

    const [addPractice, setAddPractice] = useState(false);
    const [message, setMessage] = useState('');

    const valueEditType = match.params.id ? 'edit' : 'create';

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantMy = useSelector(state => state.consultantMy);
    const { loading, consultant } = consultantMy;

    const consultantMyUpdate = useSelector(state => state.consultantMyUpdate);
    const { error: errorUpdate, success: successUpdate } = consultantMyUpdate;

    const consultantCreate = useSelector(state => state.consultantCreate);
    const { error: errorCreate, success: successCreate, consultantCreated } = consultantCreate;

    const consultantCDMList = useSelector(state => state.consultantCDMList);
    const { error: errorCDM, cdmList } = consultantCDMList;

    const consultantPracticeList = useSelector(state => state.consultantPracticeList);
    const { error: errorPractice, practiceList } = consultantPracticeList;

    const consultantAllSkills = useSelector(state => state.consultantAllSkills);
    const { loading:loadingSkills, error: errorSkills, skills } = consultantAllSkills;

    useEffect(() => {
        // only admin level 0 and 1 are authorized to manage consultants
        if (userInfo && !(userInfo.adminLevel <= 2)) {
            history.push('/login');
        }
    }, [history, userInfo]);

    useEffect(() => {
        // In edit mode we want to load the consultant informations
        if ((valueEditType === 'edit') && !loading && (!consultant || consultant._id !== consultantId)) {
            dispatch(getMyConsultant(consultantId));
        }
    }, [dispatch, valueEditType, loading, consultant, consultantId]);

    useEffect(() => {
        if (valueEditType === 'edit' && successUpdate) {
            dispatch(getMyConsultant(consultantId));
            dispatch({ type: CONSULTANT_MY_UPDATE_RESET });
        }
    }, [dispatch, successUpdate, consultantId, valueEditType]);

    useEffect(() => {
        // Only in admin Level 0 access we can modify consultant Practice
        if (userInfo && (userInfo.adminLevel === 0) && !practiceList) {
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
        if (!skills) {
            dispatch(getAllConsultantSkills());
        }
    }, [dispatch, skills]);

    useEffect(() => {
        if (skills) {
            let categoryList = skills.map( x => x.category);
            categoryList = [...new Set(categoryList)];
            setSkillCategoryList(categoryList);
        }
    }, [skills]);

    useEffect(() => {
        // When editing you need to charge consultant to edit values
        if (valueEditType === 'edit' && consultant) {
            //dispatch({ type: CONSULTANT_MY_UPDATE_RESET });
            setName(consultant.name);
            setEmail(consultant.email);
            setMatricule(consultant.matricule);
            setPractice(consultant.practice);
            setQuality(consultant.quality || []);
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
    }, [consultant, valueEditType]);

    useEffect(() => {

        // Charge default practice for admin Level 0 user
        if (!addPractice && !practice && userInfo && practiceList && !practice) {
            setPractice(practiceList[0]);
        }
        // set default Practice if admin Level > 0
        if (!addPractice && !practice && userInfo && userInfo.adminLevel > 0) {
            setPractice(userInfo.consultantProfil.practice);
        }

    }, [
        userInfo,
        practice,
        practiceList,
        cdm,
        cdmList,
        addPractice
    ]);

    useEffect(() => {
        if (errorUpdate) {
            setMessage({ message: errorUpdate, type: 'danger' });
            dispatch({ type: CONSULTANT_MY_UPDATE_RESET })
        }
        if (successUpdate) {
            setMessage({ message: 'Consultant updated', type: 'success' });
            dispatch({ type: CONSULTANT_MY_UPDATE_RESET })
        }
        if (errorCreate) {
            setMessage({ message: errorCreate, type: 'danger' });
            dispatch({ type: CONSULTANT_CREATE_RESET })
        }
        if (successCreate) {
            setMessage({ message: 'Consultant created', type: 'success' });
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
            //console.log('updatedUser', updatedUser);
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
        //console.log(e);
        setValued(e.substring(0, 10));
        setSeniority(((new Date(Date.now()) - new Date(e.substring(0, 10))) / (1000 * 3600 * 24 * 365.25)).toString().substring(0, 4));
    }

    const handleUpdateSkillLevel = (id, level) => {
        console.log('update skill level to implement');
    }

    const goBackHandler = () => {
        history.go(-1);
        //dispatch({type: CONSULTANT_MY_RESET});
        //dispatch({ type: CONSULTANT_CREATE_RESET });
        //dispatch({ type: CONSULTANT_MY_UPDATE_RESET });
    }

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

                    <Form.Row>
                        <Col>
                            <Form.Label>
                                <b>Skills </b><i 
                                    className="fas fa-plus-circle"
                                    onClick={() => setDisplayQuality(!displayQuality)}    
                                ></i>
                            </Form.Label>
                        </Col>
                    </Form.Row>

                    {displayQuality && (
                        <>
                            {quality && quality.length && (
                                quality.map( (x, val) => (
                                    <Form.Row key={val}>
                                        <Col>
                                            <Form.Group controlId='skillcategory'>
                                                <Form.Control
                                                    plaintext 
                                                    readOnly 
                                                    value={x.skill.category}
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId='skillName'>
                                                <Form.Control
                                                    plaintext 
                                                    readOnly
                                                    value={x.skill.name}
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId='skillLevel'>
                                                <Form.Control
                                                    type='Number'
                                                    min={1}
                                                    max={3}
                                                    value={Number(x.level)}
                                                    onChange={(e) => handleUpdateSkillLevel(x._id, e.target.value) }
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={2}>
                                            <Form.Group>
                                                <InputGroup>
                                                    <Button
                                                        block
                                                        variant="danger"
                                                        onClick={() => console.log('Delete skill')}
                                                    ><i className="fas fa-times-circle"></i></Button>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>
                                    
                                ))
                            )}
                            <Form.Row>
                                <Col>
                                    <Form.Group controlId='skillCategory'>
                                        <Form.Label><b>Category</b></Form.Label>
                                        <Form.Control
                                            as='select'
                                            value={skillCategory ? skillCategory : 'default'}
                                            onChange={(e) => setSkillCategory(e.target.value)}
                                            required
                                        >
                                            <option value='default'>Please Select</option>
                                            {skillCategoryList && (
                                                skillCategoryList.map((x, val) => (
                                                    <option
                                                        value={x}
                                                        key={val}
                                                        onChange={(e) => setSkillCategory(e.target.value)}
                                                    >{x}</option>
                                                )))}


                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='skillName'>
                                        <Form.Label><b>Skill</b></Form.Label>
                                        <Form.Control
                                            as='select'
                                            value={skillName ? skillName : 'default'}
                                            onChange={(e) => setSkillName(e.target.value)}
                                            required
                                        >
                                            <option value='default'>Please Select</option>
                                            {skills && skillCategory && (
                                                skills.map((x, val) => (
                                                    x.category === skillCategory && (
                                                        <option
                                                            value={x.name}
                                                            key={val}
                                                            onChange={(e) => setSkillName(e.target.value)}
                                                        >{x.name}</option>
                                                    )
                                                )))}

                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='skillLevel'>
                                        <Form.Label><b>Level</b></Form.Label>
                                        <Form.Control
                                            as='select'
                                            value={skillLevel ? skillLevel : 'default'}
                                            onChange={(e) => setSkillLevel(e.target.value)}
                                            required
                                        >
                                            <option value='default'>Please Select</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>

                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Form.Group>
                                        <Form.Label><b>Add Skill</b></Form.Label>
                                        <InputGroup>
                                            <Button
                                                block
                                                onClick={() => console.log('add skill')}
                                            >Add</Button>
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Form.Row>
                        </>
                    )}

                    <Form.Row>
                        <Col>
                            <Form.Group controlId='practice'>
                                <Form.Label><b>Practice</b></Form.Label>
                                <InputGroup>
                                    {addPractice ? (
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter Practice'
                                            value={practice ? practice : userInfo ? userInfo.consultantProfil.practice : ''}
                                            onChange={(e) => {
                                                setPractice(e.target.value);
                                                setCdm('');
                                            }}
                                            required
                                        ></Form.Control>
                                    ) : (
                                            <Form.Control
                                                as='select'
                                                value={practice ? practice : userInfo ? userInfo.consultantProfil.practice : ""}
                                                disabled={userInfo && !(userInfo.adminLevel === 0)}
                                                onChange={(e) => {
                                                    setPractice(e.target.value)
                                                    //console.log('e.target.value', e.target.value)
                                                    //dispatch(getAllCDM(e.target.value))
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
                                        )}
                                    {(userInfo.adminLevel === 0) && (
                                        <InputGroup.Append>
                                            <Button
                                                className='btn-primary'
                                                onClick={(e) => setAddPractice(!addPractice)}>{addPractice ? 'Back' : 'Add'}</Button>
                                        </InputGroup.Append>
                                    )}
                                </InputGroup>
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
                                    disabled={userInfo && !(userInfo.adminLevel <= 2)}
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
                                        //console.log(e.target.value)
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
                            <Button 
                                type='submit' 
                                variant='primary'
                                disabled= {!name || !email || !matricule || !practice || !cdm || !valued || !arrival} 
                            >{valueEditType === 'create' ? "Create" : "Update"}
                            </Button>
                        </Col>
                    </Form.Row>
                </Form>
            </FormContainer>
        </>
    )
}

export default ConsultantEditScreen;

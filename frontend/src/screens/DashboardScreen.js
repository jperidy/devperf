import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { Link } from 'react-router-dom';
import { getTace, getAvailabilities } from '../actions/pxxActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';

const DashboardScreen = ({ history }) => {

    const dispatch = useDispatch();

    // initialization of default constants
    const duration = 3;
    let startDefault = new Date(Date.now());
    startDefault.setUTCDate(1);
    startDefault.setUTCMonth(startDefault.getUTCMonth());
    startDefault = startDefault.toISOString().substring(0, 10);

    let endDefault = new Date(Date.now());
    endDefault.setUTCDate(1);
    endDefault.setUTCMonth(endDefault.getUTCMonth() + duration);
    endDefault = endDefault.toISOString().substring(0, 10);

    const [practice, setPractice] = useState('');
    const [start, setStart] = useState(startDefault);
    const [end, setEnd] = useState(endDefault);

    const [focus, setFocus] = useState('');
    //const [skill, setSkill] = useState('');
    const [searchSkills, setSearchSkills] = useState('');
    const [searchExperienceStart, setSearchExperienceStart] = useState('');
    const [searchExperienceEnd, setSearchExperienceEnd] = useState('');

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const pxxTACE = useSelector(state => state.pxxTACE);
    const { loading: loadingTACE, error: errorTACE, tace } = pxxTACE;

    const pxxAvailabilities = useSelector(state => state.pxxAvailabilities);
    const { loading: loadingAvailabilities, error: errorAvailabilities, availabilities } = pxxAvailabilities;


    useEffect(() => {

        if (!userInfo || userInfo.adminLevel > 2) {
            history.push('/login');
        } else {
            setPractice(userInfo.consultantProfil.practice);
        }
    }, [dispatch, history, userInfo]);

    useEffect(() => {
        if (!loadingTACE) {
            dispatch(getTace(userInfo.consultantProfil.practice, start, end));
        }
    // eslint-disable-next-line
    }, [dispatch, practice, start, end])

    useEffect(() => {
        if (!loadingAvailabilities) {
            dispatch(getAvailabilities(practice, start, end, '', '', ''));
        }
    // eslint-disable-next-line
    }, [dispatch, practice, start, end])

    const handlerSkillsSubmit = (e) => {
        e.preventDefault();
        dispatch(getAvailabilities(practice, start, end, searchSkills, searchExperienceStart, searchExperienceEnd));
    }

    const navigationMonthHandler = (val) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        startDate.setUTCMonth(startDate.getUTCMonth() + val);
        endDate.setUTCMonth(endDate.getUTCMonth() + val);
        
        setStart(startDate.toISOString().substring(0,10));
        setEnd(endDate.toISOString().substring(0,10));
    }

    return (
        <>
            <Meta />
            <Row>
                <Col className="text-center" xs={2}>
                    <Button
                        variant='primary'
                        size='sm'
                        onClick={() => navigationMonthHandler(-1)}
                    ><i className="fas fa-caret-left"></i>
                    </Button>
                </Col>
                <Col>
                    <InputGroup>
                        <FormControl
                            type='text'
                            id='start-date'
                            className='form-control-lg mb-3 text-right'
                            plaintext
                            value={start && `From: ${start.substring(0,7).replace('-','/')}`}
                            readOnly
                        ></FormControl>
                    </InputGroup>
                </Col>
                <Col>
                    <InputGroup>
                        <FormControl
                            type='text'
                            id='date-end'
                            className='form-control-lg mb-3 text-left'
                            plaintext
                            value={end && `To: ${end.substring(0,7).replace('-','/')}`}
                            readOnly
                        ></FormControl>
                    </InputGroup>
                </Col>
                <Col className="text-center" xs={2}>
                    <Button
                        variant='primary'
                        size='sm'
                        onClick={() => navigationMonthHandler(1)}
                    ><i className="fas fa-caret-right"></i>
                    </Button>
                </Col>
            </Row>
            
            <Row className='mt-3'>
                <Col>
                    <h4>TACE ({userInfo && userInfo.consultantProfil.practice})</h4>
                </Col>
            </Row>
            <Row className='mt-1'>
                {loadingTACE ? <Loader /> : errorTACE ? <Message variant='danger'>{errorTACE}</Message> : (
                    tace && tace.map((x, val) => (

                        <Col key={val} sm={12} md={6} lg={4} xl={3}>
                            <Card className='my-3 p-3 rounded'>
                                <Card.Header as="h5">{x.month.firstDay.toString().substring(0, 7)}</Card.Header>
                                <Card.Body>
                                    <Card.Text as="div"><strong>{(Number(x.totalTACE) * 100).toString().substring(0, 4)} %</strong> Tace</Card.Text>
                                    <Card.Text as="div">{(Number(x.totalLeaving) * 100).toString().substring(0, 4)} % Leaving</Card.Text>
                                    <Card.Text as="div">{x.totalETP.toString().substring(0, 4)} ETP</Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Link to={`/pxxdetails/${x.month._id}`}>View details</Link>
                                </Card.Footer>
                            </Card>
                        </Col>

                    ))
                )}
            </Row>

            <Row className='mt-5'>
                <Col md={12}>
                    <Form onSubmit={handlerSkillsSubmit}>
                        <Form.Row>
                            <Col md={5}>
                                <Form.Group controlId='skill-search'>
                                    <Form.Control
                                        type='text'
                                        placeholder='Search: skill1 ; skill2'
                                        value={searchSkills && searchSkills}
                                        onChange={(e) => setSearchSkills(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={2}>
                                <Form.Group controlId='experience-search-start'>
                                    <Form.Control
                                        type='number'
                                        min={0}
                                        step={0.1}
                                        placeholder='From (year)'
                                        value={searchExperienceStart && searchExperienceStart}
                                        onChange={(e) => setSearchExperienceStart(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={2}>
                                <Form.Group controlId='experience-search-end'>
                                    <Form.Control
                                        type='number'
                                        step={0.1}
                                        min={searchExperienceStart || 0}
                                        placeholder='To (year)'
                                        value={searchExperienceEnd && searchExperienceEnd}
                                        onChange={(e) => setSearchExperienceEnd(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={1}>
                                <Button 
                                    type='submit' 
                                    variant='primary'
                                    block
                                >Search</Button>
                            </Col>
                            <Col md={2}>
                                <OverlayTrigger
                                    trigger="click"
                                    placement="right"
                                    overlay={
                                        <Popover id="popover-basic">
                                            <Popover.Title as="h3">How to use search box</Popover.Title>
                                            <Popover.Content>
                                                Example: <strong>workpl ; telec</strong> will find workplace or telecom 
                                            </Popover.Content>
                                        </Popover>
                                    }>
                                    <Button 
                                        variant="light"
                                        block
                                    >info  <i className="fas fa-info-circle ml-3"></i></Button>
                                </OverlayTrigger>

                                
                            </Col>
                        </Form.Row>
                    </Form>

                </Col>
            </Row>

            {[['Analyst'], ['Consultant'], ['Senior consultant'], ['Manager', 'Senior manager', 'Director', 'Partner']].map((grades, gradVal) => (
                
                <div key={gradVal}>

                    <Row className='mt-3'>
                        <Col>
                            <h5>{grades.join(', ')}</h5>
                        </Col>
                    </Row>

                    <Row className='mt-3'>
                        {loadingAvailabilities ? <Loader /> : errorAvailabilities ? <Message variant='danger'>{errorAvailabilities}</Message> : (
                            availabilities && availabilities.map((x, xVal) => (
                                <Col key={xVal} sm={12} md={6} lg={4} xl={3}>
                                    <Card className='my-3 p-3 rounded' >
                                        <Card.Header as="h5">{x.month.firstDay.toString().substring(0, 7)}</Card.Header>
                                        <Card.Body>
                                            {x.availabilities.map((y, yVal) => (
                                                grades.includes(y.grade) && (
                                                    <OverlayTrigger
                                                        key={yVal}
                                                        placement="bottom"
                                                        overlay={<Tooltip id="button-tooltip-2">{
                                                            <>
                                                                <>{y.valued && ((Date.now() - new Date(y.valued))/(1000*24*3600*365.25)).toString().substring(0,4)} years</><br/>
                                                                <>{y.comment ? y.comment : 'no comment'}</>
                                                            </>
                                                            }</Tooltip>}
                                                    >
                                                        <Form.Control
                                                            plaintext
                                                            readOnly
                                                            id={y.email}
                                                            value={y.availableDay.toString() + ' days : ' + y.name}
                                                            style={(y.email === focus) ? {background: '#464277', color: 'white'} : {color: 'black'}}
                                                            onFocus={(e) => {
                                                                setFocus(e.target.id)
                                                            }}
                                                        />
                                                    </OverlayTrigger>
                                                )
                                            ))}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>
                </div>
            ))}

        </>
    )
}

export default DashboardScreen;

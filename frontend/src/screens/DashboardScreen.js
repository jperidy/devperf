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
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
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
    const [skill, setSkill] = useState('');
    const [searchSkills, setSearchSkills] = useState('');

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
            dispatch(getTace(practice, start, end));
        }
    // eslint-disable-next-line
    }, [dispatch, practice, start, end])

    useEffect(() => {
        if (!loadingAvailabilities) {
            dispatch(getAvailabilities(practice, start, end, skill));
        }
    // eslint-disable-next-line
    }, [dispatch, practice, start, end, skill])

    const handlerSkillsSubmit = (e) => {
        e.preventDefault();
        //setSkill(e.target.value);
        //console.log(searchSkills)
        //console.log(e.target.value)
        dispatch(getAvailabilities(practice, start, end, searchSkills));
    }

    return (
        <>
            <Row>
                <Col sm={12} md={6} lg={4} xl={3}>
                    <label htmlFor='start-date'><b>Start date</b></label>
                    <InputGroup>
                        <FormControl
                            type='date'
                            id='start-date'
                            className='mb-3'
                            value={start && start}
                            onChange={(e) => {
                                const date = new Date(e.target.value);
                                date.setUTCDate(1);
                                setStart(date.toISOString().substring(0, 10));
                                //dispatch(getTace(practice, start, end));
                            }}
                        ></FormControl>
                    </InputGroup>
                </Col>
                <Col sm={12} md={6} lg={4} xl={3}>
                    <label htmlFor='date-end'><b>End date</b></label>
                    <InputGroup>
                        <FormControl
                            type='date'
                            id='date-end'
                            className='mb-3'
                            value={end && end}
                            onChange={(e) => {
                                const date = new Date(e.target.value);
                                date.setUTCDate(1);
                                setEnd(date.toISOString().substring(0, 10));
                                //dispatch(getTace(practice, start, end));
                            }}
                        ></FormControl>
                    </InputGroup>
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
                            <Card className='my-3 p-3 rounded' >
                                <Card.Header as="h5">{x.month.firstDay.toString().substring(0, 7)}</Card.Header>
                                <Card.Body>
                                    <Card.Text as="div"><strong>{(Number(x.totalTACE) * 100).toString().substring(0, 4)} %</strong> Tace</Card.Text>
                                    <Card.Text as="div">{(Number(x.totalLeaving) * 100).toString().substring(0, 4)} % Leaving</Card.Text>
                                    <Card.Text as="div">{x.totalETP.toString().substring(0, 4)} ETP</Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Link to='/'>View details</Link>
                                </Card.Footer>
                            </Card>
                        </Col>

                    ))
                )}
            </Row>

            <Row className='mt-5'>
                <Col>
                    <Form onSubmit={handlerSkillsSubmit}>
                        <Form.Group controlId='name'>
                            <Form.Label><b>Search</b></Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Search skills'
                                value={searchSkills && searchSkills}
                                onChange={(e) => setSearchSkills(e.target.value)}
                                //required
                            ></Form.Control>
                        </Form.Group>
                        <Button type='submit' variant='primary'>
                            Search
                        </Button>
                    </Form>
                    
                </Col>
            </Row>

            {['Analyst', 'Consultant', 'Senior consultant', 'Manager', 'Senior manager', 'Director', 'Partner'].map((grade, gradVal) => (
                
                <div key={gradVal}>

                    <Row className='mt-3'>
                        <Col>
                            <h5>{grade} availabilities</h5>
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
                                                y.grade === grade && (
                                                    <OverlayTrigger
                                                        key={yVal}
                                                        placement="bottom"
                                                        overlay={<Tooltip id="button-tooltip-2">{y.comment ? y.comment : 'no comment'}</Tooltip>}
                                                    >
                                                        <Form.Control
                                                            className="px-2"
                                                            plaintext
                                                            readOnly
                                                            id={y.name}
                                                            value={y.availableDay.toString() + ' : ' + y.name}
                                                            style={(y.name === focus) ? {background: '#464277', color: 'white'} : {color: 'black'}}
                                                            onFocus={(e) => {
                                                                setFocus(e.target.id)
                                                                console.log(e.target.id)
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

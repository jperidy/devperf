import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { Link } from 'react-router-dom';
import { getTace } from '../actions/pxxActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Card } from 'react-bootstrap';

const DashboardScreen = ({ history }) => {

    const dispatch = useDispatch();

    // initialization of default constants
    const duration = 2;
    let startDefault = new Date(Date.now());
    startDefault.setUTCDate(1);
    startDefault.setUTCMonth(startDefault.getUTCMonth() - duration);
    startDefault = startDefault.toISOString().substring(0, 10);

    let endDefault = new Date(Date.now());
    endDefault.setUTCDate(1);
    endDefault.setUTCMonth(endDefault.getUTCMonth() + duration);
    endDefault = endDefault.toISOString().substring(0, 10);

    const [practice, setPractice] = useState('');
    const [start, setStart] = useState(startDefault);
    const [end, setEnd] = useState(endDefault);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const pxxTACE = useSelector(state => state.pxxTACE);
    const { loading: loadingTACE, error: errorTACE, tace } = pxxTACE;


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
                        <h5>Other Dashboards to build</h5>
                        (consodispo, etc.)
                </Col>
            </Row>
        </>
    )
}

export default DashboardScreen;

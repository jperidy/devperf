import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { getTace, getAvailabilities } from '../actions/pxxActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import ConsoDispo from '../components/ConsoDispo';
import Tace from '../components/Tace';

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
                            value={start && `From: ${start.substring(0, 7).replace('-', '/')}`}
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
                            value={end && `To: ${end.substring(0, 7).replace('-', '/')}`}
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
                        <Tace key={val} tace={x} />
                    ))
                )}
            </Row>

            <ConsoDispo
                practice={practice}
                start={start}
                end={end}
            />

        </>
    )
}

export default DashboardScreen;

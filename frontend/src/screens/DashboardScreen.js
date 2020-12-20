import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
//import Label from 'react-bootstrap/Label';
import FormControl from 'react-bootstrap/FormControl';
import { getTace } from '../actions/pxxActions';

const DashboardScreen = ({history}) => {

    const dispatch = useDispatch();

    // initialization of default constants
    const duration = 2;
    let startDefault = new Date(Date.now());
    startDefault.setUTCDate(1);
    startDefault.setUTCMonth(startDefault.getUTCMonth() - duration);
    startDefault = startDefault.toISOString().substring(0,10);

    let endDefault = new Date(Date.now());
    endDefault.setUTCDate(1);
    endDefault.setUTCMonth(endDefault.getUTCMonth() + duration);
    endDefault = endDefault.toISOString().substring(0,10);

    const [practice, setPractice] = useState('');
    const [start, setStart] = useState(startDefault);
    const [end, setEnd] = useState(endDefault);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const pxxTACE = useSelector(state => state.pxxTACE);
    const { loading:loadingTACE, success: successTACE, error: errorTACE, tace} = pxxTACE;


    useEffect(() => {

        if (!userInfo || userInfo.adminLevel > 2) {
            history.push('/login');
        } else {
            setPractice(userInfo.consultantProfil.practice);
        }
    },[dispatch, history, userInfo]);
    
    /*
    useEffect(() => {
        if(!tace && !loadingTACE) {
            dispatch(getTace(practice, start, end));
        }
        
    }, [dispatch, tace, loadingTACE, practice, start, end]);
    */

    useEffect(() => {
        if (practice, start, end) {
            dispatch(getTace(practice, start, end));
        }
    }, [practice, start, end])
    
    return (
        <>
            <Row>
                <Col>
                    <label htmlFor='start-date'><b>Start date</b></label>
                    <InputGroup controlId='start'>
                        <FormControl
                            type='date'
                            id='start-date'
                            className='mb-3'
                            value={start && start}
                            onChange={(e) => {
                                const date = new Date(e.target.value);
                                date.setUTCDate(1);
                                setStart(date.toISOString().substring(0,10));
                                //dispatch(getTace(practice, start, end));
                            }}
                        ></FormControl>
                    </InputGroup>
                </Col>
                <Col>
                    <label htmlFor='date-end'><b>End date</b></label>
                    <InputGroup controlId='end'>
                        <FormControl
                            type='date'
                            id='date-end'
                            className='mb-3'
                            value={end && end}
                            onChange={(e) => {
                                const date = new Date(e.target.value);
                                date.setUTCDate(1);
                                setEnd(date.toISOString().substring(0,10));
                                //dispatch(getTace(practice, start, end));
                            }}
                        ></FormControl>
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>TACE ({userInfo && userInfo.consultantProfil.practice})</h2>
                </Col>
            </Row>
            <Row>
                {tace && tace.map(x => (
                    <Col>
                        <h3>{x.month.firstDay.toString().substring(0,7)}</h3>
                        <p>
                            TACE: {(Number(x.totalTACE) * 100).toString().substring(0,4)} % <br/>
                            ETP: {x.totalETP.toString().substring(0,4)}
                        </p>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default DashboardScreen;

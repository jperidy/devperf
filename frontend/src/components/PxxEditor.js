import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Message from '../components/Message';
import Loader from '../components/Loader';
import PxxUserLine from '../components/PxxUserLine';
import { getMyConsultantPxxToEdit } from '../actions/pxxActions';

const PxxEditor = ({ consultantsMy, consultantFocus, searchDate, navigationMonthHandler }) => {

    const dispatch = useDispatch();

    const [numberOfMonth] = useState(5);

    const pxxMyToEdit = useSelector(state => state.pxxMyToEdit);
    const { loading: loadingPxx, error: errorPxx, pxx } = pxxMyToEdit;

    const pxxUpdate = useSelector(state => state.pxxUpdate);
    const { loading: loadingUpdate, error: errorUpdate } = pxxUpdate;

    let consultantId = consultantsMy[consultantFocus]._id;
    
    useEffect(() => {

        // Effect when loading component and each time entry parameters change
        dispatch(getMyConsultantPxxToEdit(consultantId, searchDate, numberOfMonth));
    }, [dispatch, searchDate, numberOfMonth, consultantId]);

    return (
        <>

            <Row>
                <Col xs={4} className="text-center align-middle px-1 pb-2"> {loadingUpdate && <Loader />}</Col>
                <Col xs={2} className="text-center align-middle px-1 pb-2"><b>Prod</b></Col>
                <Col xs={2} className="text-center align-middle px-1 pb-2"><b>Not Prod</b></Col>
                <Col xs={2} className="text-center align-middle px-1 pb-2"><b>Holidays</b></Col>
                <Col xs={2} className="text-center align-middle px-1 pb-2"><b>Availability</b></Col>
            </Row>

            {loadingPxx ? <Loader /> : errorPxx ? <Message variant="danger">{errorPxx}</Message> : (
                pxx.map((line, key) => (
                        <PxxUserLine
                            key={key}
                            data={line}
                        />
                ))
            )}

            {errorUpdate && (
                <Row><Message variant='danger'>{errorUpdate}</Message></Row>
            )}
            
            <Row>
                <Col xs={0} md={6}></Col>
                <Col xs={6} md={2} className="text-right">
                    <Button
                        className='btn btn-primary mt-3'
                        variant='primary'
                        size='sm'
                        onClick={() => navigationMonthHandler(-1)}
                        block
                    ><i className="fas fa-caret-left"></i>  Previous</Button>
                </Col>
                <Col xs={6} md={2} className="text-left">
                    <Button
                        className='btn btn-primary mt-3'
                        variant='primary'
                        size='sm'
                        onClick={() => navigationMonthHandler(1)}
                        block
                    >Next  <i className="fas fa-caret-right"></i></Button>
                </Col>
                <Col xs={0} md={2}></Col>
            </Row>

        </>
    )
}

export default PxxEditor;

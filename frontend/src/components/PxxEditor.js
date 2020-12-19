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
    const { loading: loadingConsultantMyToEdit, error: errorConsultantMyToEdit, pxx } = pxxMyToEdit;

    let consultantId = consultantsMy[consultantFocus]._id;
    
    useEffect(() => {

        // Effect when loading component and each time entry parameters change
        dispatch(getMyConsultantPxxToEdit(consultantId, searchDate, numberOfMonth));
 

    }, [dispatch, searchDate, numberOfMonth, consultantId]);

    return (
        <>

            <Row>
                <Col xs={2} className="text-center"></Col>
                <Col xs={2} className="text-center align-middle px-1"><b>Prod</b></Col>
                <Col xs={2} className="text-center align-middle px-1"><b>Not Prod</b></Col>
                <Col xs={2} className="text-center align-middle px-1"><b>Hollidays</b></Col>
                <Col xs={2} className="text-center align-middle px-1"><b>Availability</b></Col>
                <Col xs={2} className="text-center">
                    <Button
                        className='btn btn-primary mb-3'
                        variant='primary'
                        size='sm'
                        onClick={() => navigationMonthHandler(-1)}
                    ><i className="fas fa-caret-up"></i>
                    </Button>
                </Col>
            </Row>

            {loadingConsultantMyToEdit ? <Loader /> : errorConsultantMyToEdit ? <Message variant="danger">{errorConsultantMyToEdit}</Message> : (
                pxx.map((line, key) => (
                        <PxxUserLine
                            key={key}
                            data={line}
                        />
                ))
            )}
            <Row>
                <Col xs={2} className="text-center"></Col>
                <Col xs={2} className="text-center align-middle px-1"></Col>
                <Col xs={2} className="text-center align-middle px-1"></Col>
                <Col xs={2} className="text-center align-middle px-1"></Col>
                <Col xs={2} className="text-center align-middle px-1"></Col>
                <Col xs={2} className="text-center">
                    <Button
                        className='btn btn-primary mt-3'
                        variant='primary'
                        size='sm'
                        onClick={() => navigationMonthHandler(1)}
                    ><i className="fas fa-caret-down"></i>
                    </Button>
                </Col>
            </Row>

        </>
    )
}

export default PxxEditor;

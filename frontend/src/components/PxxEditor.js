import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Message from '../components/Message';
import Loader from '../components/Loader';
import PxxUserLine from '../components/PxxUserLine';
import { getMyConsultantPxxToEdit } from '../actions/pxxActions';

const PxxEditor = ({ consultantFocus, searchDate, navigationMonthHandler }) => {

    const dispatch = useDispatch();

    const [numberOfMonth] = useState(5);

    const consultantsMyList = useSelector(state => state.consultantsMyList);
    const { consultantsMy } = consultantsMyList;

    const pxxMyToEdit = useSelector(state => state.pxxMyToEdit);
    const { loading: loadingConsultantMyToEdit, error: errorConsultantMyToEdit, pxx } = pxxMyToEdit;

    useEffect(() => {

        let consultantId = consultantsMy[consultantFocus]._id;

        dispatch(getMyConsultantPxxToEdit(consultantId, searchDate, numberOfMonth));

    }, [dispatch, searchDate, numberOfMonth, consultantFocus, consultantsMy]);

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
                        variant='primary'
                        size='sm'
                        onClick={() => navigationMonthHandler(-1)}
                    ><i className="fas fa-caret-up"></i>
                    </Button>
                </Col>
            </Row>

            {loadingConsultantMyToEdit ? <Loader /> : errorConsultantMyToEdit ? <Message variant="danger">{errorConsultantMyToEdit}</Message> : (
                pxx.map((line) => (
                    <PxxUserLine
                        key={line.month._id}
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

export default PxxEditor

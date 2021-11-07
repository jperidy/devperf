import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Message from '../components/Message';
import Loader from '../components/Loader';
import PxxUserLine from '../components/PxxUserLine';
import { getMyConsultantPxxToEdit } from '../actions/pxxActions';
import ListGroup from 'react-bootstrap/ListGroup';

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
        <ListGroup.Item>
            <Row>
                <Col xs={4} className='text-center align-middle'>
                    <Button
                        className='btn btn-primary mt-3'
                        variant='primary'
                        size='sm'
                        onClick={() => navigationMonthHandler(-1)}
                        style={{width: '8em'}}
                    ><i className="fas fa-caret-up"></i>  Previous</Button>
                </Col>
            </Row>
            <Row>
                <Col xs={4} className="text-center align-middle px-1 pb-2" style={{height: '2em'}}> {loadingUpdate && <Loader />}</Col>
                <Col xs={2} className="text-center align-middle px-1 pb-2"><strong>Prd</strong></Col>
                <Col xs={2} className="text-center align-middle px-1 pb-2"><strong>NPrd</strong></Col>
                <Col xs={2} className="text-center align-middle px-1 pb-2"><strong>Hld</strong></Col>
                <Col xs={2} className="text-center align-middle px-1 pb-2"><strong>Avlb</strong></Col>
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
                <Col xs={4} className='text-center align-middle'>
                    <Button
                        className='btn btn-primary mt-3'
                        variant='primary'
                        size='sm'
                        onClick={() => navigationMonthHandler(1)}
                        style={{width: '8em'}}
                    >Next  <i className="fas fa-caret-down"></i></Button>
                </Col>
            </Row>

        </ListGroup.Item>
    )
}

export default PxxEditor;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Loader from './Loader';
import { getAllStaffs } from '../actions/consultantActions';

const ViewStaffs = ({history, consultantId, displayedDeal = '', onNavigate=()=>('')}) => {

    const dispatch = useDispatch();
    const consultantAllStaffs = useSelector(state => state.consultantAllStaffs);
    const { loading, staffings } = consultantAllStaffs;

    useEffect(() => {
        if (consultantId) {
            dispatch(getAllStaffs(consultantId));
        }
    }, [dispatch, consultantId]);

    return (
        <Row>
            <Col className='mt-5'>
                <h4>Others staffings</h4>
                <Row className='mt-3'>
                    <Col><strong>Company</strong></Col>
                    <Col><strong>Title</strong></Col>
                    <Col><strong>Practice</strong></Col>
                    <Col><strong>Probability</strong></Col>
                    <Col><strong>Start</strong></Col>
                    <Col><strong>Request status</strong></Col>
                    <Col></Col>
                </Row>

                {loading && <Loader />}
                {staffings && staffings.map(deal => (deal._id !== displayedDeal) && (
                    <ListGroup.Item
                        key={deal._id}
                    >
                        <Row className='align-items-center'>
                            <Col>
                                {deal.company}
                            </Col>
                            <Col>
                                {deal.title}
                            </Col>
                            <Col>
                                {deal.mainPractice}
                            </Col>
                            <Col>
                                {deal.probability} %
                                    </Col>
                            <Col>
                                {deal.startDate.substring(0, 10)}
                            </Col>
                            <Col>
                                {deal.requestStatus}
                            </Col>
                            <Col>
                                <Button
                                    onClick={() => {
                                        history.push(`/staffing/${deal._id}`);
                                        onNavigate();
                                    }}
                                    variant='light'
                                ><i className="fas fa-edit"></i></Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </Col>
        </Row>
    )
}

export default ViewStaffs;

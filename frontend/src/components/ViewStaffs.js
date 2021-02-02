import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
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
            <Col>
                <Table responsive over striped className='mt-3'>
                    <thead>
                        <tr className='table-light'>
                            <th className='align-middle text-dark'>Company</th>
                            <th className='align-middle text-dark'>Title</th>
                            <th className='align-middle text-dark'>Practice</th>
                            <th className='align-middle text-dark'>Probability</th>
                            <th className='align-middle text-dark'>Start</th>
                            <th className='align-middle text-dark'>Request status</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && <Loader />}
                        {staffings && staffings.map(deal => (deal._id !== displayedDeal) && (
                            <tr key={deal._id}>
                                <td className='align-middle'>{deal.company}</td>
                                <td className='align-middle'>{deal.title}</td>
                                <td className='align-middle'>{deal.mainPractice}</td>
                                <td className='align-middle'>{deal.probability} %</td>
                                <td className='align-middle'>{deal.startDate.substring(0, 10)}</td>
                                <td className='align-middle'>{deal.requestStatus}</td>
                                <td className='align-middle'>
                                    <Button
                                        onClick={() => {
                                            history.push(`/staffing/${deal._id}`);
                                            onNavigate();
                                        }}
                                        variant='light'
                                    ><i className="fas fa-edit"></i></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </Table>
            </Col>

            {/* <Col >
                <Row className='mt-3'>
                    <Col><strong>Company</strong></Col>
                    <Col><strong>Title</strong></Col>
                    <Col><strong>Practice</strong></Col>
                    <Col><strong>Probability</strong></Col>
                    <Col><strong>Start</strong></Col>
                    <Col><strong>Request status</strong></Col>
                    <Col></Col>
                </Row>

                
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
            </Col> */}
        </Row>
    )
}

export default ViewStaffs;

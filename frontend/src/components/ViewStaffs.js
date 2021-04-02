import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Loader from './Loader';
import { getAllStaffs } from '../actions/consultantActions';

const ViewStaffs = ({ history, consultantId, displayedDeal = '', onNavigate = () => ('') }) => {

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
                {loading && <Loader />}
                <Table responsive hover striped className='mt-3'>
                    <thead>
                        <tr className='table-light'>
                            <th className='align-middle text-dark'>Company</th>
                            <th className='align-middle text-dark'>Title</th>
                            <th className='align-middle text-dark'>Practice</th>
                            <th className='align-middle text-dark'>Probability</th>
                            <th className='align-middle text-dark'>Start</th>
                            <th className='align-middle text-dark'>Deal status</th>
                            <th className='align-middle text-dark'>Request status</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {staffings && staffings.map(deal => (deal._id.toString() !== displayedDeal.toString()) && (
                            <tr key={deal._id}>
                                <td className='align-middle'>{deal.company}</td>
                                <td className='align-middle'>{deal.title}</td>
                                <td className='align-middle'>{deal.mainPractice}</td>
                                <td className='align-middle'>{deal.probability} %</td>
                                <td className='align-middle'>{deal.startDate.substring(0, 10)}</td>
                                <td className='align-middle'>{deal.status}</td>
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
        </Row>
    )
}

export default ViewStaffs;

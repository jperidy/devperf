import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { getPxxList } from '../actions/pxxActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const PxxListScreen = ({history}) => {

    const dispatch = useDispatch();

    const currentDate = Date.now();

    const [searchDate, setSearchDate] = useState(currentDate);
    const [numberOfMonth, setNumberOfMonth] = useState(3);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const pxxList = useSelector(state => state.pxxList);
    const { loading: loadingPxxsList, error: errorPxxsList, pxxs } = pxxList;

    useEffect(() => {
        if(!userInfo){
            history.push('/login');
        }

        dispatch(getPxxList(searchDate, numberOfMonth));
    }, [dispatch, searchDate, numberOfMonth, userInfo]);


    const navigationMonthHandler = (number) => {
        const newSearchDate = new Date(searchDate);
        newSearchDate.setMonth(newSearchDate.getMonth() + number);
        setSearchDate(Number(newSearchDate));
    }

    return (
        <>
            <Row className='my-3'>
                <Col md={3} className="text-center align-middle">
                    <Button
                        variant='secondary'
                        className='btn-sm mx-3 text-center align-middle'
                        onClick={() => navigationMonthHandler(-1)}
                    ><i className="fas fa-arrow-alt-circle-left mx-1"></i>previous</Button>
                </Col>
                <Col md={6} className="text-center align-middle"><h3>Pxx informations</h3></Col>
                <Col md={3} className="text-center align-middle">
                    <Button
                        variant='secondary'
                        className='btn-sm mx-3 text-center align-middle'
                        onClick={() => navigationMonthHandler(1)}
                    ><i className="fas fa-arrow-alt-circle-right mx-1"></i>next</Button>
                </Col>
            </Row>
            <Row>
                {loadingPxxsList ? (
                    <Loader />
                ) : errorPxxsList ? (
                    <Message variant='danger'>{errorPxxsList}</Message>
                ) : (
                            <Table responsive hover striped>
                                <thead>
                                    <tr className='table-primary'>
                                        <th className='align-middle col-md-2'>Consultant name</th>
                                        <th className='align-middle'>Arrival</th>
                                        <th className='align-middle'>Leaving</th>
                                        <th className='align-middle'>Seniority</th>
                                        {pxxs.pxxMonthInformation[0] && pxxs.pxxMonthInformation[0].map(({ name, value }, num) => (
                                            name !== '' && <th
                                                key={num}
                                                className='text-center align-middle'
                                                colSpan={4}
                                            >{name} <i>({value} days)</i></th>
                                        ))}
                                    </tr>
                                    <tr className='table-secondary'>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>

                                        {pxxs.pxxMonthInformation[1] && pxxs.pxxMonthInformation[1].map(({ value }, num) => (
                                            <th
                                                className='text-center align-middle'
                                                key={num}
                                            >{value}</th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {pxxs.pxxUserList.map((user, number) => (
                                        <tr key={number}>
                                            {user.map((cell) => (
                                                cell.type === "lineInformation" ? (
                                                    <td
                                                        key={cell.userId + '_' + cell.information}
                                                        className='align-middle'
                                                    >

                                                        {cell.information === 'consultantName' && (
                                                            <LinkContainer to={`/pxx/${cell.userId}/date/${Number(searchDate)}`}>
                                                                <Button
                                                                    variant='secondary'
                                                                    className='btn-sm mx-3'
                                                                ><i className="fas fa-edit"></i>
                                                                </Button>
                                                            </LinkContainer>

                                                        )}
                                                        {cell.value}
                                                    </td>
                                                ) : cell.type === "day" ? (
                                                    <td
                                                        key={cell.userId + '_' + cell.pxxId + '_' + cell.information}
                                                        className='text-center align-middle'
                                                    >{cell.value}</td>
                                                ) : (
                                                            null
                                                        )
                                            ))}
                                        </tr>
                                    ))}

                                </tbody>
                            </Table>
                        )}
            </Row>
        </>
    )
};

export default PxxListScreen;

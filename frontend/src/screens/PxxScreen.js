import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getPxxList } from '../actions/pxxActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const PxxScreen = () => {

    const dispatch = useDispatch();

    const currentDate = Date.now();
    //currentDate.setDate(0);

    const [searchDate, setSearchDate] = useState(currentDate);
    const [numberOfMonth, setNumberOfMonth] = useState(3);

    const pxxList = useSelector(state => state.pxxList);
    const { loading: loadingPxxsList, error: errorPxxsList, pxxs } = pxxList;


    useEffect(() => {
        //dispatch(getmonthInfoSynthese(searchDate, numberOfMonth));
        dispatch(getPxxList(searchDate, numberOfMonth));
    }, [dispatch, searchDate, numberOfMonth]);

    const editPxxHandler = (userId) => {
        console.log(`editPxxHandler: ${userId}`);
    }

    const updatePxxHandler = (userId, pxxId) => {
        console.log(`updatepxxHandler: userId:${userId} pxxId:${pxxId}`);
    }

    return (
        <>
            {loadingPxxsList ? (
                <Loader />
            ) : errorPxxsList ? (
                <Message variant='danger'>{errorPxxsList}</Message>
            ) : (
                        <Table responsive hover striped>
                            <thead>
                                <tr className='table-primary'>
                                    <th className='text-center align-middle'>Consultant name</th>
                                    <th className='text-center align-middle'>Arrival</th>
                                    <th className='text-center align-middle'>Leaving</th>
                                    <th className='text-center align-middle'>Seniority</th>
                                    {pxxs.pxxMonthInformation[0] && pxxs.pxxMonthInformation[0].map(({name, value}, num) => (
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
                                    
                                    {pxxs.pxxMonthInformation[1] && pxxs.pxxMonthInformation[1].map(({value}, num) => (
                                        <th
                                            className='text-center align-middle'
                                            key={num}
                                        >{value}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                            {pxxs.pxxUserList.map( (user, number) => (
                                <tr key={number}>
                                    {user.map((cell) => (
                                        cell.type === "lineInformation" ? (
                                            <td 
                                                key={cell.userId + '_' + cell.information}
                                                className='text-center align-middle'
                                            >
                                                
                                                {cell.information === 'consultantName' && (
                                                    
                                                    <Button
                                                        variant='secondary'
                                                        className='btn-sm mx-3'
                                                        onClick={() => editPxxHandler(cell.userId)}
                                                    ><i className="fas fa-edit"></i>
                                                    </Button>
                                                    
                                                )}
                                                {cell.value}
                                            </td>
                                        ) : cell.type === "day" ? (
                                            <td 
                                                key={cell.userId + '_' + cell.pxxId + '_' + cell.information}
                                                className='text-center align-middle'
                                            >
                                                <Form>
                                                    <Form.Group controlId="value">
                                                        <Form.Control
                                                            type='number'
                                                            value={cell.value}
                                                            onChange={() => updatePxxHandler(cell.userId, cell.pxxId)}
                                                            size='sm'
                                                        ></Form.Control>
                                                    </Form.Group>
                                                </Form>                                                
                                            </td>
                                        ) : (
                                            null
                                        )
                                    ))}
                                </tr>
                            ))}

                            </tbody>
                        </Table>
                    )}
        </>
    )
};

export default PxxScreen;

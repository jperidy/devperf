import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import pxxData from '../data/pxxData';
import Table from 'react-bootstrap/Table';
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


    return (
        <>
            {loadingPxxsList ? (
                <Loader />
            ) : errorPxxsList ? (
                <Message variant='danger'>{errorPxxsList}</Message>
            ) : (
                        <Table responsive>
                            <thead>
                                <tr className='table-primary'>
                                    <th className='text-center align-middle'>Consultant name</th>
                                    <th className='text-center align-middle'>Arrival</th>
                                    <th className='text-center align-middle'>Leaving</th>
                                    <th className='text-center align-middle'>Seniority</th>
                                    {pxxs.pxxMonthInformation.map(({ name, workingday }) => (
                                        <th
                                            className='text-center align-middle'
                                            key={name}
                                            colspan={4}
                                        >{name} <i>({workingday} days)</i></th>
                                    ))}
                                </tr>
                                <tr className='table-secondary'>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    {pxxs.pxxMonthInformation.map((name) => (
                                        <>
                                            <th className="text-justify">P</th>
                                            <th className="text-justify">NP</th>
                                            <th className="text-justify">L</th>
                                            <th className="text-justify">A</th>
                                        </>
                                    ))}

                                </tr>
                            </thead>

                            <tbody>
                            {pxxs.pxxUserList.map( (user, number) => (
                                <tr key={number}>
                                    {user.map((cell) => (
                                        cell.type === "lineInformation" ? (
                                            <td key={cell.userId + '_' + cell.information}>{cell.value}</td>
                                        ) : cell.type === "day" ? (
                                            <td key={cell.userId + '_' + cell.pxxId + '_' + cell.information}>{cell.value}</td>
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

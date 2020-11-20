import React, { useState, useEffect } from 'react';
import axios from 'axios';
import pxxData from '../data/pxxData';
import Table from 'react-bootstrap/Table';

const PxxScreen = () => {

    const [monthData, setMonthData] = useState([]);

    useEffect(() => {
        axios.get('/api/monthdata')
            .then(function(res){
                setMonthData(res.data);
            })
            .catch(function(error){
                console.log(error);
            });
    },[]);


    const calculDayByType = (days, type) => {
        const nbDays = (days.map((day) => {
            if (day.type === type){
                return 1;
            } else {
                return 0;
            }
        })).reduce((acc, item) => acc + item);
        return nbDays;
    };

    const monthDataSynthese = monthData.map(({ month, days }) => {

        const prodDay = calculDayByType(days, 'prod');
        const nonWorkingDay = calculDayByType(days, 'non-working');
        const weekendDay = calculDayByType(days, 'we');

        return { month: month, prodDay: prodDay, nonWorkingDay, weekendDay}

    });

    return (
        <>
            <Table responsive>
                <thead>
                    <tr className='table-primary'>
                        <th className='text-center align-middle'>Consultant name</th>
                        <th className='text-center align-middle'>Arrival</th>
                        <th className='text-center align-middle'>Leaving</th>
                        <th className='text-center align-middle'>Seniority</th>
                        {monthDataSynthese.map(({month, prodDay}) => (
                            <th className='text-center align-middle' colSpan="4">{month} <i>({prodDay} days)</i></th>
                        ))}
                    </tr>
                    <tr className='table-secondary'>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        {monthDataSynthese.map(() => (
                            <>
                                <th className='text-center align-middle'>P</th>
                                <th className='text-center align-middle'>NP</th>
                                <th className='text-center align-middle'>L</th>
                                <th className='text-center align-middle'>A</th>
                            </>
                        ))}

                    </tr>
                </thead>

                <tbody>
                    {pxxData.map((pxx) => (
                        <tr>
                            <td className='text-center align-middle'>{pxx.name}</td>
                            <td className='text-center align-middle'>{pxx.arrival}</td>
                            <td className='text-center align-middle'>{pxx.leaving}</td>
                            <td className='text-center align-middle'>{pxx.seniority}</td>
                            {pxx.pap.map(({ prodDay, nonProdDay, leaving, availability }) => (
                                <>
                                    <td className='text-center align-middle'>{prodDay}</td>
                                    <td className='text-center align-middle'>{nonProdDay}</td>
                                    <td className='text-center align-middle'>{leaving}</td>
                                    <td className='text-center align-middle'>{availability}</td>
                                </>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
};

export default PxxScreen;

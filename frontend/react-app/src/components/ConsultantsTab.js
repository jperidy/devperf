import React from 'react';
import { useDispatch } from 'react-redux';
import Table from 'react-bootstrap/Table';
import { setConsultantFocus } from '../actions/consultantActions';
import Button from 'react-bootstrap/Button';

const ConsultantsTab = ({ history, consultantsMy, focusActive }) => {

    const dispatch = useDispatch();

    const onClickHandler = (focus, consultantId) => {
        focusActive && dispatch(setConsultantFocus(focus));
        //focusActive && setFocus(focus);
        history.push(`/editconsultant/${consultantId}`);
    };

    return (

        <Table responsive hover striped className='mt-3'>
            <thead>
                <tr className='table-light'>
                    <th className='align-middle text-dark'>Consultant name</th>
                    <th className='align-middle text-dark'>Matricule</th>
                    <th className='align-middle text-dark'>Practice</th>
                    <th className='align-middle text-dark'>Valued</th>
                    <th className='align-middle text-dark'>Arrival</th>
                    <th className='align-middle text-dark'>Leaving</th>
                    <th className='align-middle text-dark'>Seniority</th>
                    <th className='align-middle text-dark'>Comment</th>
                    <th className='align-middle text-dark'></th>
                </tr>
            </thead>

            <tbody>
                {consultantsMy.map((consultant, focus) => (
                    <tr key={consultant._id} onClick={() => focusActive && dispatch(setConsultantFocus(focus))}>
                        <td className='align-middle'>{consultant.name}</td>
                        <td className='align-middle'>{consultant.matricule}</td>
                        <td className='align-middle'>{consultant.practice}</td>
                        <td className='align-middle'>{consultant.valued ? consultant.valued.substring(0,10) : ''}</td>
                        <td className='align-middle'>{consultant.arrival ? consultant.arrival.substring(0,10) : ''}</td>
                        <td className='align-middle'>{consultant.leaving ? consultant.leaving.substring(0,10) : ''}</td>
                        <td className='align-middle'>{
                                consultant.valued ? ((new Date(Date.now()) - new Date(consultant.valued.substring(0,10)))/(1000*3600*24*365.25)).toString().substring(0,4) : 0
                            } years</td>
                        <td className='align-middle'>{consultant.comment}</td>
                        <td className='align-middle'>
                            <Button className='btn btn-light p-1' onClick={() => onClickHandler(focus, consultant._id)}>
                                <i className="fas fa-user-edit"></i>
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default ConsultantsTab;

import React from 'react';
import { useDispatch } from 'react-redux';
import Table from 'react-bootstrap/Table';
import { setConsultantFocus } from '../actions/consultantActions';
import Button from 'react-bootstrap/Button';

const ConsultantsTab = ({ history, consultantsMy, focusActive }) => {

    const dispatch = useDispatch();

    const onClickHandler = (focus, consultantId) => {
        focusActive && dispatch(setConsultantFocus(focus));
        history.push(`/editconsultant/${consultantId}`);
    };

    return (
        <Table responsive hover striped>
            <thead>
                <tr className='table-primary'>
                    <th className='align-middle text-light'>Consultant name</th>
                    <th className='align-middle text-light'>Matricule</th>
                    <th className='align-middle text-light'>Practice</th>
                    <th className='align-middle text-light'>Valued</th>
                    <th className='align-middle text-light'>Arrival</th>
                    <th className='align-middle text-light'>Leaving</th>
                    <th className='align-middle text-light'>Seniority</th>
                    <th className='align-middle text-light'>Comment</th>
                    <th className='align-middle text-light'></th>
                </tr>
            </thead>

            <tbody>
                {consultantsMy.map((consultant, focus) => (
                    <tr key={consultant._id} onClick={() => focusActive && dispatch(setConsultantFocus(focus))}>
                        <td className='align-middle'>{consultant.name}</td>
                        <td className='align-middle'>{consultant.matricule}</td>
                        <td className='align-middle'>{consultant.practice}</td>
                        <td className='align-middle'>{consultant.valued.substring(0,10)}</td>
                        <td className='align-middle'>{consultant.arrival ? consultant.arrival.substring(0,10) : ''}</td>
                        <td className='align-middle'>{consultant.leaving ? consultant.leaving.substring(0,10) : ''}</td>
                        <td className='align-middle'>{
                                ((new Date(Date.now()) - new Date(consultant.valued.substring(0,10)))/(1000*3600*24*365.25)).toString().substring(0,4)
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

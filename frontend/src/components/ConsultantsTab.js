import React from 'react';
import { useDispatch } from 'react-redux';
import Table from 'react-bootstrap/Table';
import { setConsultantFocus } from '../actions/consultantActions';
import Button from 'react-bootstrap/Button';

const ConsultantsTab = ({ history, consultantsMy }) => {

    const dispatch = useDispatch();

    const onClickHandler = (focus, consultantId) => {
        dispatch(setConsultantFocus(focus));
        history.push(`/editconsultant/${consultantId}`);
    };

    return (
        <Table responsive hover striped>
            <thead>
                <tr className='table-primary'>
                    <th className='align-middle'>Consultant name</th>
                    <th className='align-middle'>Matricule</th>
                    <th className='align-middle'>Practice</th>
                    <th className='align-middle'>Valued</th>
                    <th className='align-middle'>Arrival</th>
                    <th className='align-middle'>Leaving</th>
                    <th className='align-middle'>Seniority</th>
                    <th className='align-middle'>Comment</th>
                    <th className='align-middle'></th>
                </tr>
            </thead>

            <tbody>
                {consultantsMy.map((consultant, focus) => (
                    <tr key={consultant._id} onClick={() => dispatch(setConsultantFocus(focus))}>
                        <td>{consultant.name}</td>
                        <td>{consultant.matricule}</td>
                        <td>{consultant.practice}</td>
                        <td>{consultant.valued.substring(0,10)}</td>
                        <td>{consultant.arrival.substring(0,10)}</td>
                        <td>{consultant.leaving.substring(0,10)}</td>
                        <td>{
                                ((new Date(Date.now()) - new Date(consultant.valued.substring(0,10)))/(1000*3600*24*365.25)).toString().substring(0,4)
                            } years</td>
                        <td>{consultant.comment}</td>
                        <td>
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

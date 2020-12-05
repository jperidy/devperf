import React from 'react';
import Table from 'react-bootstrap/Table';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';

const pxxListConsultants = ({ consultantsMy, consultantFocus }) => {
    return (
        <Table responsive hover striped>
            <thead>
                <tr className='table-primary'>
                    <th className='align-middle'>Consultant name</th>
                    <th className='align-middle'>Matricule</th>
                    <th className='align-middle'>Arrival</th>
                    <th className='align-middle'>Leaving</th>
                    <th className='align-middle'>Seniority</th>
                    <th className='align-middle'>Comment</th>
                    <th className='align-middle'></th>
                </tr>
            </thead>

            <tbody>
                {consultantsMy.map((consultant, focus) => (
                    <tr key={consultant._id}>
                        <td>{consultant.name}</td>
                        <td>{consultant.matricule}</td>
                        <td>{consultant.arrival}</td>
                        <td>{consultant.leaving}</td>
                        <td>{consultant.seniority}</td>
                        <td>{consultant.comment}</td>
                        <td>
                            <LinkContainer to={`/editconsultant/${consultant._id}`}>
                                <Nav.Link>
                                    <i className="fas fa-user-edit"></i>
                                </Nav.Link>
                            </LinkContainer>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default pxxListConsultants;

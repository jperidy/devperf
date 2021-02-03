import React from 'react';
import { useDispatch } from 'react-redux';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { deleteDeal } from '../actions/dealActions';

const DealList = ({ history, data = [] }) => {

    const dispatch = useDispatch();

    const onClickDeleteHandler = (deal) => {
        if (window.confirm(`Are you sure to delete deal: ${deal.title} ?`)) {
            dispatch(deleteDeal(deal._id));
        }
    }
    const formatName = (fullName) => {
        const separateName = fullName.split(' ');
        if (separateName.length === 1) {
            return separateName[0];
        } else {
            const outName = separateName.map((word, indice1) => {
                if (indice1 === 0) {
                    return word[0].toUpperCase() + '.';
                } else {
                    return word.toUpperCase();
                }
            });
            return outName.join(' ');
        }
    }

    return (
        <Table responsive hover striped>
            <thead>
                <tr className='table-primary'>
                    <th className='align-middle text-light'>Title</th>
                    <th className='align-middle text-light'>Practice</th>
                    <th className='align-middle text-light'>Contacts</th>
                    <th className='align-middle text-light'>Company</th>
                    <th className='align-middle text-light'>Status</th>
                    <th className='align-middle text-light'>Probability</th>
                    <th className='align-middle text-light'>Request</th>
                    <th className='align-middle text-light'>Start</th>
                    <th className='align-middle text-light'></th>
                    <th className='align-middle text-light'></th>
                </tr>
            </thead>

            <tbody>
                {data && data.deals.map((deal) => (
                    <tr key={deal._id}>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="button-tooltip-2">{
                                deal.description
                            }</Tooltip>}
                        >
                            <td className='align-middle'>{deal.title}</td>
                        </OverlayTrigger>
                        <td className='align-middle'>{deal.mainPractice} / ({deal.othersPractices.toString()})</td>
                        <td className='align-middle'>{deal.contacts.primary ? formatName(deal.contacts.primary.name) : 'Please identify'} {deal.contacts && deal.contacts.secondary && '/ (' + deal.contacts.secondary.map(x => formatName(x.name.toString())).join(', ') + ')'}</td>
                        <td className='align-middle'>{deal.company}</td>
                        <td className='align-middle'>{deal.status}</td>
                        <td className='align-middle'>{deal.probability}</td>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="button-tooltip-2">{
                                deal.staffingRequest.instructions
                            }</Tooltip>}
                        >
                            <td className='align-middle'>{deal.staffingRequest.requestStatus}</td>
                        </OverlayTrigger>
                        <td className='align-middle'>{deal.startDate.substring(0, 10)}</td>
                        <td className='align-middle'>
                            <Button
                                variant='primary'
                                onClick={() => history.push(`/staffing/${deal._id}`)}
                                size='sm'
                            ><i className="fas fa-edit"></i>
                            </Button>
                        </td>
                        <td className='align-middle'>
                            <Button
                                variant='danger'
                                onClick={() => onClickDeleteHandler(deal)}
                                size='sm'
                            ><i className="fas fa-times"></i>
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default DealList;
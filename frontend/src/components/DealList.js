import React from 'react';
import { useDispatch } from 'react-redux';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Form from 'react-bootstrap/Form'
import { deleteDeal } from '../actions/dealActions';
import { DEAL_STATUS, REQUEST_STATUS } from '../constants/dealConstants';

const DealList = ({ history, data = [], filter }) => {

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
        <Table responsive hover striped className='mt-3'>
            <thead>
                <tr className='table-primary'>
                    <th className='align-middle text-light'>Title</th>
                    <th className='align-middle text-light'>Practice</th>
                    <th className='align-middle text-light'>Contacts</th>
                    <th className='align-middle text-light'>Company</th>
                    <th className='align-middle text-light'>Status</th>
                    <th className='align-middle text-light'>Probability</th>
                    <th className='align-middle text-light'>Request</th>
                    <th className='align-middle text-light'>Staff</th>
                    <th className='align-middle text-light'>Start</th>
                    <th className='align-middle text-light'></th>
                    <th className='align-middle text-light'></th>
                </tr>
                <tr className='table-ligth'>
                    <th className='align-middle text-Dark'>
                        <Form.Group controlId='filter-title' className='mb-0'>
                            <Form.Control
                                type='text'
                                placeholder='Search title'
                                value={filter.searchTitle && filter.searchTitle}
                                onChange={(e) => { filter.setSearchTitle(e.target.value) }}
                            ></Form.Control>
                        </Form.Group>
                    </th>
                    <th className='align-middle text-Dark'>
                        <Form.Group controlId='filter-practice' className='mb-0'>
                            <Form.Control
                                type='text'
                                placeholder='Search practice'
                                disabled={true}
                                //value={filter.searchContact && filter.searchContact}
                                //onChange={(e) => filter.setSearchContact(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    </th>
                    <th className='align-middle text-Dark'>
                        <Form.Group controlId='filter-contact' className='mb-0'>
                            <Form.Control
                                type='text'
                                placeholder='Search contact'
                                value={filter.searchContact && filter.searchContact}
                                onChange={(e) => filter.setSearchContact(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    </th>
                    <th className='align-middle text-Dark'>
                        <Form.Group controlId='filter-company' className='mb-0'>
                            <Form.Control
                                type='text'
                                placeholder='Search company'
                                value={filter.searchCompany && filter.searchCompany}
                                onChange={(e) => filter.setSearchCompany(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    </th>
                    <th className='align-middle text-Dark'>
                        <Form.Group controlId='filter-status' className='mb-0'>
                            <Form.Control
                                as='select'
                                value={filter.searchDealStatus && filter.searchDealStatus}
                                onChange={(e) => {
                                    filter.setSearchDealStatus(e.target.value)
                                    //setUpdate(true)
                                }}
                            >
                                <option value=''>--Select--</option>
                                {DEAL_STATUS.map(x => (
                                    <option key={x.name} value={x.name}>{x.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </th>
                    <th className='align-middle text-Dark'>
                        <Form.Group controlId='filter-probability' className='mb-0'>
                            <Form.Control
                                type='text'
                                placeholder='Search probability'
                                disabled={true}
                                //value={filter.searchContact && filter.searchContact}
                                //onChange={(e) => filter.setSearchContact(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    </th>
                    <th className='align-middle text-Dark'>
                        <Form.Group controlId='filter-request' className='mb-0'>
                            <Form.Control
                                as='select'
                                value={filter.searchRequestStatus && filter.searchRequestStatus}
                                onChange={(e) => {
                                    filter.setSearchRequestStatus(e.target.value)
                                    //setUpdate(true)
                                }}
                            >
                                <option value=''>--Select--</option>
                                {REQUEST_STATUS.map(x => (
                                    <option key={x.name} value={x.name}>{x.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </th>
                    <th className='align-middle text-Dark'>
                        <Form.Group controlId='filter-staff' className='mb-0'>
                            <Form.Control
                                type='text'
                                placeholder='Search staff'
                                value={filter.searchStaff && filter.searchStaff}
                                onChange={(e) => filter.setSearchStaff(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    </th>
                    <th className='align-middle text-Dark'>
                        <Form.Group controlId='filter-start' className='mb-0'>
                            <Form.Control
                                type='text'
                                placeholder='Search start'
                                disabled={true}
                                //value={filter.searchContact && filter.searchContact}
                                //onChange={(e) => filter.setSearchContact(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    </th>
                    <th className='align-middle text-Dark' colSpan={2}>
                        <Button 
                            variant='ligth'
                            onClick={() => {
                                filter.setSearchTitle('');
                                filter.setSearchCompany('');
                                filter.setSearchContact('');
                                filter.setSearchDealStatus('');
                                filter.setSearchRequestStatus('');
                                filter.setSearchStaff('');
                            }}
                        ><i className="fas fa-minus-circle"></i>  Reset</Button>
                    </th>
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
                        <td className='align-middle'>{deal.mainPractice} / ({deal.othersPractices.join(', ')})</td>
                        <td className='align-middle'>{deal.contacts.primary ? formatName(deal.contacts.primary.name) : '-'} {deal.contacts && deal.contacts.secondary && '/ (' + deal.contacts.secondary.map(x => formatName(x.name.toString())).join(', ') + ')'}</td>
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

                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="button-tooltip-2">{
                                deal.staffingDecision.staff.length > 0 ? (
                                    deal.staffingDecision.staff.map(x => ({ name: formatName(x.idConsultant.name), responsability: x.responsability, priority: x.priority })).map((x, index) => <div className='text-left' key={index}>{`${x.responsability}: ${x.name} (${x.priority})`}</div>)
                                ) : ('-')}</Tooltip>
                            }
                        >
                            <td className='align-middle'>{deal.staffingDecision.staff.length > 0 ? 'See' : '-'}</td>
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
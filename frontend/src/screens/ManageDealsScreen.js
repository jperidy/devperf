import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
//import InputGroup from 'react-bootstrap/InputGroup';
//import FormControl from 'react-bootstrap/FormControl';
import { getAllDeals } from '../actions/dealActions';



const ManageDealsScreen = ({history}) => {

    const dispatch = useDispatch();

    // pagination configuration
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    
    // search configuration
    const [searchTitle, setSearchTitle] = useState('');
    const [searchPractice, setSearchPractice] = useState('');
    const [searchCompany, setSearchCompany] = useState('');
    const [searchClient, setSearchClient] = useState('');
    const [searchDealStatus, setSearchDealStatus] = useState('');
    const [searchRequestStatus, setSearchRequestStatus] = useState('');
    const [searchStart, setSearchStart] = useState('');


    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const dealAllList = useSelector(state => state.dealAllList);
    const { error, success, loading, deals, page, pages } = dealAllList;



    useEffect(() => {
        if (userInfo && (userInfo.adminLevel <= 1)) {
            
            const keyword = {
                title: searchTitle,
                mainPractice: userInfo.consultantProfil.practice,
                othersPractices: searchPractice,
                client: searchClient,
                company: searchCompany,
                status: searchDealStatus,
                request: searchRequestStatus
            }
            dispatch(getAllDeals(keyword, pageNumber, pageSize));
        } else {
            history.push('/login');
        }

    }, [dispatch, history, userInfo, searchTitle, searchPractice, searchCompany, searchClient, searchDealStatus, searchRequestStatus, pageNumber, pageSize]);

    const onClickDeleteHandler = (deal) => {
        if (window.confirm(`Are you sure to delete deal: ${deal.name} ?`)) {
            console.log('dispatch delete')
            //dispatch(deleteSkill(deal._id));
        }
    }

    const filterLeads = () => {
        console.log('dispatch here filter');
    }

    return (
        <>
            <Row className='mt-3'>
                <Col>
                    <Form onSubmit={filterLeads}>
                        <Row>
                            <Col xs={6} md={2}>
                                <Form.Group controlId='filter-title'>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Search title'
                                        value={searchTitle && searchTitle}
                                        onChange={(e) => setSearchTitle(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={2}>
                                <Form.Group controlId='filter-practice'>
                                    <Form.Label>Others practice</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Search practice'
                                        value={searchPractice && searchPractice}
                                        onChange={(e) => setSearchPractice(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={2}>
                                <Form.Group controlId='filter-company'>
                                    <Form.Label>Company</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Search company'
                                        value={searchCompany && searchCompany}
                                        onChange={(e) => setSearchCompany(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={2}>
                                <Form.Group controlId='filter-client'>
                                    <Form.Label>Client</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Search client'
                                        value={searchClient && searchClient}
                                        onChange={(e) => setSearchClient(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={2}>
                                <Form.Label>Status</Form.Label>
                                <Form.Group controlId='filter-status'>
                                    <Form.Control
                                        as='select'
                                        value={searchDealStatus && searchDealStatus}
                                        onChange={(e) => setSearchDealStatus(e.target.value)}
                                    >
                                        <option value=''>--Select--</option>
                                        <option value='Lead'>Lead</option>
                                        <option value='Proposal to send'>Proposal to send</option>
                                        <option value='Proposal sent'>Proposal sent</option>
                                        <option value='Won'>Won</option>
                                        <option value='Abandoned'>Abandoned</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={2}>
                                <Form.Group controlId='filter-request'>
                                    <Form.Label>Request</Form.Label>
                                    <Form.Control
                                        as='select'
                                        value={searchRequestStatus && searchRequestStatus}
                                        onChange={(e) => setSearchRequestStatus(e.target.value)}
                                    >
                                        <option value=''>--Select--</option>
                                        <option value='To do'>To do</option>
                                        <option value='Keep staffing'>Keep staffing</option>
                                        <option value='Retreat staffing'>Keep</option>
                                        <option value='Release staffing'>Available</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row>
                            <Col xs={12} md={2} className='text-right'>
                                <Button type='submit' variant='primary' block>Search</Button>
                            </Col>
                        </Row>

                    </Form>
                </Col>
            </Row>

            {deals && deals.length === 0 ? <Message variant='information'>You have not access to these information</Message> :
                loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (

                    <Table responsive hover striped className='mt-5'>
                        <thead>
                            <tr className='table-primary'>
                                <th className='align-middle text-light'>Title</th>
                                <th className='align-middle text-light'>Practice</th>
                                <th className='align-middle text-light'>Company</th>
                                <th className='align-middle text-light'>Client</th>
                                <th className='align-middle text-light'>Status</th>
                                <th className='align-middle text-light'>Probability</th>
                                <th className='align-middle text-light'>Request</th>
                                <th className='align-middle text-light'>Start</th>
                                <th className='align-middle text-light'></th>
                                <th className='align-middle text-light'></th>
                            </tr>
                        </thead>

                        <tbody>
                            {deals && deals.map((deal) => (
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
                                    <td className='align-middle'>{deal.company}</td>
                                    <td className='align-middle'>{deal.client}</td>
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
                                    <td className='align-middle'>{deal.startDate.substring(0,10)}</td>
                                    <td className='align-middle'>
                                        <Button variant='primary' onClick={() => console.log('go to deal')}>
                                            <i className="fas fa-edit"></i>
                                        </Button>
                                    </td>
                                    <td className='align-middle'>
                                        <Button variant='danger' onClick={() => onClickDeleteHandler(deal)}>
                                            <i className="fas fa-times"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                )}

            <Pagination>
                <Pagination.Prev
                    onClick={() => setPageNumber(page - 1)}
                    disabled={page === 1}
                />
                {[...Array(pages).keys()].map(x => (

                    <Pagination.Item
                        key={x + 1}
                        active={x + 1 === page}
                        onClick={() => {
                            const keyword = {
                                title: searchTitle,
                                mainPractice: userInfo.consultantProfil.practice,
                                othersPractices: searchPractice,
                                client: searchClient,
                                company: searchCompany,
                                status: searchDealStatus,
                                request: searchRequestStatus
                            }
                            dispatch(getAllDeals(keyword, pageNumber, pageSize));
                            setPageNumber(x + 1);
                        }}
                    >{x + 1}</Pagination.Item>

                ))}
                <Pagination.Next
                    onClick={() => setPageNumber(page + 1)}
                    disabled={page === pages}
                />
            </Pagination>
        </>
    )
}

export default ManageDealsScreen

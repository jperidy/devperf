import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import DealList from '../components/DealList';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ListGroup from 'react-bootstrap/ListGroup';
import { getAllDeals } from '../actions/dealActions';
import { DEAL_STATUS, REQUEST_STATUS } from '../constants/dealConstants';
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


const DealsHistoryScreen = ({history}) => {

    const dispatch = useDispatch();

    // pagination configuration
    const [pageSize, setPageSize] = useState('');
    const [pageNumber, setPageNumber] = useState('');

    // search configuration
    const [searchTitle, setSearchTitle] = useState(localStorage.getItem('DealsHistoryScreen.filter') ? JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).title : '');
    const [searchCompany, setSearchCompany] = useState(localStorage.getItem('DealsHistoryScreen.filter') ? JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).company : '');
    const [searchContact, setSearchContact] = useState(localStorage.getItem('DealsHistoryScreen.filter') ? JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).contact : '');
    const [searchDealStatus, setSearchDealStatus] = useState(localStorage.getItem('DealsHistoryScreen.filter') ? JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).dealStatus : '');
    const [searchRequestStatus, setSearchRequestStatus] = useState(localStorage.getItem('DealsHistoryScreen.filter') ? JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).requestStatus : '');
    const [searchMyDeals, setSearchMyDeals] = useState(localStorage.getItem('DealsHistoryScreen.filter') ? JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).myDeals : '');

    const [tabsFilter] = useState([...new Array(5).keys()].map(x => new Date(Date.now()).getFullYear() - x));

    const [dataFiltered, setDataFiltered] = useState([]);

    const [update, setUpdate] = useState(true);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const dealAllList = useSelector(state => state.dealAllList);
    const { error, loading, deals, page, pages, count } = dealAllList;

    const dealDelete = useSelector(state => state.dealDelete);
    const { error: errorDelete, success: successDelete } = dealDelete;

    useEffect(() => {
        if (userInfo) {
            const keyword = {
                title: searchTitle,
                mainPractice: userInfo.consultantProfil.practice,
                othersPractices: userInfo.consultantProfil.practice,
                contact: searchContact,
                company: searchCompany,
                status: searchDealStatus,
                request: searchRequestStatus
            }
            if(update) {
                dispatch(getAllDeals(keyword, pageNumber, pageSize, 'all'));
                localStorage.setItem('DealsHistoryScreen.filter', JSON.stringify({
                    title: searchTitle, 
                    company: searchCompany,
                    contact: searchContact,
                    dealStatus: searchDealStatus,
                    requestStatus: searchRequestStatus,
                    myDeals: searchMyDeals,
                }));
                setUpdate(false);
            }
        } else {
            history.push('/login');
        }

    }, [
        dispatch, 
        history, 
        userInfo, 
        searchTitle, 
        searchCompany, 
        searchContact, 
        searchDealStatus, 
        searchRequestStatus, 
        pageNumber, 
        pageSize,
        update
    ]);

    useEffect(() => {
        if (deals) {

            const filteredData = [];

            for (let incr = 0; incr < tabsFilter.length; incr++) {
                let dealsFiltered = deals.filter( deal => deal.updatedAt.substring(0,4) === tabsFilter[incr].toString());
                dealsFiltered = {
                    deals: dealsFiltered,
                    param: null,
                    setParam: null,
                    exportExcel: dealsFiltered.map((deal) => ({
                        'TITLE': deal.title,
                        'MAIN_PRACTICE': deal.mainPractice,
                        'OTHERS_PRACTICES': deal.othersPractices.join(', '),
                        'LEADER': deal.contacts.primary ? (deal.contacts.primary.name + ' (' + deal.contacts.primary.matricule + ')') : '',
                        'CO-LEADERS': deal.contacts.secondary ? deal.contacts.secondary.map(x => x.name + ' (' + x.matricule + ')').join(', ')  : '',
                        'COMPANY': deal.company,
                        'STATUS': deal.status,
                        'TYPE': deal.type,
                        'DESCRIPTION': deal.description,
                        'PROPOSAL DATE': deal.proposalDate ? deal.proposalDate.substring(0,10) : '',
                        'PRESENTATION DATE': deal.presentationDate ? deal.presentationDate.substring(0,10) : '',
                        'START DATE': deal.startDate ? deal.startDate.substring(0,10) : '',
                        'WON DATE': deal.wonDate ? deal.wonDate.substring(0,10) : '',
                        'STAFF': deal.staffingDecision.staff ? deal.staffingDecision.staff.map(x => x.responsability + ': ' + x.idConsultant.name + ' (' + x.idConsultant.matricule + ')').join(', ') : '',
                    }))
                

                }
                filteredData.push({ filter: tabsFilter[incr], data: dealsFiltered, count: dealsFiltered.deals.length });
            }
            setDataFiltered(filteredData);
        }
    }, [deals, tabsFilter]);

    useEffect(() => {

        if (successDelete) {
            const keyword = {
                title: searchTitle,
                mainPractice: userInfo.consultantProfil.practice,
                othersPractices: userInfo.consultantProfil.practice,
                contact: searchContact,
                company: searchCompany,
                status: searchDealStatus,
                request: searchRequestStatus
            }
            dispatch(getAllDeals(keyword, pageNumber, pageSize));
        }
        // eslint-disable-next-line
    }, [dispatch, successDelete])


    const filterLeads = (e) => {
        //console.log('dispatch here filter');
        e.preventDefault();
        setUpdate(true);
    }

    return (
        <>
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}

            <DropDownTitleContainer title='Search options' close={false}>
                <ListGroup.Item>
                    <Row className='mt-3'>
                        <Col>
                            <Form onSubmit={(e) => filterLeads(e)}>
                                <Row className='align-items-end'>

                                    <Col xs={6} md={2}>
                                        <Form.Group controlId='filter-title' className='mb-0'>
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
                                        <Form.Group controlId='filter-company' className='mb-0'>
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
                                        <Form.Group controlId='filter-contact' className='mb-0'>
                                            <Form.Label>Contact</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Search contact'
                                                value={searchContact && searchContact}
                                                onChange={(e) => setSearchContact(e.target.value)}
                                            ></Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={2}>
                                        <Form.Label>Status</Form.Label>
                                        <Form.Group controlId='filter-status' className='mb-0'>
                                            <Form.Control
                                                as='select'
                                                value={searchDealStatus && searchDealStatus}
                                                onChange={(e) => {
                                                    setSearchDealStatus(e.target.value)
                                                    setUpdate(true)
                                                }}
                                            >
                                                <option value=''>--Select--</option>
                                                {DEAL_STATUS.map(x => (
                                                    <option key={x.name} value={x.name}>{x.name}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={2}>
                                        <Form.Group controlId='filter-request' className='mb-0'>
                                            <Form.Label>Request</Form.Label>
                                            <Form.Control
                                                as='select'
                                                value={searchRequestStatus && searchRequestStatus}
                                                onChange={(e) => {
                                                    setSearchRequestStatus(e.target.value)
                                                    setUpdate(true)
                                                }}
                                            >
                                                <option value=''>--Select--</option>
                                                {REQUEST_STATUS.map(x => (
                                                    <option key={x.name} value={x.name}>{x.name}</option>
                                                ))}

                                            </Form.Control>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} md={2} className='text-right'>
                                        <Button type='submit' variant='primary' block>Search</Button>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={6} md={8}>
                                        <Form.Control
                                            plaintext
                                            readOnly
                                            value={count ? `${count} Deals found` : '0 deals found'} />
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </ListGroup.Item>
            </DropDownTitleContainer>

            <DropDownTitleContainer
                title='Manage Deals'
                close={false}>
                <ListGroup.Item className='p-0'>
                    <Tabs defaultActiveKey={tabsFilter[0]} id="uncontrolled-tab-example" variant='tabs'>
                        {dataFiltered.length > 0 && dataFiltered.map((data, val) => (
                            <Tab
                                key={val}
                                className='mx-3'
                                eventKey={`${data.filter}`}
                                title={data.filter + ' (' + data.data.deals.length + ')'}
                            >
                                {data.data.deals && (
                                    <ExcelFile element={<Button variant='ligth' className='my-3'><i className="fas fa-download"></i>  Download</Button>}>
                                        <ExcelSheet data={data.data.exportExcel} name="dealsSheet">
                                            <ExcelColumn label="TITLE" value="TITLE" />
                                            <ExcelColumn label="MAIN_PRACTICE" value="MAIN_PRACTICE" />
                                            <ExcelColumn label="OTHERS_PRACTICES" value="OTHERS_PRACTICES" />
                                            <ExcelColumn label="LEADER" value="LEADER" />
                                            <ExcelColumn label="CO-LEADERS" value="CO-LEADERS" />
                                            <ExcelColumn label="COMPANY" value="COMPANY" />
                                            <ExcelColumn label="STATUS" value="STATUS" />
                                            <ExcelColumn label="TYPE" value="TYPE" />
                                            <ExcelColumn label="DESCRIPTION" value="DESCRIPTION" />
                                            <ExcelColumn label="PROPOSAL DATE" value="PROPOSAL DATE" />
                                            <ExcelColumn label="PRESENTATION DATE" value="PRESENTATION DATE" />
                                            <ExcelColumn label="START DATE" value="START DATE" />
                                            <ExcelColumn label="WON DATE" value="WON DATE" />
                                            <ExcelColumn label="STAFF" value="STAFF" />
                                        </ExcelSheet>
                                    </ExcelFile>
                                )}

                                <DealList
                                    history={history}
                                    data={data.data}
                                />
                            </Tab>
                        ))}
                    </Tabs>
                </ListGroup.Item>
            </DropDownTitleContainer>
        </>
    )
}

export default DealsHistoryScreen

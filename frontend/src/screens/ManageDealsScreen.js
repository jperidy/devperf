import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import DealList from '../components/DealList';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ListGroup from 'react-bootstrap/ListGroup';
import { getAllDeals } from '../actions/dealActions';
import { FormControl, InputGroup } from 'react-bootstrap';
import { REQUEST_STATUS } from '../constants/dealConstants';

const ManageDealsScreen = ({ history }) => {

    const dispatch = useDispatch();

    // pagination configuration
    const [pageSize] = useState('');
    const [pageNumber] = useState('');

    // search configuration
    const [searchTitle, setSearchTitle] = useState(localStorage.getItem('ManageDealsScreen.filter') && JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).title ? JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).title : '');
    const [searchCompany, setSearchCompany] = useState(localStorage.getItem('ManageDealsScreen.filter') && JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).company ? JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).company : '');
    const [searchContact, setSearchContact] = useState(localStorage.getItem('ManageDealsScreen.filter') && JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).contact ? JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).contact : '');
    const [searchDealStatus, setSearchDealStatus] = useState(localStorage.getItem('ManageDealsScreen.filter') && JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).dealStatus ? JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).dealStatus : '');
    const [searchRequestStatus, setSearchRequestStatus] = useState(localStorage.getItem('ManageDealsScreen.filter') && JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).requestStatus ? JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).requestStatus : '');
    const [searchMyDeals, setSearchMyDeals] = useState(localStorage.getItem('ManageDealsScreen.filter') && JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).myDeals ? JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).myDeals : '');
    const [searchStaff, setSearchStaff] = useState(localStorage.getItem('ManageDealsScreen.filter') && JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).searchStaff ? JSON.parse(localStorage.getItem('ManageDealsScreen.filter')).searchStaff : '');

    const [updateFilter, setUpdateFilter] = useState(7);
    const [notUpdateFilter, setNotUpdateFilter] = useState(30);
    const [newDealFilter, setNewDealFilter] = useState(7);
    const [wonDealFilter, setWonDealFilter] = useState(7);

    const [changePeriod, setChangePeriod] = useState(false);

    const [tabsFilter] = useState(['Waiting staffing', `Updated (${updateFilter}d)`, `Not updated (${notUpdateFilter}d)`, `New deal (${newDealFilter}d)`, `Won (${wonDealFilter}d)`, 'All']);

    const [defaultTabs, setDefaultTabs] = useState(localStorage.getItem('ManageDealsScreen.defaultTab') ? localStorage.getItem('ManageDealsScreen.defaultTab') : tabsFilter[0])

    const [dataFiltered, setDataFiltered] = useState([]);

    const [update, setUpdate] = useState(true);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const dealAllList = useSelector(state => state.dealAllList);
    const { error, loading, deals } = dealAllList;

    const dealDelete = useSelector(state => state.dealDelete);
    const { error: errorDelete, success: successDelete } = dealDelete;

    useEffect(() => {

        if (userInfo) {
            const keyword = {
                title: searchTitle,
                contact: searchContact,
                company: searchCompany,
                status: searchDealStatus,
                request: searchRequestStatus,
                staff: searchStaff,
                filterMy: searchMyDeals
            }

            dispatch(getAllDeals(keyword, pageNumber, pageSize, 'active'));
            localStorage.setItem('ManageDealsScreen.filter', JSON.stringify({
                title: searchTitle,
                company: searchCompany,
                contact: searchContact,
                dealStatus: searchDealStatus,
                requestStatus: searchRequestStatus,
                searchStaff: searchStaff,
                myDeals: searchMyDeals,
            }));
            setUpdate(false);

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
        searchStaff,
        pageNumber, 
        pageSize,
        update,
        searchMyDeals
    ]);

    useEffect(() => {

        if (deals) {

            const updateTime = new Date(Date.now());
            updateTime.setUTCDate(updateTime.getUTCDate() - updateFilter);

            const notUpdateTime = new Date(Date.now());
            notUpdateTime.setUTCDate(notUpdateTime.getUTCDate() - notUpdateFilter);

            const newDealTime = new Date(Date.now());
            newDealTime.setUTCDate(newDealTime.getUTCDate() - newDealFilter);

            const wonDealTime = new Date(Date.now());
            wonDealTime.setUTCDate(wonDealTime.getUTCDate() - wonDealFilter);


            const filteredData = [];

            for (let incr = 0; incr < tabsFilter.length; incr++) {
                let dealsFiltered = [];

                switch (tabsFilter[incr]) {
                    case tabsFilter[0]: // Deals waiting a staff
                        const needStaff = REQUEST_STATUS.filter(x => x.staff === true)
                        dealsFiltered = {
                            deals: deals.filter(deal => needStaff.map(x => x.name).includes(deal.staffingRequest.requestStatus)),
                            param: null,
                            setParam: null
                        };
                        break;
                    case tabsFilter[1]: // Update
                        dealsFiltered = {
                            deals: deals.filter(deal => new Date(deal.updatedAt) >= updateTime),
                            param: updateFilter,
                            setParam: setUpdateFilter
                        }
                        break;
                    case tabsFilter[2]: // Not Update
                        dealsFiltered = {
                            deals: deals.filter(deal => new Date(deal.updatedAt) <= notUpdateTime),
                            param: notUpdateFilter,
                            setParam: setNotUpdateFilter
                        }
                        break;
                    case tabsFilter[3]: // newDeal
                        dealsFiltered = {
                            deals: deals.filter(deal => new Date(deal.createdAt) >= newDealTime),
                            param: newDealFilter,
                            setParam: setNewDealFilter
                        }
                        break;
                    case tabsFilter[4]: // Won
                        dealsFiltered = {
                            deals: deals.filter(deal => new Date(deal.wonDate) >= wonDealTime),
                            param: wonDealFilter,
                            setParam: setWonDealFilter
                        }
                        break;
                    case tabsFilter[5]: // All >>> mettre une redirection
                        dealsFiltered = {
                            deals: deals,
                            param: null,
                            setParam: null
                        }
                        break;
                    default:
                        dealsFiltered = [];
                }
                filteredData.push({ filter: tabsFilter[incr], data: dealsFiltered, count: dealsFiltered.deals.length });
            }
            setDataFiltered(filteredData);
            //console.log('End calcultation', new Date(Date.now()).toISOString());
            //console.log('filteredData', filteredData);
        }
    }, [deals, tabsFilter, newDealFilter, notUpdateFilter, updateFilter, wonDealFilter]);

    useEffect(() => {

        if (successDelete) {
            const keyword = {
                title: searchTitle,
                mainPractice: userInfo.consultantProfil.practice,
                othersPractices: userInfo.consultantProfil.practice,
                contact: searchContact,
                company: searchCompany,
                status: searchDealStatus,
                request: searchRequestStatus,
                staff: searchStaff,
                filterMy: searchMyDeals
            }
            dispatch(getAllDeals(keyword, pageNumber, pageSize));
        }
        // eslint-disable-next-line
    }, [dispatch, successDelete]);

    return (
        <>
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}

            <DropDownTitleContainer
                title='Manage Deals'
                close={false}>
                <ListGroup.Item className='p-0'>
                    <Tabs 
                        //defaultActiveKey={defaultTabs} 
                        id="uncontrolled-tab-example" 
                        variant='tabs'
                        activeKey={defaultTabs}
                        onSelect={(k) => {
                            setDefaultTabs(k)
                            localStorage.setItem('ManageDealsScreen.defaultTab', k)
                        }}
                    >
                        {dataFiltered.length > 0 && dataFiltered.map((data, val) => (
                            <Tab
                                key={val}
                                className='mx-3'
                                eventKey={`${data.filter}`}
                                
                                title={
                                    <Row className='align-text-middle'>
                                        <span className='ml-3 align-middle'>{data.filter.split(/[0-9]+/i)[0]}</span>
                                        {changePeriod ? (
                                            <span>{data.data.param && (
                                                <InputGroup>
                                                    <FormControl
                                                        as='select'
                                                        value={data.data.param}
                                                        onChange={(e) => data.data.setParam(e.target.value)}
                                                    >
                                                        {[...new Array(30).keys()].map(x => (
                                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                        ))}
                                                    </FormControl>
                                                </InputGroup>
                                            )}
                                            </span>) : data.data.param}
                                        <span>{(data.filter.split(/[0-9]+/i)[1] && data.filter.split(/[0-9]+/i)[1])}</span>
                                        <span className='mr-3'>{' > ' + data.count}</span>
                                    </Row>
                                }
                            >
                                <Row className='mt-3'>
                                    <Col>
                                        <Button
                                            variant='ligth'
                                            onClick={() => setChangePeriod(!changePeriod)}
                                        ><i className="fas fa-edit"></i>  Configure tabs</Button>

                                        <Button
                                            variant='ligth'
                                            onClick={() => history.push('/admin/deals/history')}
                                        ><i className="fas fa-history"></i>  History</Button>

                                        <Button
                                            variant='ligth'
                                            onClick={() => {
                                                setSearchMyDeals(!searchMyDeals)
                                                setUpdate(true)
                                            }}
                                        >{searchMyDeals ? (
                                            <div><i className="fas fa-backspace"></i>  Get all deals</div>
                                        ) : (
                                                <div><i className="fas fa-filter"></i>  Filter my deals</div>
                                            )}
                                        </Button>
                                    </Col>
                                </Row>

                                <DealList
                                    history={history}
                                    data={data.data}
                                    filter={{
                                        searchTitle: searchTitle,
                                        setSearchTitle: setSearchTitle,
                                        searchCompany: searchCompany, 
                                        setSearchCompany: setSearchCompany,
                                        searchContact: searchContact,
                                        setSearchContact: setSearchContact,
                                        searchDealStatus: searchDealStatus,
                                        setSearchDealStatus: setSearchDealStatus,
                                        searchRequestStatus: searchRequestStatus,
                                        setSearchRequestStatus: setSearchRequestStatus,
                                        searchStaff: searchStaff,
                                        setSearchStaff: setSearchStaff
                                    }}
                                />
                            </Tab>
                        ))}
                    </Tabs>
                </ListGroup.Item>
            </DropDownTitleContainer>
        </>
    )
}

/* const DealList = ({ history, data = [] }) => {

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
} */

export default ManageDealsScreen

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import DealList from '../components/DealList';
import DisplayChildren from '../components/DisplayChildren';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ListGroup from 'react-bootstrap/ListGroup';
import { dealsImportInMass, getAllDeals } from '../actions/dealActions';
import { FormControl, InputGroup } from 'react-bootstrap';
import { DEAL_STATUS, REQUEST_STATUS } from '../constants/dealConstants';
import ImportExcelFile from '../components/ImportExcelFile';
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

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

    const [exportExcel, setExportExcel] = useState('');
    const [importData, setImportData] = useState([]);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const dealAllList = useSelector(state => state.dealAllList);
    const { error, loading, deals } = dealAllList;

    const dealDelete = useSelector(state => state.dealDelete);
    const { error: errorDelete, success: successDelete } = dealDelete;

    const dealsImportMass = useSelector(state  => state.dealsImportMass);
    const {loading: loadingImportMass, success: successImportData} = dealsImportMass;

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
        searchMyDeals,
        successImportData
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
                        const needStaff = REQUEST_STATUS.filter(x => x.staff === true);
                        const toDisplay = DEAL_STATUS.filter(x => x.display === 'onTrack' || x.display === 'win');
                        //console.log('toDisplay', toDisplay)
                        dealsFiltered = {
                            deals: deals.filter(deal => (needStaff.map(x => x.name).includes(deal.staffingRequest.requestStatus) && toDisplay.map(x => x.name).includes(deal.status))),
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
        }
    }, [deals, tabsFilter, newDealFilter, notUpdateFilter, updateFilter, wonDealFilter]);

    useEffect(() => {
        if (deals) {
            const exportExcelData = deals.map((deal) => ({
                'TITLE': deal.title,
                'COMPANY': deal.company,
                'PRACTICE': deal.mainPractice,
                'LEADER': deal.contacts && deal.contacts.primary && deal.contacts.primary.name,
                'CO-LEADER': deal.contacts && deal.contacts.secondary && deal.contacts.secondary.map(x => x.name).join(''),
                'OTHERS_PRACTICES': deal.othersPractices && deal.othersPractices.join(','),
                'STATUS': deal.status,
                'DESCRIPTION': deal.description,
                'START': deal.startDate.substring(0,10),
                'DURATION': deal.duration,
                'REQUEST_STATUS': deal.staffingRequest.requestStatus,
                'REQUEST_DETAILS': deal.staffingRequest.instructions,
                'DECISION': deal.staffingDecision.staff && deal.staffingDecision.staff.map(x => `${x.responsability}: ${x.idConsultant.name} (${x.priority})}`).join('\n'),
            }));
            setExportExcel(exportExcelData);
        }
    }, [deals, setExportExcel]);

    useEffect(() => {
        if(importData.length > 0) {
            //console.log(importData);
            dispatch(dealsImportInMass(importData));
        }
    },[dispatch, importData]);

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
        <div>
            <Meta />

            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}

            <DropDownTitleContainer
                title='Manage Deals'
                close={false}>
                
                <Row className='mt-3'>
                    <Col xs={0} md={7}></Col>
                    <Col xs={6} md={3}>
                        <DisplayChildren access='uploadDeals'>
                            {loadingImportMass ? (
                                <Loader />
                            ) : (
                                    <ImportExcelFile setImportData={setImportData} />
                                )}
                        </DisplayChildren>
                    </Col>

                    <Col ws={6} md={2}>
                        {exportExcel && (
                            <ExcelFile element={<Button variant='primary'><i className="fas fa-download"></i>  Download</Button>}>
                                <ExcelSheet data={exportExcel} name="dealsSheet">
                                    <ExcelColumn label="TITLE" value="TITLE" />
                                    <ExcelColumn label="COMPANY" value="COMPANY" />
                                    <ExcelColumn label="PRACTICE" value="PRACTICE" />
                                    <ExcelColumn label="LEADER" value="LEADER" />
                                    <ExcelColumn label="CO-LEADER" value="CO-LEADER" />
                                    <ExcelColumn label="OTHERS_PRACTICES" value="OTHERS_PRACTICES" />
                                    <ExcelColumn label="STATUS" value="STATUS" />
                                    <ExcelColumn label="DESCRIPTION" value="DESCRIPTION" />
                                    <ExcelColumn label="START" value="START" />
                                    <ExcelColumn label="DURATION" value="DURATION" />
                                    <ExcelColumn label="REQUEST_STATUS" value="REQUEST_STATUS" />
                                    <ExcelColumn label="REQUEST_DETAILS" value="REQUEST_DETAILS" />
                                    <ExcelColumn label="DECISION" value="DECISION" />
                                </ExcelSheet>
                            </ExcelFile>
                        )}
                    </Col>
                </Row>

                <ListGroup.Item className='p-0 mt-3'>
                    <Tabs 
                        id="uncontrolled-tab-example" 
                        variant='pills'
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
                                    <Col className='text-left'>
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

                                        <Button 
                                            variant='ligth'
                                            onClick={() => window.confirm('Soon available')}
                                        ><i className="fas fa-project-diagram"></i>  Business flows
                                        </Button>

                                        <DisplayChildren access='sendStaffingDecision'>
                                            <Button
                                                variant='ligth'
                                                className='text-black align-right'
                                                onClick={() => history.push('/admin/send')}
                                            ><i className="fas fa-envelope"></i>  Send staffing decisions</Button>
                                        </DisplayChildren>
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
        </div>
    )
}

export default ManageDealsScreen

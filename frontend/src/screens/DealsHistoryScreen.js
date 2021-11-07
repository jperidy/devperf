import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import DealList from '../components/DealList';
import Meta from '../components/Meta';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ListGroup from 'react-bootstrap/ListGroup';
import { getAllDeals } from '../actions/dealActions';
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


const DealsHistoryScreen = ({history}) => {

    const dispatch = useDispatch();

    // pagination configuration
    const [pageSize] = useState('');
    const [pageNumber] = useState('');

    // search configuration
    const [searchTitle, setSearchTitle] = useState(localStorage.getItem('DealsHistoryScreen.filter') && JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).title ? JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).title : '' );
    const [searchCompany, setSearchCompany] = useState(localStorage.getItem('DealsHistoryScreen.filter') && JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).company ? JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).company : '');
    const [searchContact, setSearchContact] = useState(localStorage.getItem('DealsHistoryScreen.filter') && JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).contact ? JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).contact : '');
    const [searchDealStatus, setSearchDealStatus] = useState(localStorage.getItem('DealsHistoryScreen.filter') && JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).dealStatus ? JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).dealStatus : '');
    const [searchRequestStatus, setSearchRequestStatus] = useState(localStorage.getItem('DealsHistoryScreen.filter') && JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).requestStatus ? JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).requestStatus : '');
    const [searchStaff, setSearchStaff] = useState(localStorage.getItem('DealsHistoryScreen.filter') && JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).searchStaff ? JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).searchStaff : '');
    //const [searchMyDeals, setSearchMyDeals] = useState(localStorage.getItem('DealsHistoryScreen.filter') ? JSON.parse(localStorage.getItem('DealsHistoryScreen.filter')).myDeals : '');

    const [tabsFilter] = useState([...new Array(5).keys()].map(x => new Date(Date.now()).getFullYear() - x));

    const [defaultTabs, setDefaultTabs] = useState(localStorage.getItem('DealsHistoryScreen.defaultTab') ? localStorage.getItem('DealsHistoryScreen.defaultTab') : tabsFilter[0])

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
                mainPractice: userInfo.consultantProfil.practice,
                othersPractices: userInfo.consultantProfil.practice,
                contact: searchContact,
                company: searchCompany,
                status: searchDealStatus,
                request: searchRequestStatus,
                staff: searchStaff,
                filterMy: false
            }

            dispatch(getAllDeals(keyword, pageNumber, pageSize, 'all'));
            localStorage.setItem('DealsHistoryScreen.filter', JSON.stringify({
                title: searchTitle,
                company: searchCompany,
                contact: searchContact,
                dealStatus: searchDealStatus,
                requestStatus: searchRequestStatus,
                searchStaff: searchStaff,
                //myDeals: searchMyDeals,
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
        //searchMyDeals,
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
                request: searchRequestStatus,
                staff: searchStaff,
                filterMy:false
            }
            dispatch(getAllDeals(keyword, pageNumber, pageSize));
        }
        // eslint-disable-next-line
    }, [dispatch, successDelete])

    return (
        <div>
            <Meta />

            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}

            <DropDownTitleContainer
                title='Manage Deals'
                close={false}>
                <ListGroup.Item className='p-0 mt-3'>
                    <Tabs 
                        //defaultActiveKey={tabsFilter[0]} 
                        id="uncontrolled-tab-example" 
                        variant='pills'
                        activeKey={defaultTabs}
                        onSelect={(k) => {
                            setDefaultTabs(k)
                            localStorage.setItem('DealsHistoryScreen.defaultTab', k)
                        }}
                    >
                        {dataFiltered.length > 0 && dataFiltered.map((data, val) => (
                            <Tab
                                key={val}
                                className='mx-3'
                                eventKey={`${data.filter}`}
                                title={data.filter + ' (' + data.data.deals.length + ')'}
                            >
                                {data.data.deals && (
                                    <ExcelFile element={<Button variant='ligth' className='mt-3'><i className="fas fa-download"></i>  Download</Button>}>
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

export default DealsHistoryScreen

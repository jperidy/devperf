import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { createDeal, getDealToEdit, updateDeal } from '../actions/dealActions';
import { getAllLeaders, getAllPractice } from '../actions/consultantActions';
import { DEAL_CREATE_RESET, DEAL_PROBABILITY, DEAL_STATUS, DEAL_UPDATE_RESET, TYPE_BUSINESS } from '../constants/dealConstants';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import ListGroup from 'react-bootstrap/ListGroup';
import ConsoDispo from '../components/ConsoDispo';
import ViewStaffs from '../components/ViewStaffs';
import SearchInput from '../components/SearchInput';
import SelectCompany from '../components/SelectCompany';
import { REQUEST_STATUS } from '../constants/dealConstants';
import StaffAConsultant from '../components/StaffAConsultant';
import DisplayChildren from '../components/DisplayChildren';
import SelectInput from '../components/SelectInput';

const StaffingEditScreen = ({ match, history }) => {

    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const dealCreate = useSelector(state => state.dealCreate);
    const { loading, error, success, createId } = dealCreate;

    const dealUpdate = useSelector(state => state.dealUpdate);
    const { loading: loadingUpdate, error: errorUpdate } = dealUpdate;

    const dealEdit = useSelector(state => state.dealEdit);
    const { success: successEdit, deal: dealToEdit } = dealEdit;

    const consultantPracticeList = useSelector(state => state.consultantPracticeList);
    const { practiceList } = consultantPracticeList;

    const consultantsAllLeaders = useSelector(state => state.consultantsAllLeaders);
    const { leaderslist } = consultantsAllLeaders;

    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [client, setClient] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [probability, setProbability] = useState('');
    const [description, setDescription] = useState('');
    const [proposalDate, setProposalDate] = useState('');
    const [presentationDate, setPresentationDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [mainPractice, setMainPractice] = useState('');
    const [othersPractices, setOthersPractices] = useState([]);
    const [location, setLocation] = useState('');
    const [srInstruction, setSrInstruction] = useState('');
    const [srStatus, setSrStatus] = useState('');
    const [srRessources, setSrRessources] = useState([]);
    const [comments, setComments] = useState([]);
    const [duration, setDuration] = useState('');
    const [othersContacts, setOthersContacts] = useState('');
    
    const [newComment, setNewComment] = useState('');
    
    const [sdInstructions] = useState('');
    const [sdStatus, setSdStatus] = useState('');
    const [sdStaff, setSdStaff] = useState([]);
    
    const [wonDate, setWonDate] = useState('');
    
    
    const [modalWindowShow, setModalWindowShow] = useState(false);
    const [sdConsultant, setSdConsultant] = useState('');
    const [loadingSdConsultantData, setLoadingSdConsultantData] = useState({})
    
    
    const [editRequest, setEditRequest] = useState(match.params.id ? false : true);
    
    const [dealChange, setDealChange] = useState(false);
    
    const [searchLeader, setSearchLeader] = useState('');
    const [leader, setLeader] = useState([]);
    
    const [searchCoLeader, setSearchCoLeader] = useState('');
    const [coLeaders, setCoLeaders] = useState([]);
    

    const [companyMessage, setCompanyMessage] = useState(null);

    //ConsoDispo
    const analyseTime = 3;
    let startDefault = new Date(Date.now());
    startDefault.setUTCDate(1);
    startDefault.setUTCMonth(startDefault.getUTCMonth());
    startDefault = startDefault.toISOString().substring(0, 10);

    let endDefault = new Date(Date.now());
    endDefault.setUTCDate(1);
    endDefault.setUTCMonth(endDefault.getUTCMonth() + analyseTime - 1);
    endDefault = endDefault.toISOString().substring(0, 10);

    const [start] = useState(startDefault);
    const [end] = useState(endDefault);

    useEffect(() => {
        if (!userInfo) {
            history.push('/login');
        }
    }, [history, userInfo]);

    useEffect(() => {
        if (!practiceList) {
            dispatch(getAllPractice());
        }
    }, [dispatch, practiceList]);

    useEffect(() => {
        if (match.params.id) {
            dispatch(getDealToEdit(match.params.id));
        }
    }, [dispatch, match])


    useEffect(() => { 
            dispatch(getAllLeaders(searchLeader));
        
    },[dispatch, searchLeader])

    useEffect(() => {

        dispatch(getAllLeaders(searchCoLeader));

    }, [dispatch, searchCoLeader])


    useEffect(() => {
        if (match.params.id && successEdit) {
            setTitle(dealToEdit.title);
            setCompany(dealToEdit.company);
            setClient(dealToEdit.client);
            setStatus(dealToEdit.status);
            setType(dealToEdit.type);
            setProbability(dealToEdit.probability);
            setDescription(dealToEdit.description);
            setProposalDate(dealToEdit.proposalDate ? dealToEdit.proposalDate.substring(0, 10) : "");
            setPresentationDate(dealToEdit.presentationDate ? dealToEdit.presentationDate.substring(0, 10) : "");
            setStartDate(dealToEdit.startDate ? dealToEdit.startDate.substring(0, 10) : "");
            setMainPractice(dealToEdit.mainPractice);
            setOthersPractices(dealToEdit.othersPractices ? dealToEdit.othersPractices : []);
            setLocation(dealToEdit.location);
            setSrInstruction(dealToEdit.staffingRequest.instructions);
            setSrStatus(dealToEdit.staffingRequest.requestStatus);
            setSrRessources(dealToEdit.staffingRequest.ressources ? dealToEdit.staffingRequest.ressources : []);
            setSdStatus(dealToEdit.staffingDecision.staffingStatus ? dealToEdit.staffingDecision.staffingStatus : '');
            setSdStatus(dealToEdit.staffingDecision.instructions ? dealToEdit.staffingDecision.instructions : '');
            setSdStaff(dealToEdit.staffingDecision.staff ? dealToEdit.staffingDecision.staff : []);
            setLeader(dealToEdit.contacts.primary ? 
                [{id: dealToEdit.contacts.primary._id, value: dealToEdit.contacts.primary.name}] : ['']);
            setCoLeaders(dealToEdit.contacts.secondary ?
                dealToEdit.contacts.secondary.map( coLeader => ({id: coLeader._id, value: coLeader.name})) : []);
            setComments(dealToEdit.comments ? dealToEdit.comments : []);
            setDuration(dealToEdit.duration ? dealToEdit.duration : '');
            setOthersContacts(dealToEdit.othersContacts ? dealToEdit.othersContacts : '');
        }
    }, [successEdit, dealToEdit, userInfo, match])

    useEffect(() => {
        if (success) {
            history.push(`/staffing/${createId}`);
            dispatch({ type: DEAL_CREATE_RESET });
        }
    }, [dispatch, history, success, createId]);

    useEffect(() => {
        if (match.params.id && dealChange) {
            if (!company) {
                setCompanyMessage('Please select a company');
                setEditRequest(true);
                return
            } else {
                setCompanyMessage('')
            }
            const deal = {
                company: company,
                client: client,
                title: title,
                type: type,
                status: status,
                contacts: {
                    primary: leader.length ? leader[0].id : null,
                    secondary: coLeaders.length ? coLeaders.map( x => x.id) : [],
                },
                probability: probability,
                description: description,
                proposalDate: proposalDate,
                presentationDate: presentationDate,
                wonDate: wonDate,
                startDate: startDate,
                duration: duration,
                mainPractice: mainPractice,
                othersPractices: othersPractices,
                location: location,
                staffingRequest: {
                    instructions: srInstruction,
                    requestStatus: srStatus,
                    ressources: srRessources
                },
                staffingDecision: {
                    instructions: sdInstructions,
                    staffingStatus: sdStatus,
                    staff: sdStaff.map(staff => ({
                        responsability: staff.responsability,
                        idConsultant: staff.idConsultant._id,
                        priority: staff.priority,
                        information: staff.information
                    }))
                },
                comments: comments,
                othersContacts: othersContacts
            }
            dispatch(updateDeal(match.params.id, deal));
            setDealChange(false);
            setNewComment('');
        }

    }, [match, dispatch, userInfo, dealChange, company, type, client, title, status, probability, description, proposalDate, presentationDate,
        wonDate, startDate, duration, mainPractice, othersPractices, location, srInstruction, srStatus, srRessources, sdInstructions,
        sdStatus, sdStaff, leader, coLeaders, comments, othersContacts
    ]);

    const updateOthersPractices = () => {
        const selectedList = [];
        const selectBox = document.getElementById('others-practices');
        for (let i = 0; i < selectBox.options.length; i++) {
            if (selectBox.options[i].selected) {
                selectedList.push(selectBox.options[i].value);
            }
        }
        setOthersPractices(selectedList);
    }

    const removeStaffHandler = (id) => {
        let tampon = new Array(...sdStaff);
        tampon = tampon.filter(consultant => consultant.idConsultant._id !== id);
        setSdStaff(tampon);
        setDealChange(true);
    }

    const addStaffHandler = (consultant, responsability, priority, information) => {
        
        let tampon = new Array(...sdStaff);

        // Rule if consultant already added in staff
        if(sdStaff.map(x => x.idConsultant._id).includes(consultant._id)) {
            tampon = tampon.filter(x => x.idConsultant._id !== consultant._id);            
        }

        tampon.push({
            idConsultant: {
                _id: consultant._id,
                name: consultant.name,
            },
            responsability: responsability,
            priority: priority,
            information: information
        });

        //tampon.sort((a,b) => a.priority - b.priority)

        setSdStaff(tampon);
        setDealChange(true);
    }

    const prepareDeal = () => {
        return {
            company: company,
            client: client,
            title: title,
            contacts: {
                primary: leader.length ? leader[0].id : null,
                secondary: coLeaders.length ? coLeaders.map( x => x.id) : [],
            },
            type: type,
            status: status,
            probability: probability,
            description: description,
            proposalDate: proposalDate,
            presentationDate: presentationDate,
            wonDate: wonDate,
            startDate: startDate,
            duration: duration,
            mainPractice: mainPractice,
            othersPractices: othersPractices,
            location: location,
            staffingRequest: {
                instructions: srInstruction,
                requestStatus: srStatus,
                ressources: srRessources
            },
            staffingDecision: {
                instructions: sdInstructions,
                staffingStatus: sdStatus,
                staff: sdStaff.map(staff => ({
                    responsability: staff.responsability,
                    idConsultant: staff.idConsultant._id,
                    priority: staff.priority,
                    information: staff.information
                }))
            },
            comments: comments,
            othersContacts: othersContacts
        }
    }

    const deleteCompanyHandler = () => {
        setCompany('');
        setDealChange(true);
    }

    const deleteLeaderHandler = () => {
        //setLeader('');
        setLeader([]);
        setDealChange(true);
    }

    const deleteCoLeaderHandler = (coLeader) => {
        let newList = coLeaders.slice();
        newList = newList.filter( x => x.id !== coLeader.id)
        setCoLeaders(newList);
        setDealChange(true);
    }

    const updateCoLeadersHandler = (value) => {
        if(value) {
            const newList = coLeaders.slice();
            if (!newList.map( x => x.id).includes(value.id)) {
                newList.push(value);
                setCoLeaders(newList)
            }
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (!company) {
            setCompanyMessage('Please select a company');
            return;
        } else {
            setCompanyMessage(null)
        }
        const deal = prepareDeal();

        if (match.params.id) {
            dispatch(updateDeal(match.params.id, deal));
        } else {
            dispatch(createDeal(deal));
        }
    };

    const addCommentHandler = () => {
        const newComments = comments.slice();
        newComments.push({
            message: newComment,
            sender:{
                _id: userInfo._id,
                name: userInfo.name
            },
            date: new Date(Date.now()).toISOString()
        });
        newComments.sort((a,b) => (Date.parse(b.date) - Date.parse(a.date)));
        setComments(newComments);
        setDealChange(true);
    };

    const deleteCommentHandler = (value) => {
        let newComments = comments.slice();
        newComments = newComments.filter(x => x.date !== value);
        setComments(newComments);
        setDealChange(true);
    };

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
        <>
            <Meta />
            {modalWindowShow && (
                <StaffAConsultant
                    show={modalWindowShow}
                    onHide={() => setModalWindowShow(false)}
                    consultant={sdConsultant}
                    loadingData={loadingSdConsultantData}
                    mode='staffing'
                    addStaffHandler={addStaffHandler}
                    history={history}
                />
            )}

            <h1>Staffing request</h1>
            <Form onSubmit={submitHandler}>
                <Row className='mt-3'>
                    <Col xs={6} md={2}>
                        {match.params.id && (
                            <Button
                                type='button'
                                variant='primary'
                                onClick={() => {
                                    history.go(-1);
                                    dispatch({type: DEAL_UPDATE_RESET})
                                }}
                                block
                            >Go Back</Button>
                        )}
                    </Col>
                    <Col xs={0} md={8}></Col>
                    <Col xs={6} md={2}>
                        {match.params.id && loadingUpdate && <Loader />}
                    </Col>
                </Row>

                {error && (<Row><Col><Message variant='danger'>{error}</Message></Col></Row>)}

                {match.params.id && (
                    <Row className='mt-3 align-items-center'>
                        <Col md={1}>
                            <Button
                                onClick={() => {
                                    setEditRequest(!editRequest);
                                    editRequest && setDealChange(true);
                                }}
                                variant='light'
                            >{editRequest ? (<i className="far fa-check-circle"></i>) : (<i className="far fa-edit"></i>)}
                            </Button>
                        </Col>
                        <Col className='text-left align-middle'>
                            {editRequest && (<p> Please click to update</p>)}
                            {errorUpdate && (<Message variant='danger'>{errorUpdate}</Message>)}
                        </Col>
                    </Row>
                )}

                <Row className='mt-2'>

                    <Col xs={12} md={4}>

                        <ListGroup.Item>
                            <Form.Group controlId='title' className='mb-0'>
                                <Form.Label as='h5'>Title {editRequest && '*'}</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        type='text'
                                        placeholder='Staffing request object'
                                        value={title ? title : ''}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    ></Form.Control>
                                ) : (
                                        <Form.Control
                                            type='text'
                                            plaintext
                                            value={title ? title : ''}
                                            readOnly
                                        ></Form.Control>
                                    )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <SelectCompany 
                                setCompany={setCompany}
                                editRequest={editRequest}
                            />
                            {companyMessage && <Message variant='danger'>{companyMessage}</Message>}
                            {company && (
                                <ListGroup variant='flush'>
                                    <ListGroup.Item
                                        variant='ligth'
                                    >{company}
                                        {editRequest && (
                                            <Button
                                                variant='Dark'
                                                onClick={() => deleteCompanyHandler()}
                                            ><i className="fas fa-trash-alt"></i></Button>
                                        )}
                                    </ListGroup.Item>
                                </ListGroup>
                            )}

                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Form.Group controlId='client' className='mb-0'>
                                <Form.Label as='h5'>Client</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        type='text'
                                        placeholder='Client name'
                                        value={client ? client : ''}
                                        onChange={(e) => setClient(e.target.value)}
                                    ></Form.Control>
                                ) : (
                                        <Form.Control
                                            type='text'
                                            plaintext
                                            readOnly
                                            value={client ? client : ''}
                                        ></Form.Control>
                                    )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Form.Group controlId='type' className='mb-0'>
                                <Form.Label as='h5'>Type of business {editRequest && '*'}</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        as='select'
                                        value={type ? type : ''}
                                        onChange={(e) => { setType(e.target.value) }}
                                        required
                                    >
                                        <option value=''>--Select--</option>
                                        {TYPE_BUSINESS.map(type => (
                                            <option
                                                key={type.name}
                                                value={type.name}
                                            >{type.name}</option>
                                        ))}
                                    </Form.Control>
                                ) : (
                                        <Form.Control
                                            type='text'
                                            plaintext
                                            value={type ? type : ''}
                                            readOnly
                                        ></Form.Control>
                                    )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Form.Group controlId='status' className='mb-0'>
                                <Form.Label as='h5'>Status {editRequest && '*'}</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        as='select'
                                        value={status ? status : ''}
                                        onChange={(e) => {
                                            if (e.target.value === 'Won') {
                                                setWonDate(new Date(Date.now()));
                                            }
                                            else {
                                                setWonDate('');
                                            }
                                            setStatus(e.target.value);
                                        }}
                                        required
                                    >
                                        <option value=''>--Select--</option>
                                        {DEAL_STATUS.map( status => (
                                            <option
                                                key={status.name}
                                                value={status.name}
                                            >{status.name}</option>
                                        ))}
                                    </Form.Control>
                                ) : (
                                        <Form.Control
                                            type='text'
                                            plaintext
                                            readOnly
                                            value={status ? status : ''}
                                        ></Form.Control>
                                    )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Form.Group controlId='probability' className='mb-0'>
                                <Form.Label as='h5'>Probability {editRequest && '*'}</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        as='select'
                                        value={probability ? probability : ''}
                                        onChange={(e) => setProbability(e.target.value)}
                                        required
                                    >
                                        <option value=''>--Select--</option>
                                        {DEAL_PROBABILITY.map( prob => (
                                            <option 
                                                key={prob.name}
                                                value={prob.name}
                                            >{prob.name} %</option>
                                        ))}
                                    </Form.Control>
                                ) : (
                                        <Form.Control
                                            type='text'
                                            value={`${probability} %`}
                                            plaintext
                                            readOnly
                                        ></Form.Control>
                                    )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Form.Group controlId='location' className='mb-0'>
                                <Form.Label as='h5'>Location</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        type='text'
                                        placeholder='Location'
                                        value={location ? location : ''}
                                        onChange={(e) => setLocation(e.target.value)}
                                    ></Form.Control>
                                ) : (
                                        <Form.Control
                                            type='text'
                                            plaintext
                                            readOnly
                                            value={location ? location : ''}
                                        ></Form.Control>
                                    )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Form.Group controlId='main-practice' className='mb-0'>
                                <Form.Label as='h5'>Main Practice {editRequest && '*'}</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        as='select'
                                        value={mainPractice ? mainPractice : ''}
                                        onChange={(e) => setMainPractice(e.target.value)}
                                        required
                                    >
                                        <option value=''>--Select--</option>
                                        {practiceList && practiceList.map((practice, val) => (
                                            <option
                                                value={practice}
                                                key={val}
                                            >{practice}</option>
                                        ))}
                                    </Form.Control>
                                ) : (
                                        <Form.Control
                                            type='text'
                                            plaintext
                                            readOnly
                                            value={mainPractice ? mainPractice : ''}
                                        ></Form.Control>
                                    )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Form.Group controlId='others-practices' className='mb-0'>
                                <Form.Label as='h5'>Others Practices</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        as='select'
                                        multiple
                                        value={othersPractices ? othersPractices : []}
                                        onChange={(e) => updateOthersPractices()}
                                    >
                                        {practiceList && practiceList.map((practice, val) => (
                                            (practice !== mainPractice) && (
                                                <option
                                                    value={practice}
                                                    key={val}
                                                >{practice}</option>
                                            )
                                        ))}
                                    </Form.Control>
                                ) : (
                                        <Form.Control
                                            type='text'
                                            value={othersPractices ? othersPractices.join(', ') : ''}
                                            plaintext
                                            readOnly
                                        ></Form.Control>
                                    )}
                            </Form.Group>
                        </ListGroup.Item>

                    </Col>

                    <Col xs={12} md={8}>

                        <ListGroup.Item>
                            <Row className='align-items-start'>
                                <Col xs={12} md={4}>

                                    <Form.Group controlId='select-leader' className='mb-0'>
                                        <Form.Label as='h5'>Leader</Form.Label>
                                        <SelectInput
                                            options={leaderslist ? leaderslist.map(consultant => ({ value: consultant._id, label: consultant.name })) : []}
                                            value={leader.length ? { value: leader[0].id, label: leader[0].value } : {}}
                                            setValue={setLeader}
                                            multi={false}
                                            disabled={!editRequest}
                                        />
                                    </Form.Group>
                                    

                                    {/* <SearchInput
                                        title='Leader'
                                        searchValue={searchLeader ? searchLeader : ''}
                                        setSearchValue={setSearchLeader}
                                        possibilities={leaderslist && leaderslist.map(consultant => ({ id: consultant._id, value: consultant.name }))}
                                        updateResult={setLeader}
                                        editMode={editRequest}
                                        //style={{zIndex:'1000', position: 'relative'}}
                                    />
                                    {leader && (
                                        <ListGroup variant='flush'>
                                            <ListGroup.Item
                                                variant='ligth'
                                            >{leader.value}
                                                {editRequest && (
                                                    <Button 
                                                        variant='Dark'
                                                        onClick={() => deleteLeaderHandler()}
                                                    ><i className="fas fa-user-times"></i></Button>
                                                )}
                                            </ListGroup.Item>
                                        </ListGroup>
                                    )} */}
                                </Col>
                            
                                <Col xs={12} md={4}>
                                    
                                    <Form.Group controlId='others' className='mb-0'>
                                        <Form.Label as='h5'>Co-Leader(s)</Form.Label>
                                        <SelectInput
                                            options={leaderslist ? leaderslist.map(consultant => ({ value: consultant._id, label: consultant.name })) : []}
                                            value={coLeaders ? coLeaders.map(x => ({ value: x.id, label: x.value })) : []}
                                            setValue={setCoLeaders}
                                            multi={true}
                                            disabled={!editRequest}
                                        />
                                    </Form.Group>

                                    {/* <SearchInput
                                        title='Co-leader(s)'
                                        searchValue={searchCoLeader ? searchCoLeader : ''}
                                        setSearchValue={setSearchCoLeader}
                                        possibilities={leaderslist && leaderslist.map(consultant => ({ id: consultant._id, value: consultant.name }))}
                                        updateResult={updateCoLeadersHandler}
                                        editMode={editRequest}
                                    /> */}
                                    {/* <ListGroup variant='flush'>
                                        {coLeaders && coLeaders.map(coLeader => (
                                            <ListGroup.Item
                                                key={coLeader.id}
                                            >{coLeader.value}
                                                {editRequest && (
                                                    <Button 
                                                        variant='Dark'
                                                        onClick={() => deleteCoLeaderHandler(coLeader)}
                                                    ><i className="fas fa-user-times"></i></Button>
                                                )}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup> */}
                                </Col>

                                <Col xs={12} md={4}>
                                    <Form.Group controlId='others' className='mb-0'>
                                        <Form.Label as='h5'>Others contacts</Form.Label>
                                        {editRequest ? (
                                            <Form.Control
                                                type='text'
                                                placeholder='email1@mail.com;email2@mail.com'
                                                value={othersContacts ? othersContacts : ''}
                                                onChange={(e) => setOthersContacts(e.target.value)}
                                            ></Form.Control>
                                        ) : (
                                                <Form.Control
                                                    type='text'
                                                    value={othersContacts ? othersContacts : ''}
                                                    plaintext
                                                    readOnly
                                                ></Form.Control>
                                            )}
                                    </Form.Group>
                                </Col>

                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Form.Group controlId='description' className='mb-0'>
                                <Form.Label as='h5'>Description {editRequest && '*'}</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        as='textarea'
                                        rows={3}
                                        placeholder='Deal description'
                                        value={description ? description : ''}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    ></Form.Control>
                                ) : (
                                        <Form.Control
                                            type='text'
                                            value={description ? description : ''}
                                            plaintext
                                            readOnly
                                        ></Form.Control>
                                    )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h5>Sheduling</h5>
                            <Row className='align-items-end'>
                                <Col>
                                    <Form.Group controlId='proposal-date' className='mb-0'>
                                        <Form.Label>Proposal</Form.Label>
                                        {editRequest ? (
                                            <Form.Control
                                                type='date'
                                                placeholder='Deal date'
                                                value={proposalDate ? proposalDate : ''}
                                                onChange={(e) => setProposalDate(e.target.value)}
                                            ></Form.Control>
                                        ) : (
                                                <Form.Control
                                                    type='date'
                                                    value={proposalDate ? proposalDate : ''}
                                                    plaintext
                                                    readOnly
                                                ></Form.Control>
                                            )}
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group controlId='presentation-date' className='mb-0'>
                                        <Form.Label>Presentation</Form.Label>
                                        {editRequest ? (
                                            <Form.Control
                                                type='date'
                                                placeholder='Presentation date'
                                                value={presentationDate ? presentationDate : ''}
                                                onChange={(e) => setPresentationDate(e.target.value)}
                                            ></Form.Control>
                                        ) : (
                                                <Form.Control
                                                    type='date'
                                                    value={presentationDate ? presentationDate : ''}
                                                    plaintext
                                                    readOnly
                                                ></Form.Control>
                                            )}
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group controlId='start-date' className='mb-0'>
                                        <Form.Label>Start {editRequest && '*'}</Form.Label>
                                        {editRequest ? (
                                            <Form.Control
                                                type='date'
                                                placeholder='Start date'
                                                value={startDate ? startDate : ''}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                required
                                            ></Form.Control>
                                        ) : (
                                                <Form.Control
                                                    type='date'
                                                    value={startDate ? startDate : ''}
                                                    plaintext
                                                    readOnly
                                                ></Form.Control>
                                            )}
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group controlId='duration' className='mb-0'>
                                        <Form.Label>Duration (month) {editRequest && '*'}</Form.Label>
                                        {editRequest ? (
                                            <Form.Control
                                                type='number'
                                                placeholder='Duration'
                                                min={0}
                                                step={0.5}
                                                value={duration ? duration : 0}
                                                onChange={(e) => setDuration(e.target.value)}
                                                required
                                            ></Form.Control>
                                        ) : (
                                                <Form.Control
                                                    type='number'
                                                    value={duration ? duration : 0}
                                                    plaintext
                                                    readOnly
                                                ></Form.Control>
                                            )}
                                    </Form.Group>
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col xs={12} md={8}>
                                    <Form.Group controlId='sr-instruction' className='mb-0'>
                                        <Form.Label as='h5'>Staffing instruction {editRequest && '*'}</Form.Label>
                                        {editRequest ? (
                                            <Form.Control
                                                as='textarea'
                                                rows={3}
                                                placeholder='Staffing instruction'
                                                value={srInstruction ? srInstruction : ''}
                                                onChange={(e) => setSrInstruction(e.target.value)}
                                                required
                                            ></Form.Control>
                                        ) : (
                                                <Form.Control
                                                    type='text'
                                                    value={srInstruction ? srInstruction : ''}
                                                    plaintext
                                                    readOnly
                                                ></Form.Control>
                                            )}
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={4}>
                                    <Form.Group controlId='sr-status' className='mb-0'>
                                        <Form.Label as='h5'>Status {editRequest && '*'}</Form.Label>
                                        <Form.Control
                                            as='select'
                                            value={srStatus ? srStatus : ''}
                                            onChange={(e) => {
                                                setSrStatus(e.target.value)
                                                setDealChange(true);
                                            }}
                                            required
                                        >
                                            <option value=''>--Select--</option>
                                            {REQUEST_STATUS.map(({name}) => (
                                                <option
                                                    key={name}
                                                    value={name}
                                                >{name}</option>
                                            ))}

                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        {match.params.id && (
                            <ListGroup.Item>
                                <h5>Staffing decision</h5>
                                {sdStaff && [...new Set(sdStaff.map(x => x.priority))].sort().map(priority => (
                                    <ListGroup.Item key={priority}>
                                        <Row key={priority}>
                                            <Col sm={1}>
                                                <Row className='my-1'><Col>{priority}</Col></Row>
                                            </Col>
                                            <Col sm={11}>
                                                {sdStaff.filter(x => x.priority === priority).map(staff => (
                                                    <Row key={staff.idConsultant._id} className='my-1'>
                                                        <Col sm={10}>
                                                            <OverlayTrigger
                                                                placement="top"
                                                                trigger='click'
                                                                overlay={
                                                                    <Popover 
                                                                        id='popover-others-staffs' 
                                                                        style={{ 'maxWidth': '40%' }}
                                                                    >
                                                                        <Popover.Title id="contained-modal-title-vcenter">
                                                                            Others staffs
                                                                        </Popover.Title>

                                                                        <Popover.Content>
                                                                            <ViewStaffs
                                                                                history={history}
                                                                                consultantId={staff.idConsultant._id}
                                                                                onNavigate={() => ('')}
                                                                                displayedDeal={match.params.id}
                                                                            />
                                                                        </Popover.Content>
                                                                    </Popover>
                                                                }
                                                            >
                                                                <div><strong>{`${staff.responsability}: `}</strong>{`${formatName(staff.idConsultant.name)}`}<i>{` (${staff.information})`}</i></div>
                                                            </OverlayTrigger>
                                                        </Col>
                                                        <Col sm={2} className='px-0'>
                                                            <DisplayChildren access='editStaff'>
                                                                <Button
                                                                    onClick={() => {
                                                                        setSdConsultant(staff.idConsultant)
                                                                        setLoadingSdConsultantData({
                                                                            information: staff.information,
                                                                            priority: staff.priority,
                                                                            responsability: staff.responsability
                                                                        })
                                                                        setModalWindowShow(true)
                                                                    }}
                                                                    variant='secondary'
                                                                    className='text-center mx-1'
                                                                    size='sm'
                                                                ><i className="fas fa-edit"></i></Button>
                                                            </DisplayChildren>
                                                            <DisplayChildren access='editStaff'>
                                                                <Button
                                                                    onClick={() => removeStaffHandler(staff.idConsultant._id)}
                                                                    variant='danger'
                                                                    className='text-center mx-1'
                                                                    size='sm'
                                                                ><i className="fas fa-times"></i></Button>
                                                            </DisplayChildren>
                                                        </Col>
                                                    </Row>
                                                ))}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup.Item>   
                        )}
                        
                        {!match.params.id && (
                            <Row className='mt-3'>
                                <Col className='text-right'>
                                    <Button
                                        type='submit'
                                        variant='primary'
                                    >{(loading) ? <Loader /> : 'Submit staffing'}
                                    </Button>
                                </Col>
                            </Row>
                        )}

                        {dealToEdit && match.params.id && (
                            <ListGroup.Item>
                                <Row className='my-1'>
                                    <Col>
                                        <strong>Last update at: </strong>{dealToEdit.updatedAt.substring(0, 19).replace('T', ' ')}
                                        
                                            
                                                    <Row className='align-items-center my-3'>
                                                        <Col xs={11} >
                                                            <Form.Group controlId='comment' className='mb-0'>
                                                                <Form.Control
                                                                    type='text'
                                                                    placeholder='Add a comment'
                                                                    value={newComment ? newComment : ''}
                                                                    onChange={(e) => setNewComment(e.target.value)}
                                                                    onKeyUp={(e) => (e.key === 'Enter') && addCommentHandler()}
                                                                ></Form.Control>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={1}>
                                                            <Button
                                                                variant='primary'
                                                                onClick={() => addCommentHandler()}
                                                                size='sm'
                                                            ><i className="fas fa-plus"></i></Button>
                                                        </Col>
                                                    </Row>

                                            <ListGroup className='my-3'>
                                            {comments && comments.map( (comment, index) => (
                                                <ListGroup.Item
                                                    key={index}
                                                    className='mb-0'
                                                >
                                                    
                                                    <p>
                                                        {comment.message}
                                                    </p>
                                                    <p style={{textAlign: 'right', marginBottom: '0'}}><i>By {comment.sender.name} the {comment.date.substring(0,19).replace('T', ' at ')}  {comment.sender._id === userInfo._id && (
                                                            <Button
                                                                size='sm'
                                                                variant='ligth'
                                                                style={{color:'red'}}
                                                                onClick={() => deleteCommentHandler(comment.date)}
                                                            >--delete--</Button>
                                                    )}</i></p>
                                                </ListGroup.Item>
                                            ))}
                                            </ListGroup>
                                        <strong>Created at: </strong>{dealToEdit.createdAt.substring(0, 19).replace('T', ' ')} <br />
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )}

                    </Col>
                </Row>
            </Form>

            {match.params.id && (
                <DropDownTitleContainer title='Availabilities' close={false}>
                    <ConsoDispo
                        start={start}
                        end={end}
                        mode='staffing'
                        addStaffHandler={addStaffHandler}
                        history={history}
                    />
                </DropDownTitleContainer>
            )}
        </>
    )
}

export default StaffingEditScreen;
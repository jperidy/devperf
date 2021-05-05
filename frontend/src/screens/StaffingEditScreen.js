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
import SelectCompany from '../components/SelectCompany';
import { REQUEST_STATUS } from '../constants/dealConstants';
import StaffAConsultant from '../components/StaffAConsultant';
import DisplayChildren from '../components/DisplayChildren';
import SelectInput from '../components/SelectInput';
import DateComponent from '../components/DateComponent';
import NumberComponent from '../components/NumberComponent';
import TextComponent from '../components/TextComponent';
import SelectComponent from '../components/SelectComponent';
import SelectMultipleComponent from '../components/SelectMultipleComponent';
import TextAreaComponent from '../components/TextAreaComponent';

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

    const [leader, setLeader] = useState([]);

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
        dispatch(getAllLeaders());

    }, [dispatch]);


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
                [{ id: dealToEdit.contacts.primary._id, value: dealToEdit.contacts.primary.name }] : ['']);
            setCoLeaders(dealToEdit.contacts.secondary ?
                dealToEdit.contacts.secondary.map(coLeader => ({ id: coLeader._id, value: coLeader.name })) : []);
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
                    secondary: coLeaders.length ? coLeaders.map(x => x.id) : [],
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

    const removeStaffHandler = (id) => {
        let tampon = new Array(...sdStaff);
        tampon = tampon.filter(consultant => consultant.idConsultant._id !== id);
        setSdStaff(tampon);
        setDealChange(true);
    }

    const addStaffHandler = (consultant, responsability, priority, information) => {

        let tampon = new Array(...sdStaff);

        // Rule if consultant already added in staff
        if (sdStaff.map(x => x.idConsultant._id).includes(consultant._id)) {
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
                secondary: coLeaders.length ? coLeaders.map(x => x.id) : [],
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
            sender: {
                _id: userInfo._id,
                name: userInfo.name
            },
            date: new Date(Date.now()).toISOString()
        });
        newComments.sort((a, b) => (Date.parse(b.date) - Date.parse(a.date)));
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

    const updateStatusHandler = (value) => {
        if (value === 'Won') {
            setWonDate(new Date(Date.now()));
        }
        else {
            setWonDate('');
        }
        setStatus(value);
    };

    const srStatusHandler = (value) => {
        setSrStatus(value);
        setDealChange(true);
    };

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
                                    dispatch({ type: DEAL_UPDATE_RESET })
                                }}
                                block
                            >Go Back</Button>
                        )}
                    </Col>
                    <Col xs={0} md={8}></Col>
                    <Col xs={6} md={2}>
                        {match.params.id && loadingUpdate && <Loader />}
                        {match.params.id && !loadingUpdate && (
                            <>
                                <Button
                                    onClick={() => {
                                        setEditRequest(!editRequest);
                                        editRequest && setDealChange(true);
                                    }}
                                    variant={editRequest ? 'warning' : 'light'}
                                    block
                                >{editRequest ? (
                                    <><span>Save  </span><i className="far fa-check-circle"></i></>
                                    ) : (
                                    <><span>Edit  </span><i className="far fa-edit"></i></>
                                )}
                                </Button>
                                {errorUpdate && (<Message variant='danger'>{errorUpdate}</Message>)}
                            </>
                        )}
                    </Col>
                </Row>
                {error && (<Row><Col><Message variant='danger'>{error}</Message></Col></Row>)}

                <Row className='mt-2'>

                    <Col xs={12} md={4}>

                        <ListGroup.Item>
                            <TextComponent
                                label='Title'
                                id="title"
                                placeholder='Staffing request object'
                                value={title}
                                onChange={setTitle}
                                required={true}
                                editRequest={editRequest}
                                formInline={false}
                            />
                        </ListGroup.Item>

                        <ListGroup.Item>

                            <Form.Group controlId='select-company' className='mb-0'>
                                <Form.Label as='h5'>Company *</Form.Label>
                                <SelectCompany
                                    company={{ value: company, label: company }}
                                    setCompany={setCompany}
                                    editRequest={editRequest}
                                />
                            </Form.Group>

                            {companyMessage && <Message variant='danger'>{companyMessage}</Message>}

                        </ListGroup.Item>

                        <ListGroup.Item>
                            <TextComponent
                                label='Client contact'
                                id="contact-client"
                                placeholder='Client contact'
                                value={client}
                                onChange={setClient}
                                required={false}
                                editRequest={editRequest}
                                formInline={false}
                            />
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <SelectComponent
                                editRequest={editRequest}
                                id="business-type"
                                label='Type of business'
                                value={type}
                                onChange={setType}
                                required={true}
                                options={
                                    <>
                                        <option value=''>--Select--</option>
                                        {TYPE_BUSINESS.map(type => (
                                            <option
                                                key={type.name}
                                                value={type.name}
                                            >{type.name}</option>
                                        ))}
                                    </>
                                }
                            />
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <SelectComponent
                                editRequest={editRequest}
                                id="deal-status"
                                label='Status'
                                value={status}
                                onChange={updateStatusHandler}
                                required={true}
                                options={
                                    <>
                                        <option value=''>--Select--</option>
                                        {DEAL_STATUS.map(status => (
                                            <option
                                                key={status.name}
                                                value={status.name}
                                            >{status.name}</option>
                                        ))}
                                    </>
                                }
                            />
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <SelectComponent
                                editRequest={editRequest}
                                id="probability"
                                label='Probability (%)'
                                value={probability}
                                onChange={setProbability}
                                required={true}
                                options={
                                    <>
                                        <option value=''>--Select--</option>
                                        {DEAL_PROBABILITY.map(prob => (
                                            <option
                                                key={prob.name}
                                                value={prob.name}
                                            >{prob.name} %</option>
                                        ))}
                                    </>
                                }
                            />
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <TextComponent
                                label='Location'
                                id="location"
                                placeholder='Location'
                                value={location}
                                onChange={setLocation}
                                required={false}
                                editRequest={editRequest}
                                formInline={false}
                            />
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <SelectComponent
                                editRequest={editRequest}
                                id="main-practice"
                                label='Main practice'
                                value={mainPractice}
                                onChange={setMainPractice}
                                required={true}
                                options={
                                    <>
                                        <option value=''>--Select--</option>
                                        {practiceList && practiceList.map((practice, val) => (
                                            <option
                                                value={practice}
                                                key={val}
                                            >{practice}</option>
                                        ))}
                                    </>
                                }
                            />
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <SelectMultipleComponent
                                label="Others Practices"
                                id="'others-practices'"
                                editRequest={editRequest}
                                required={false}
                                value={othersPractices}
                                onChange={setOthersPractices}
                                options={
                                    practiceList && practiceList.map((practice, val) => (
                                        (practice !== mainPractice) && (
                                            <option
                                                value={practice}
                                                key={val}
                                            >{practice}</option>
                                        )
                                    ))
                                }
                            />
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
                                </Col>

                                <Col xs={12} md={4}>

                                    <TextComponent
                                        label="Others contacts"
                                        id="others-contacts"
                                        placeholder="email1@mail.com;email2@mail.com"
                                        value={othersContacts}
                                        onChange={setOthersContacts}
                                        required={false}
                                        editRequest={editRequest}
                                        formInline={false}
                                    />
                                </Col>

                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <TextAreaComponent
                                label="Description"
                                id='staffing-description'
                                editRequest={editRequest}
                                required={true}
                                placeholder="Please describe the mission context"
                                value={description}
                                onChange={setDescription}
                                rows={3}
                            />
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h5>Sheduling</h5>
                            <Row className='align-items-end'>
                                <Col>
                                    <DateComponent
                                        label='Proposal'
                                        id="proposal-date"
                                        placeholder='proposal date'
                                        value={proposalDate}
                                        onChange={setProposalDate}
                                        required={true}
                                        editMode={editRequest}
                                    />
                                </Col>

                                <Col>
                                    <DateComponent
                                        label='Presentation'
                                        id="presentation-date"
                                        placeholder='presentation date'
                                        value={presentationDate}
                                        onChange={setPresentationDate}
                                        required={true}
                                        editMode={editRequest}
                                    />
                                </Col>

                                <Col>
                                    <DateComponent
                                        label='Start'
                                        id="start-date"
                                        placeholder='start date'
                                        value={startDate}
                                        onChange={setStartDate}
                                        required={true}
                                        editMode={editRequest}
                                    />
                                </Col>

                                <Col>
                                    <NumberComponent
                                        label='duration (month)'
                                        placeholder='duration'
                                        min={0}
                                        step={0.5}
                                        value={duration}
                                        onChange={setDuration}
                                        required={true}
                                        editRequest={editRequest}
                                    />
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col xs={12} md={8}>
                                    <TextAreaComponent
                                        label="Staffing instructions"
                                        id='staffing-instructions'
                                        editRequest={editRequest}
                                        required={true}
                                        placeholder="Please describe your staffing request"
                                        value={srInstruction}
                                        onChange={setSrInstruction}
                                        rows={3}
                                    />
                                </Col>

                                <Col xs={12} md={4}>
                                    <SelectComponent
                                        editRequest={true}
                                        label="Status"
                                        id="sr-status"
                                        value={srStatus}
                                        onChange={srStatusHandler}
                                        required={true}
                                        options={
                                            <>
                                                <option value=''>--Select--</option>
                                                {REQUEST_STATUS.map(({ name }) => (
                                                    <option
                                                        key={name}
                                                        value={name}
                                                    >{name}</option>
                                                ))}
                                            </>
                                        }
                                    />
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
                                        <ListGroup className='py-3'>
                                            {comments && comments.map((comment, index) => (
                                                <ListGroup.Item
                                                    key={index}
                                                    className='mb-0 py-2'
                                                >
                                                    <Row>
                                                        <Col>
                                                            <Form.Control
                                                                type="text"
                                                                value={comment.message}
                                                                readOnly
                                                            />
                                                            {/*comment.message*/}</Col>
                                                    </Row>
                                                    <p style={{ textAlign: 'right', marginBottom: '0' }}><i>By {comment.sender.name} the {comment.date.substring(0, 19).replace('T', ' at ')}  {comment.sender._id === userInfo._id && (
                                                        <Button
                                                            size='sm'
                                                            variant='ligth'
                                                            className='text-danger mx-0'
                                                            //style={{ color: 'red' }}
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
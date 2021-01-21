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
import { createDeal, getDealToEdit, updateDeal } from '../actions/dealActions';
import { getAllPractice } from '../actions/consultantActions';
import ConsoDispo from '../components/ConsoDispo';
import { DEAL_CREATE_RESET } from '../constants/dealConstants';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import ListGroup from 'react-bootstrap/ListGroup';
import StaffAConsultant from '../components/StaffAConsultant';
import ViewStaffs from '../components/ViewStaffs';

const StaffingEditScreen = ({ match, history }) => {

    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const dealCreate = useSelector(state => state.dealCreate);
    const { loading, error, success, createId } = dealCreate;

    const dealUpdate = useSelector(state => state.dealUpdate);
    const { loading: loadingUpdate, error: errorUpdate } = dealUpdate;

    const dealEdit = useSelector(state => state.dealEdit);
    const { success: successEdit, loading: loadingEdit, deal: dealToEdit } = dealEdit;

    const consultantPracticeList = useSelector(state => state.consultantPracticeList);
    const { practiceList } = consultantPracticeList;

    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [client, setClient] = useState('');
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

    const [sdInstructions, setSdInstructions] = useState('');
    const [sdStatus, setSdStatus] = useState('');
    const [sdStaff, setSdStaff] = useState([]);

    const [sdConsultant, setSdConsultant] = useState('');
    //const [sdResponsability, setSdResponsability] = useState('');
    //const [sdPriority, setSdPriority] = useState('');
    //const [sdInformation, setSdInformation] = useState('');

    const [wonDate, setWonDate] = useState('');

    const [modalWindowShow, setModalWindowShow] = useState(false);

    const [editRequest, setEditRequest] = useState(match.params.id ? false : true);

    const [dealChange, setDealChange] = useState(false);

    //ConsoDispo
    const duration = 3;
    let startDefault = new Date(Date.now());
    startDefault.setUTCDate(1);
    startDefault.setUTCMonth(startDefault.getUTCMonth());
    startDefault = startDefault.toISOString().substring(0, 10);

    let endDefault = new Date(Date.now());
    endDefault.setUTCDate(1);
    endDefault.setUTCMonth(endDefault.getUTCMonth() + duration);
    endDefault = endDefault.toISOString().substring(0, 10);

    const [practice, setPractice] = useState('PTC1');
    const [start, setStart] = useState(startDefault);
    const [end, setEnd] = useState(endDefault);

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
        if (match.params.id && successEdit) {
            setTitle(dealToEdit.title);
            setCompany(dealToEdit.company);
            setClient(dealToEdit.client);
            setStatus(dealToEdit.status);
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
        }
    }, [successEdit, dealToEdit, match])

    useEffect(() => {
        if (success) {
            history.push(`/staffing/${createId}`);
            dispatch({ type: DEAL_CREATE_RESET });
        }
    }, [dispatch, history, success, createId]);

    useEffect(() => {
        if (match.params.id && dealChange) {
            const deal = {
                company: company,
                client: client,
                title: title,
                status: status,
                contacts:{
                    primary:userInfo.consultantProfil._id,
                    secondary:[]
                },
                probability: probability,
                description: description,
                proposalDate: proposalDate,
                presentationDate: presentationDate,
                wonDate: wonDate,
                startDate: startDate,
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
                }
            }
            dispatch(updateDeal(match.params.id, deal));
            setDealChange(false);
            setModalWindowShow(false);
        }

    },[match, dispatch, userInfo, dealChange, company, client, title, status, probability, description, proposalDate, presentationDate, 
        wonDate, startDate, mainPractice, othersPractices, location, srInstruction, srStatus, srRessources, sdInstructions,
        sdStatus, sdStaff
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

    const addStaff = (consultant) => {
        const staffId = sdStaff.map(consultant => consultant.idConsultant._id);
        if (staffId.includes(consultant._id)) {
            window.confirm('Consultant already added')
        } else {
            setModalWindowShow(true);
            setSdConsultant(consultant);
        }
    };

    const removeStaffHandler = (id) => {
        let tampon = new Array(...sdStaff);
        tampon = tampon.filter(consultant => consultant.idConsultant._id !== id);
        setSdStaff(tampon);
        setDealChange(true);
    }

    const addStaffHandler = (responsability, priority, information) => {
        let tampon = new Array(...sdStaff);
        tampon.push({
            idConsultant: {
                _id: sdConsultant._id,
                name: sdConsultant.name,
            },
            responsability: responsability,
            priority: priority,
            information: information
        });
        setSdStaff(tampon);
        setDealChange(true);
    }

    const prepareDeal = () => {
        return {
            company: company,
            client: client,
            title: title,
            contacts:{
                primary:userInfo.consultantProfil._id,
                secondary:[]
            },
            status: status,
            probability: probability,
            description: description,
            proposalDate: proposalDate,
            presentationDate: presentationDate,
            wonDate: wonDate,
            startDate: startDate,
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
            }
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        const deal = prepareDeal();

        if (match.params.id) {
            dispatch(updateDeal(match.params.id, deal));
        } else {
            dispatch(createDeal(deal));
        }
    };

    return (
        <>
            <h1>Staffing request (/!\ work in progress)</h1>
            <Form onSubmit={submitHandler}>
                <Row className='mt-3'>
                    <Col xs={6} md={2}>
                        {match.params.id && (
                            <Button
                                type='button'
                                variant='primary'
                                onClick={() => history.go(-1)}
                                block
                            >Go Back</Button>
                        )}
                    </Col>
                    <Col xs={0} md={8}></Col>
                    <Col xs={6} md={2}>
                        {!match.params.id && (
                            <Button
                                type='submit'
                                variant='primary'
                                block
                            >{(loading) ? <Loader /> : 'Submit staffing'}
                            </Button>
                        )}
                        {match.params.id && loadingUpdate && <Loader />}
                    </Col>
                </Row>

                {error && (
                    <Row><Col><Message variant='danger'>{error}</Message></Col></Row>
                )}
                {errorUpdate && (
                    <Row><Col><Message variant='danger'>{errorUpdate}</Message></Col></Row>
                )}

                {match.params.id && (
                    <Row className='mt-3'>
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
                        </Col>
                    </Row>
                )}

                <Row className='mt-2'>

                    <Col xs={12} md={4}>

                        <ListGroup.Item>
                            <Form.Group controlId='title' className='mb-0'>
                                <Form.Label as='h5'>Title</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        type='text'
                                        placeholder='Staffing request object'
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    ></Form.Control>
                                ) : (
                                        <Form.Control
                                            type='text'
                                            plaintext
                                            value={title}
                                            readOnly
                                        ></Form.Control>
                                    )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Form.Group controlId='company' className='mb-0'>
                                <Form.Label as='h5'>Company</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        type='text'
                                        placeholder='Company name'
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        required
                                    ></Form.Control>
                                ) : (
                                        <Form.Control
                                            type='text'
                                            plaintext
                                            readOnly
                                            value={company}
                                        ></Form.Control>
                                    )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Form.Group controlId='client' className='mb-0'>
                                <Form.Label as='h5'>Client</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        type='text'
                                        placeholder='Client name'
                                        value={client}
                                        onChange={(e) => setClient(e.target.value)}
                                    ></Form.Control>
                                ) : (
                                        <Form.Control
                                            type='text'
                                            plaintext
                                            readOnly
                                            value={client}
                                        ></Form.Control>
                                    )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Form.Group controlId='status' className='mb-0'>
                                <Form.Label as='h5'>Status</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        as='select'
                                        value={status}
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
                                        <option value='Lead'>Lead</option>
                                        <option value='Proposal to send'>Proposal to send</option>
                                        <option value='Proposal sent'>Proposal sent</option>
                                        <option value='Won'>Won</option>
                                        <option value='Abandoned'>Abandoned</option>
                                    </Form.Control>
                                ) : (
                                        <Form.Control
                                            type='text'
                                            plaintext
                                            readOnly
                                            value={status}
                                        ></Form.Control>
                                    )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Form.Group controlId='probability' className='mb-0'>
                                <Form.Label as='h5'>Probability</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        as='select'
                                        value={probability}
                                        onChange={(e) => setProbability(e.target.value)}
                                        required
                                    >
                                        <option value=''>--Select--</option>
                                        <option value={10}>10 %</option>
                                        <option value={30}>30 %</option>
                                        <option value={50}>50 %</option>
                                        <option value={70}>70 %</option>
                                        <option value={100}>100 %</option>
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
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    ></Form.Control>
                                ) : (
                                    <Form.Control
                                        type='text'
                                        plaintext
                                        readOnly
                                        value={location}
                                    ></Form.Control>
                                )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Form.Group controlId='main-practice' className='mb-0'>
                                <Form.Label as='h5'>Main Practice</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        as='select'
                                        value={mainPractice}
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
                                        value={mainPractice}
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
                                        value={othersPractices}
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
                                        type='Text'
                                        value={othersPractices.join(', ')}
                                        plaintext
                                        readOnly
                                    ></Form.Control>
                                )}
                            </Form.Group>
                        </ListGroup.Item>

                    </Col>

                    <Col xs={12} md={8}>

                        <ListGroup.Item>
                            <Form.Group controlId='description' className='mb-0'>
                                <Form.Label as='h5'>Description</Form.Label>
                                {editRequest ? (
                                    <Form.Control
                                        as='textarea'
                                        rows={3}
                                        placeholder='Deal description'
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    ></Form.Control>
                                ) : (
                                    <Form.Control
                                        type='text'
                                        value={description}
                                        plaintext
                                        readOnly
                                    ></Form.Control>
                                )}
                            </Form.Group>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    <Form.Group controlId='proposal-date' className='mb-0'>
                                        <Form.Label as='h5'>Proposal Date</Form.Label>
                                        {editRequest ? (
                                            <Form.Control
                                                type='date'
                                                placeholder='Deal date'
                                                value={proposalDate}
                                                onChange={(e) => setProposalDate(e.target.value)}
                                            ></Form.Control>
                                        ) : (
                                            <Form.Control
                                                type='date'
                                                value={proposalDate}
                                                plaintext
                                                readOnly
                                            ></Form.Control>
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group controlId='presentation-date' className='mb-0'>
                                        <Form.Label as='h5'>Presentation Date</Form.Label>
                                        {editRequest ? (
                                            <Form.Control
                                                type='date'
                                                placeholder='Presentation date'
                                                value={presentationDate}
                                                onChange={(e) => setPresentationDate(e.target.value)}
                                            ></Form.Control>
                                        ) : (
                                            <Form.Control
                                                type='date'
                                                value={presentationDate}
                                                plaintext
                                                readOnly
                                            ></Form.Control>
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group controlId='start-date' className='mb-0'>
                                        <Form.Label as='h5'>Start Date</Form.Label>
                                        {editRequest ? (
                                            <Form.Control
                                                type='date'
                                                placeholder='Start date'
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                required
                                            ></Form.Control>
                                        ) : (
                                            <Form.Control
                                                type='date'
                                                value={startDate}
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
                                        <Form.Label as='h5'>Staffing instruction</Form.Label>
                                        {editRequest ? (
                                            <Form.Control
                                                as='textarea'
                                                rows={3}
                                                placeholder='Staffing instruction'
                                                value={srInstruction}
                                                onChange={(e) => setSrInstruction(e.target.value)}
                                                required
                                            ></Form.Control>
                                        ) : (
                                            <Form.Control
                                                type='text'
                                                value={srInstruction}
                                                plaintext
                                                readOnly
                                            ></Form.Control>
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={4}>
                                    <Form.Group controlId='sr-status' className='mb-0'>
                                        <Form.Label as='h5'>Status</Form.Label>
                                        <Form.Control
                                            as='select'
                                            value={srStatus}
                                            onChange={(e) => {
                                                setSrStatus(e.target.value)
                                                setDealChange(true);
                                            }}
                                            required
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
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h5>Staffing decision</h5>
                            <Row className='my-3'>
                                <Col xs={4}><strong>Name</strong></Col>
                                <Col xs={4}><strong>Responsability</strong></Col>
                                <Col xs={2}><strong>Priority</strong></Col>
                                <Col xs={2}></Col>
                            </Row>
                            {sdStaff && sdStaff.map((consultant, val) => (
                                <ListGroup.Item key={val}>
                                    <Row className='align-items-center'>
                                        <Col xs={4}>
                                            <OverlayTrigger
                                                placement="right"
                                                trigger='click'
                                                overlay={
                                                    <Popover id='popover-others-staffs' style={{'maxWidth': '100%'}}>
                                                        <Popover.Title id="contained-modal-title-vcenter">
                                                                Others staffs
                                                        </Popover.Title>

                                                        <Popover.Content>
                                                            <ViewStaffs 
                                                                history={history}
                                                                consultantId={consultant.idConsultant._id}
                                                                onNavigate={() => ('')}
                                                                displayedDeal={match.params.id}
                                                            />
                                                        </Popover.Content>
                                                    </Popover>
                                                }
                                            >
                                                <Form.Group controlId='sd-name' className='mb-0'>
                                                    <Form.Control
                                                        type='text'
                                                        plaintext
                                                        readOnly
                                                        value={consultant.idConsultant.name}
                                                    ></Form.Control>
                                                </Form.Group>
                                            </OverlayTrigger>
                                        </Col>

                                        <Col xs={4}>
                                            <Form.Group controlId='sd-responsability' className='mb-0'>
                                                <Form.Control
                                                    type='text'
                                                    plaintext
                                                    readOnly
                                                    value={consultant.responsability}
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={2}>
                                            <Form.Group controlId='sd-priority' className='mb-0'>
                                                <Form.Control
                                                    type='text'
                                                    plaintext
                                                    readOnly
                                                    value={consultant.priority}
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={2}>
                                            <Button
                                                onClick={() => removeStaffHandler(consultant.idConsultant._id)}
                                                variant='danger'
                                                size='sm'
                                            ><i className="fas fa-times"></i></Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup.Item>

                        {dealToEdit && (
                            <ListGroup.Item>
                                <Row className='my-1'>
                                    <Col>
                                        <strong>Last update at: </strong>{dealToEdit.updatedAt.substring(0, 19).replace('T', ' ')}
                                        <ListGroup.Item className='my-3'>
                                            Add here communication history
                                        </ListGroup.Item>
                                        <strong>Created at: </strong>{dealToEdit.createdAt.substring(0, 19).replace('T', ' ')} <br />
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )}

                    </Col>
                </Row>
            </Form>

            <StaffAConsultant 
                show={modalWindowShow}
                alreadyStaff={sdStaff}
                onHide={() => setModalWindowShow(false)}
                consultant={sdConsultant}
                addStaffHandler={addStaffHandler}
                history={history}
            />

            {match.params.id && (
                <DropDownTitleContainer title='Availabilities' close={false}>
                    <ConsoDispo
                        practice={practice}
                        start={start}
                        end={end}
                        mode='staffing'
                        addStaff={addStaff}
                    />
                </DropDownTitleContainer>
            )}
        </>
    )
}

export default StaffingEditScreen;
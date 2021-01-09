import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ModalWindow from '../components/ModalWindow';
import { createDeal, getDealToEdit, updateDeal } from '../actions/dealActions';
import { getAllPractice } from '../actions/consultantActions';
import ConsoDispo from '../components/ConsoDispo';
import { DEAL_CREATE_RESET } from '../constants/dealConstants';

const StaffingRequestScreen = ({match, history}) => {

    const dispatch = useDispatch();

    //const dealId = match.params.id;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const dealCreate = useSelector(state => state.dealCreate);
    const { loading, error, success, createId } = dealCreate;

    const dealUpdate = useSelector(state => state.dealUpdate);
    const { loading:loadingUpdate, error: errorUpdate } = dealUpdate;

    const dealEdit = useSelector(state => state.dealEdit);
    const { success: successEdit, deal: dealToEdit } = dealEdit;

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

    const [srResponsabilityAdd, setSrResponsabilityAdd] = useState('');
    const [srGradeAdd, setSrGradeAdd] = useState('');
    const [srVolume, setSrVolumeAdd] = useState('');
    const [srDuration, setSrDuration] = useState('');

    const [sdInstructions, setSdInstructions] = useState('');
    const [sdStatus, setSdStatus] = useState('');
    const [sdStaff, setSdStaff] = useState([]);
    const [sdResponsability, setSdResponsability] = useState('');
    const [sdPriority, setSdPriority] = useState('');
    const [sdInformation, setSdInformation] = useState('');
    const [sdConsultant, setSdConsultant] = useState('');

    const [wonDate, setWonDate] = useState('');

    const [modalWindowShow, setModalWindowShow] = useState(false);

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
        if (!userInfo ) {
            history.push('/login');
        }
    }, [history, userInfo]);

    useEffect(() => {
        if(!practiceList) {
            dispatch(getAllPractice());
        }
    }, [dispatch, practiceList]);

    useEffect(()=>{
        if(match.params.id) {
            dispatch(getDealToEdit(match.params.id));
        }
    }, [dispatch, match])

    useEffect(() => {
        if(match.params.id && successEdit) {
            setTitle(dealToEdit.title);
            setCompany(dealToEdit.company);
            setClient(dealToEdit.client);
            setStatus(dealToEdit.status);
            setProbability(dealToEdit.probability);
            setDescription(dealToEdit.description);
            setProposalDate(dealToEdit.proposalDate ? dealToEdit.proposalDate.substring(0,10) : "");
            setPresentationDate(dealToEdit.presentationDate ? dealToEdit.presentationDate.substring(0,10) : "");
            setStartDate(dealToEdit.startDate ? dealToEdit.startDate.substring(0,10) : "");
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
        if(success) {
            history.push(`/staffing/${createId}`);
            dispatch({ type: DEAL_CREATE_RESET });
        }
    }, [history, success, createId]);

    const addRessource = (responsability, grade, volume, duration) => {
        let tampon = new Array(...srRessources);
        tampon.push({
            responsability,
            grade,
            volume,
            duration
        });
        setSrRessources(tampon);
    };

    const deleteRessource = (val) => {
        let tampon = new Array(...srRessources);
        tampon.splice(Number(val), 1);
        setSrRessources(tampon);
    };

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
        if(staffId.includes(consultant._id)) {
            window.confirm('Consultant already added')
        } else {
            setModalWindowShow(true);
            setSdConsultant(consultant);
        }
        
    };

    const addStaffHandler = () => {
        //console.log('processToAdd');

        let tampon = new Array(...sdStaff);
        tampon.push({
            idConsultant : {
                _id: sdConsultant._id,
                name: sdConsultant.name,
            },
            responsability: sdResponsability,
            priority: sdPriority,
            information: sdInformation
        });
        setSdStaff(tampon);
        
        setModalWindowShow(false)
    }

    const removeStaffHandler = (id) => {
        //console.log(id);
        let tampon = new Array(...sdStaff);
        tampon = tampon.filter(consultant => consultant.idConsultant._id !== id);
        setSdStaff(tampon);
    }

    const submitHandler = (e) => {
        e.preventDefault()
        const deal = {
            company: company,
            client: client,
            title: title,
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
            staffingDecision:{
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

        if (match.params.id) {
            //console.log('updage');
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
                        <Button 
                            type='submit' 
                            variant='primary' 
                            block
                        >{(loading || loadingUpdate) ? <Loader /> : match.params.id ? 'Update' : 'Submit staffing'}
                        </Button>
                    </Col>
                </Row>

                {error && (
                    <Row><Col><Message variant='danger'>{error}</Message></Col></Row>
                )}
                {errorUpdate && (
                    <Row><Col><Message variant='danger'>{errorUpdate}</Message></Col></Row>
                )}

                <Row className='mt-5'>

                    <Col xs={12} md={4}>

                        <Form.Group controlId='title'>
                            <Form.Label as='h5'>Title</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Staffing request object'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='company'>
                            <Form.Label as='h5'>Company</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Company name'
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='client'>
                            <Form.Label as='h5'>Client</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Client name'
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='status'>
                            <Form.Label as='h5'>Status</Form.Label>
                            <Form.Control
                                as='select'
                                value={status}
                                onChange={(e) => {
                                    if (e.target.value === 'Won') {
                                        setWonDate(new Date(Date.now()));
                                        setSrStatus('Keep staffing');
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
                        </Form.Group>

                        <Form.Group controlId='probability'>
                            <Form.Label as='h5'>Probability</Form.Label>
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
                        </Form.Group>

                        <Form.Group controlId='location'>
                            <Form.Label as='h5'>Location</Form.Label>
                            <Form.Control
                                type='String'
                                placeholder='Location'
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='main-practice'>
                            <Form.Label as='h5'>Main Practice</Form.Label>
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
                        </Form.Group>

                        <Form.Group controlId='others-practices'>
                            <Form.Label as='h5'>Others Practices</Form.Label>
                            <Form.Control
                                as='select'
                                onClick={(e) => updateOthersPractices() }
                                multiple
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
                        </Form.Group>

                    </Col>

                    <Col xs={12} md={8}>

                        <Form.Group controlId='description'>
                            <Form.Label as='h5'>Description</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={3}
                                placeholder='Deal description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></Form.Control>
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group controlId='proposal-date'>
                                    <Form.Label as='h5'>Proposal Date</Form.Label>
                                    <Form.Control
                                        type='date'
                                        placeholder='Deal date'
                                        value={proposalDate}
                                        onChange={(e) => setProposalDate(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId='presentation-date'>
                                    <Form.Label as='h5'>Presentation Date</Form.Label>
                                    <Form.Control
                                        type='date'
                                        placeholder='Presentation date'
                                        value={presentationDate}
                                        onChange={(e) => setPresentationDate(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId='start-date'>
                                    <Form.Label as='h5'>Start Date</Form.Label>
                                    <Form.Control
                                        type='date'
                                        placeholder='Start date'
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12} md={8}>
                                <Form.Group controlId='sr-instruction'>
                                    <Form.Label as='h5'>Staffing instruction</Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        rows={3}
                                        placeholder='Staffing instruction'
                                        value={srInstruction}
                                        onChange={(e) => setSrInstruction(e.target.value)}
                                        required
                                    ></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={4}>
                                <Form.Group controlId='sr-status'>
                                    <Form.Label as='h5'>Status</Form.Label>
                                    <Form.Control
                                        as='select'
                                        value={srStatus}
                                        onChange={(e) => setSrStatus(e.target.value)}
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

                        {/* <h5>Add ressources</h5>
                        <Row>
                            <Col>Responsability</Col>
                            <Col>Grade</Col>
                            <Col>Volume</Col>
                            <Col>Duration (month)</Col>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId='sr-responsability'>
                                    <Form.Control
                                        as='select'
                                        value={srResponsabilityAdd}
                                        onChange={(e) => setSrResponsabilityAdd(e.target.value)}
                                    >
                                        <option value=''>--Select--</option>
                                        <option value={'Project director'}>Project director</option>
                                        <option value={'Project manager'}>Project manager</option>
                                        <option value={'Project leader'}>Project leader</option>
                                        <option value={'X'}>X</option>
                                        <option value={'Intern'}>Intern</option>

                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId='sr-grade'>
                                    <Form.Control
                                        as='select'
                                        value={srGradeAdd}
                                        onChange={(e) => setSrGradeAdd(e.target.value)}
                                    >
                                        <option value=''>--Select--</option>
                                        <option value={'Analyst'}>Analyst</option>
                                        <option value={'Consultant'}>Consultant</option>
                                        <option value={'Senior consultant'}>Senior consultant</option>
                                        <option value={'Manager'}>Manager</option>
                                        <option value={'Senior manager'}>Senior manager</option>
                                        <option value={'Director'}>Director</option>
                                        <option value={'Partner'}>Partner</option>

                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId='sr-volume'>
                                    <Form.Control
                                        as='select'
                                        value={srVolume}
                                        onChange={(e) => setSrVolumeAdd(e.target.value)}
                                    >
                                        <option value=''>--Select--</option>
                                        <option value={'1/5'}>1/5</option>
                                        <option value={'2/5'}>2/5</option>
                                        <option value={'3/5'}>3/5</option>
                                        <option value={'4/5'}>4/5</option>
                                        <option value={'5/5'}>5/5</option>

                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId='sr-duration'>
                                    <Form.Control
                                        type='Number'
                                        min={0}
                                        step={0.5}
                                        value={srDuration}
                                        placeholder={0}
                                        onChange={(e) => setSrDuration(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Button
                                    onClick={() => addRessource(srResponsabilityAdd, srGradeAdd, srVolume, srDuration)}
                                    variant='secondary'
                                    block
                                ><i className="fas fa-plus"></i></Button>
                            </Col>
                        </Row>

                        {srRessources && srRessources.map((ressource, val) => (
                            <Row key={val}>
                                <Col>
                                    <Form.Group controlId='sr-responsability'>
                                        <Form.Control
                                            plaintext
                                            readOnly
                                            value={ressource.responsability}
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='sr-grade'>
                                        <Form.Control
                                            plaintext
                                            readOnly
                                            value={ressource.grade}
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='sr-volume'>
                                        <Form.Control
                                            plaintext
                                            readOnly
                                            value={ressource.volume}
                                            className='text-center'
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='sr-duration'>
                                        <Form.Control
                                            plaintext
                                            readOnly
                                            value={ressource.duration}
                                            className='text-center'
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col className='text-center'>
                                    <Button 
                                        variant='danger'
                                        onClick={() => deleteRessource(val)}
                                    ><i className="fas fa-trash-alt"></i></Button>
                                </Col>
                            </Row>
                        ))}  */}

                        <h5>Staffing decision</h5>
                        <Row>
                            <Col xs={4}><strong>Name</strong></Col>
                            <Col xs={4}><strong>Responsability</strong></Col>
                            <Col xs={2}><strong>Priority</strong></Col>
                            <Col xs={2}></Col>
                        </Row>
                        {sdStaff && sdStaff.map((consultant, val) => (
                            <Row key={val}>
                                <Col xs={4}>
                                    <Form.Group controlId='sd-name'>
                                        <Form.Control
                                            type='text'
                                            plaintext
                                            readOnly
                                            value={consultant.idConsultant.name}
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>

                                <Col xs={4}>
                                    <Form.Group controlId='sd-responsability'>
                                        <Form.Control
                                            type='text'
                                            plaintext
                                            readOnly
                                            value={consultant.responsability}
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Form.Group controlId='sd-priority'>
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
                                        block
                                    ><i className="fas fa-times"></i></Button>
                                </Col>
                            </Row>
                        ))}
                    </Col>
                </Row>
            </Form>

            <ModalWindow 
                show={modalWindowShow}
                onSubmit={() => addStaffHandler()}
                onHide={() => setModalWindowShow(false)}
                header='Staffing'
                title='Description'
                isValid={sdResponsability !== '' && sdPriority !== ''}
                body={
                    <>
                        <Row>
                            <Col>
                                <label htmlFor='sd-consultant'>Name</label>
                                <InputGroup id='sd-consultant'>
                                    <FormControl
                                        type='text'
                                        plaintext
                                        readOnly
                                        value={sdConsultant.name ? sdConsultant.name : ''}
                                    ></FormControl>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='mt-3'>
                                <label htmlFor='sd-responsability'>Responsability</label>
                                <InputGroup id='sd-responsability'>
                                    <FormControl
                                        as='select'
                                        value={sdResponsability}
                                        onChange={(e) => setSdResponsability(e.target.value)}
                                    >
                                        <option value=''>--Select--</option>
                                        <option value={'Project director'}>Project director</option>
                                        <option value={'Project manager'}>Project manager</option>
                                        <option value={'Project leader'}>Project leader</option>
                                        <option value={'X'}>X</option>
                                        <option value={'Intern'}>Intern</option>

                                    </FormControl>
                                </InputGroup>
                            </Col>

                            <Col className='mt-3'>
                                <label htmlFor='sd-priority'>Priority</label>
                                <InputGroup id='sd-priority'>
                                    <FormControl
                                        as='select'
                                        value={sdPriority}
                                        onChange={(e) => setSdPriority(e.target.value)}
                                    >
                                        <option value=''>--Select--</option>
                                        <option value={'P1'}>P1</option>
                                        <option value={'P2'}>P2</option>
                                        <option value={'P3'}>P3</option>

                                    </FormControl>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='mt-3'>
                                <label>Comment (option)</label>
                                <InputGroup id='sd-information'>
                                    <FormControl
                                        as='textarea'
                                        rows={3}
                                        value={sdInformation}
                                        onChange={(e) => setSdInformation(e.target.value)}
                                    ></FormControl>
                                </InputGroup>
                            </Col>
                        </Row>
                    </>
                }
            />

            {match.params.id && (
                <ConsoDispo 
                    practice={practice}
                    start={start}
                    end={end}
                    mode='staffing'
                    addStaff={addStaff}
                />
            )}


        </>
    )
}

export default StaffingRequestScreen;

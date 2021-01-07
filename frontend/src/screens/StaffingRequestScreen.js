import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { createDeal, getDealToEdit, updateDeal } from '../actions/dealActions';
import { getAllPractice } from '../actions/consultantActions';

const StaffingRequestScreen = ({match, history}) => {

    const dispatch = useDispatch();

    const dealId = match.params.id;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const dealCreate = useSelector(state => state.dealCreate);
    const { loading, error, success, createId } = dealCreate;

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
    const [srStatus, setSrStatus] = useState('wait');
    const [srRessources, setSrRessources] = useState([]);

    const [srResponsabilityAdd, setSrResponsabilityAdd] = useState('');
    const [srGradeAdd, setSrGradeAdd] = useState('');
    const [srVolume, setSrVolumeAdd] = useState('');
    const [srDuration, setSrDuration] = useState('');

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
        if(dealId) {
            dispatch(getDealToEdit(dealId));
        }
    }, [dispatch, dealId])

    useEffect(() => {
        if(dealId && successEdit) {
            setTitle(dealToEdit.title);
            setCompany(dealToEdit.company);
            setClient(dealToEdit.client);
            setStatus(dealToEdit.status);
            setProbability(dealToEdit.probability);
            setDescription(dealToEdit.description);
            setProposalDate(dealToEdit.proposalDate && dealToEdit.proposalDate.substring(0,10));
            setPresentationDate(dealToEdit.presentationDate && dealToEdit.presentationDate.substring(0,10));
            setStartDate(dealToEdit.startDate && dealToEdit.startDate.substring(0,10));
            setMainPractice(dealToEdit.mainPractice);
            setOthersPractices(dealToEdit.othersPractices);
            setLocation(dealToEdit.location);
            setSrInstruction(dealToEdit.staffingRequest.instructions);
            setSrStatus(dealToEdit.staffingRequest.requestStatus);
            setSrRessources(dealToEdit.staffingRequest.ressources ? dealToEdit.staffingRequest.ressources : []);
        }
    }, [successEdit, dealToEdit, dealId])
    
    useEffect(() => {
        if(success) {
            history.push(`/staffing/${createId}`)
        }
    }, [history, success]);

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
            startDate: startDate,
            mainPractice: mainPractice,
            othersPractices: othersPractices,
            location: location,
            staffingRequest: {
                instructions: srInstruction,
                requestStatus: srStatus,
                ressources: srRessources
            },
        }
        if (dealId) {
            //console.log('updage');
            dispatch(updateDeal(dealId, deal));
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
                        {dealId && (
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
                        >{loading ? <Loader /> : dealId ? 'Update' : 'Submit staffing'}
                        </Button>
                    </Col>
                </Row>
                {error && (
                    <Row><Col><Message variant='danger'>{error}</Message></Col></Row>
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
                                onChange={(e) => setStatus(e.target.value)}
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
                                    <Form.Label as='h5'>Instruction</Form.Label>
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
                                        <option value='To do'>To do</option>
                                        <option value='Keep staffing'>Keep staffing</option>
                                        <option value='Retreat staffing'>Keep</option>
                                        <option value='Release staffing'>Available</option>

                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <h5>Add ressources</h5>
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
                        ))}
                    </Col>
                </Row>
                
            </Form>
        </>
    )
}

export default StaffingRequestScreen;

import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ViewStaffs from './ViewStaffs';


const StaffAConsultant = ({ history, onHide, show, alreadyStaff, consultant, addStaffHandler }) => {

    //const dispatch = useDispatch();

    const [sdResponsability, setSdResponsability] = useState('');
    const [sdPriority, setSdPriority] = useState('');
    const [sdInformation, setSdInformation] = useState('');

    //const consultantAllStaffs = useSelector(state => state.consultantAllStaffs);
    //const { loading, staffings } = consultantAllStaffs;

    /* useEffect(() => {
        if (consultant) {
            dispatch(getAllStaffs(consultant._id));
        }
    }, [dispatch, consultant]); */

    /*
    const addStaffHandler = () => {

        let tampon = new Array(...alreadyStaff);
        tampon.push({
            idConsultant: {
                _id: consultant._id,
                name: consultant.name,
            },
            responsability: sdResponsability,
            priority: sdPriority,
            information: sdInformation
        });
        addStaffHandler(tampon);
        onHide();
    }
    */

    //console.log('consultant', consultant);

    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Staff
                    </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <h4>{consultant.name ? consultant.name : ''}</h4>
                <Row>
                    <Col className='mt-3'>
                        <label htmlFor='sd-responsability'><strong>Responsability *</strong></label>
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
                        <label htmlFor='sd-priority'><strong>Priority *</strong></label>
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
                        <label><strong>Comment</strong></label>
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

                <ViewStaffs 
                    history={history}
                    consultantId={consultant._id}
                    onNavigate={onHide}
                />

                {/* <Row>
                    <Col className='mt-5'>
                        <h4>Others staffings</h4>
                        <Row className='mt-3'>
                            <Col><strong>Company</strong></Col>
                            <Col><strong>Title</strong></Col>
                            <Col><strong>Practice</strong></Col>
                            <Col><strong>Probability</strong></Col>
                            <Col><strong>Start</strong></Col>
                            <Col><strong>Request status</strong></Col>
                            <Col></Col>
                        </Row>

                        {loading && <Loader />}
                        {staffings && staffings.map( deal => (
                            <ListGroup.Item
                                key={deal._id}
                            >
                                <Row>
                                    <Col>
                                        {deal.company}
                                    </Col>
                                    <Col>
                                        {deal.title}
                                    </Col>
                                    <Col>
                                        {deal.mainPractice}
                                    </Col>
                                    <Col>
                                        {deal.probability} %
                                    </Col>
                                    <Col>
                                        {deal.startDate.substring(0,10)}
                                    </Col>
                                    <Col>
                                        {deal.requestStatus}
                                    </Col>
                                    <Col>
                                        <Button
                                            onClick={() => {
                                                history.push(`/staffing/${deal._id}`);
                                                onHide();
                                            }}
                                            variant='light'
                                        ><i className="fas fa-edit"></i></Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </Col>
                </Row> */}
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={onHide} variant='secondary'>Cancel</Button>
                <Button 
                    onClick={() => addStaffHandler(sdResponsability, sdPriority, sdInformation)} 
                    variant='primary' 
                    disabled={!(sdResponsability !== '' && sdPriority !== '')}
                >Submit</Button>
                
            </Modal.Footer>

        </Modal>
    )
}

export default StaffAConsultant;

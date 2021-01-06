import React, { useState, useEffect } from 'react';
import FormContainer from '../components/FormContainer';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const StaffingRequestScreen = () => {

    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [client, setClient] = useState('');
    const [status, setStatus] = useState('');
    const [probability, setProbability] = useState('');
    const [description, setDescription] = useState('');
    const [proposalDate, setProposalDate] = useState('');
    const [presentationDate, setPresentationDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [duration, setDuration] = useState('');
    const [mainPractice, setMainPractice] = useState(1);
    const [othersPractices, setOthersPractices] = useState(1);
    const [location, setLocation] = useState('');
    const [srInstruction, setSrInstruction] = useState('');
    const [srStatus, setSrStatus] = useState('wait');
    const [srRessources, setSrRessources] = useState([]);

    const [srResponsabilityAdd, setSrResponsabilityAdd] = useState('');
    const [srGradeAdd, setSrGradeAdd] = useState('');
    const [srVolume, setSrVolumeAdd] = useState('');
    const [srDuration, setSrDuration] = useState('');

    

    const addRessource = (responsability, grade, volume, duration) => {
        let tampon = new Array(...srRessources);
        tampon.push({
            responsability,
            grade,
            volume,
            duration
        });
        //console.log('tampon', tampon);
        setSrRessources(tampon);
    };

    const deleteRessource = (val) => {
        let tampon = new Array(...srRessources);
        console.log('tampon', tampon);
        console.log('val', val);
        tampon.splice(Number(val), 1);
        setSrRessources(tampon);
    };

    const submitHandler = () => {
        console.log('submit');
    };

    return (
        <>
            <h1>Staffing request</h1>
            <Form onSubmit={submitHandler}>
                <Row>

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
                                type='text'
                                placeholder='Deal status'
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='probability'>
                            <Form.Label as='h5'>Probability</Form.Label>
                            <Form.Control
                                type='Number'
                                placeholder='Deal probability'
                                value={probability}
                                onChange={(e) => setProbability(e.target.value)}
                                required
                            ></Form.Control>
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
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='second-practice'>
                            <Form.Label as='h5'>Others Practices</Form.Label>
                            <Form.Control
                                as='select'
                                value={othersPractices}
                                onChange={(e) => setOthersPractices(e.target.value)}
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
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
                                        required
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

                        <Form.Group controlId='duration'>
                            <Form.Label as='h5'>Duration (month)</Form.Label>
                            <Form.Control
                                type='Number'
                                min={0}
                                step={0.5}
                                placeholder='Duration'
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            ></Form.Control>
                        </Form.Group>

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
                                        <option value={'wait'}>Wait</option>
                                        <option value={'staff'}>Staff</option>
                                        <option value={'keep'}>Keep</option>
                                        <option value={'available'}>Available</option>

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
                                        required
                                    >
                                        <option value=''>--Select--</option>
                                        <option value={'Project director'}>Project director</option>
                                        <option value={'Project manager'}>Project manager</option>
                                        <option value={'Consultant'}>Consultant</option>
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
                                        required
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
                                        required
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
                                        required
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Button
                                    onClick={() => addRessource(srResponsabilityAdd, srGradeAdd, srVolume, srDuration)}
                                    variant='primary'
                                    block
                                >Add</Button>
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

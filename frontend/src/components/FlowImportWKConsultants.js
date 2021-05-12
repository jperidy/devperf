import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { uploadConsultantWk, updateConsultantWk } from '../actions/consultantActions';
import Form from 'react-bootstrap/Form';

const FlowImportWKConsultants = (props) => {

    const dispatch = useDispatch();

    const [step, setStep] = useState(0);
    //const [selectedFile, setSelectedFile] = useState(null);

    const consultantUploadWk = useSelector(state => state.consultantUploadWk);
    const { loading: loadingUpload, error: errorUpload, path } = consultantUploadWk;

    const consultantUpdateWk = useSelector(state => state.consultantUpdateWk);
    const { loading: loadingUpdate, error: errorUpdate, message } = consultantUpdateWk;

    const onChangeHandler = (e) => {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        dispatch(uploadConsultantWk(data));
    };

    const startImportData = () => {
        if (path) {
            dispatch(updateConsultantWk(path));
        }
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Row className='align-items-center'>
                    <Col className='text-center'>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Import consultants data from Wavekeeper
                        </Modal.Title>
                    </Col>
                </Row>
            </Modal.Header>

            <Modal.Body>
                <Row className='mb-3'>
                    <Col><Button className={step >= 0 ? 'text-primary' : 'text-secondary'} onClick={() => setStep(0)} variant='ligth' disabled={step < 0}><strong>1-Guidelines</strong></Button></Col>
                    <Col><Button className={step >= 1 ? 'text-primary' : 'text-secondary'} onClick={() => setStep(1)} variant='ligth' disabled={step < 1}><strong>2-Upload in App</strong></Button></Col>
                    <Col><Button className={step >= 2 ? 'text-primary' : 'text-secondary'} onClick={() => setStep(2)} variant='ligth' disabled={step < 2}><strong>3-Start update</strong></Button></Col>
                    <Col><Button className={step >= 3 ? 'text-primary' : 'text-secondary'} onClick={() => setStep(3)} variant='ligth' disabled={step < 3}><strong>4-Result</strong></Button></Col>
                </Row>

                <Row className='align-items-center'>

                    <Col>
                        {step === 0 && (
                            <Row>
                                <Col>
                                    <h4>Process to export from Wavekeeper <a href="https://wavekeeper.wavestone-app.com/web#action=534&model=hr.presence&view_type=list&cids=1&menu_id=92" target="_blank" rel="noopener noreferrer">(link)</a></h4>
                                    <p>Please connect to Wavekeeper</p>
                                    <ul>
                                        <li>Step 1: Go to collaborators</li>
                                        <li>Step 2: Apply filter to keep only current consultants</li>
                                        <li>Step 3: Select all lines and go to actions / export</li>
                                        <li>Step 4: Select filter 'JPR_export_2'</li>
                                        <li>Step 5: Save the Excel file on you desktop</li>
                                    </ul>
                                    <Image src="/images/WK_export_consultants_application_filtres.jpg" rounded fluid />
                                </Col>
                            </Row>
                        )}
                        {step === 1 && (
                            <Row className='align-items-center'>
                                <Col className='text-center'>
                                    <h4>Upload your file here</h4>
                                    {loadingUpload ? <Loader /> : (
                                        <input 
                                            className='my-3' 
                                            type='file' 
                                            name='hr.presence' 
                                            onChange={onChangeHandler} 
                                        />
                                    )}
                                    {errorUpload && <Message variant='danger'>{errorUpload}</Message>}
                                </Col>
                            </Row>
                        )}
                        {step === 2 && (
                            path ? (
                                <Row>
                                    <Col className='text-center'>
                                        <h4>Do you want to update your consultants ?</h4>
                                        {loadingUpdate ? <Loader /> : (
                                            <Button variant='primary' className='m-3' onClick={startImportData}>
                                                Update
                                            </Button>
                                        )}
                                        <p>Process could take a few minute</p>
                                        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                                    </Col>
                                </Row>
                            ) : (
                                <Row><Col>Something wrong retry step 2</Col></Row>
                            )
                        )}
                        {step === 3 && (
                            <Form.Control
                                as='textarea'
                                rows={10}
                                value={message && message}
                                readOnly
                            //plaintext
                            />
                        )}
                    </Col>
                </Row>


            </Modal.Body>
            <Modal.Footer>
                {step === 3 && (
                    <Button onClick={props.onHide}>Close</Button>
                )}
                {step < 3 && (
                    <Button
                        variant='success'
                        onClick={() => (step + 1 <= 3) && setStep(step + 1)}
                        disabled={step === 3 || (step === 1 && !path) || (step === 2 && !message)}
                    >Next</Button>
                )}
            </Modal.Footer>
        </Modal>
    )
}

export default FlowImportWKConsultants;

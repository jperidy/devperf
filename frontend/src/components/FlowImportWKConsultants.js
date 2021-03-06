import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { uploadConsultantWk, updateConsultantWk } from '../actions/consultantActions';

const FlowImportWKConsultants = (props) => {

    const dispatch = useDispatch();

    const [step, setStep] = useState(0);
    //const [selectedFile, setSelectedFile] = useState(null);

    const consultantUploadWk = useSelector(state => state.consultantUploadWk);
    const { loading:loadingUpload, error:errorUpload, path } = consultantUploadWk;

    const consultantUpdateWk = useSelector(state => state.consultantUpdateWk);
    const { loading: loadingUpdate, error: errorUpdate, message } = consultantUpdateWk;

    const onChangeHandler = (e) => {
        //setSelectedFile(e.target.files[0]);
        const data = new FormData();
        data.append('file', e.target.files[0]);
        dispatch(uploadConsultantWk(data));
    }
    /* const onClickHandler = () => {
        const data = new FormData();
        data.append('file', selectedFile);
        dispatch(uploadConsultantWk(data));
    } */
    const startImportData = () => {
        if(path) {
            dispatch(updateConsultantWk(path));
            //const data = updateConsultantWk(path, userInfo);
            //setMessage(data);
        }
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            //style={{'minHeight': '80vh'}}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Import consultants data from Wavekeeper
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <Row className='mb-5'>
                    <Col><Button className={step >= 0 ? 'text-primary' : 'text-secondary'} onClick={() => setStep(0)} variant='ligth' disabled={step <0}><strong>1-Export from WK</strong></Button></Col>
                    <Col><Button className={step >= 1 ? 'text-primary' : 'text-secondary'} onClick={() => setStep(1)} variant='ligth' disabled={step <1}><strong>2-Upload in App</strong></Button></Col>
                    <Col><Button className={step >= 2 ? 'text-primary' : 'text-secondary'} onClick={() => setStep(2)} variant='ligth' disabled={step <2}><strong>3-Start update</strong></Button></Col>
                    <Col><Button className={step >= 3 ? 'text-primary' : 'text-secondary'} onClick={() => setStep(3)} variant='ligth' disabled={step <3}><strong>4-Result</strong></Button></Col>
                </Row>
                
                <Row className='align-items-center'>
                    <Col xs={2}>
                        <Button 
                            variant='secondary'
                            onClick={() => (step-1 >= 0) && setStep(step-1) }
                            disabled={step === 0}
                        >Back</Button>
                    </Col>
                    
                    <Col xs={8}>
                    {step === 0 && (
                        <Row>
                            <Col>
                                <h4>Import Wavekeeper Data</h4>
                                <p>Process to describe</p>
                                <p>Image to integer</p>
                            </Col>
                        </Row>
                    )}
                    {step === 1 && (
                        <Row className='align-items-center'>
                            <Col>
                                <span><strong>Upload file: </strong></span>
                                <input type='file' name='hr.presence' onChange={onChangeHandler} />
                            </Col>
                        </Row>
                    )}
                    {step === 2 && (
                        path ? (
                            <Row>
                                <Col>
                                    <span><strong>Start update</strong></span>
                                    <Button variant='primary' className='mx-3' onClick={startImportData}>
                                        {loadingUpdate ? <Loader /> : 'Update'}
                                    </Button>
                                </Col>
                            </Row>
                        ) : (
                            <Row><Col>Something wrong retry step 2</Col></Row>
                        )
                    )}
                    {step === 3 && (
                        message && message.data.length > 0 ? message.data.map((line, incr) => (
                            <Row key={incr} >
                                <Col>
                                    <Message variant='warning'>{line.message}</Message>
                                </Col>
                            </Row>
                        )) : (
                            <Row>
                                <Col>
                                    <Message variant='success'>Success data imported!</Message>
                                </Col>
                            </Row>
                        )
                    )}
                    </Col>
                    <Col xs={2}>
                        <Button 
                            variant='secondary'
                            onClick={() => (step+1 <= 3) && setStep(step+1) }
                            disabled={step === 3 || (step === 1 && !path) || (step === 2 && !message)}
                        >Next</Button></Col>
                </Row>
                
                    
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default FlowImportWKConsultants;

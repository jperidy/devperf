import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Message from '../components/Message';
import Loader from '../components/Loader';
//import { uploadConsultantWk, updateConsultantWk } from '../actions/consultantActions';
import Form from 'react-bootstrap/Form';
import { pxxUploadFiles, updatePxxFiles } from '../actions/pxxActions';

const FlowImportPxx = (props) => {

    const dispatch = useDispatch();

    const [step, setStep] = useState(0);

    const pxxUploadFile = useSelector(state => state.pxxUploadFile);
    const { loading:loadingUpload, error:errorUpload, path } = pxxUploadFile;

    const updatePxx = useSelector(state => state.updatePxx);
    const { loading: loadingUpdate, error: errorUpdate, message } = updatePxx;

    const onChangeHandler = (e) => {
        //const data = new FormData();
        const files = [];
        for (let incr = 0; incr < e.target.files.length; incr++) {
            const file = e.target.files[incr];
            if(file.name.match(/^p[A-Za-z]+-[0-9]{2}.xlsb|^p[A-Za-z]+-arrivees.xlsb/)) {
                //console.log(file.name);
                const data = new FormData();
                data.append('file', file);
                files.push(data);
            }
        }
        //data.append('file', e.target.files[0]);
        //console.log(files)
        //data.append('file[]', files);

        //console.log(data);
        //dispatch(pxxUploadFiles(data));
        dispatch(pxxUploadFiles(files));
    }

    const startImportData = () => {
        if(path) {
            dispatch(updatePxxFiles(path));
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
                <Row className='align-items-center'>
                    <Col className='text-center'>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Import Pxx from Pxx directory
                        </Modal.Title>
                    </Col>
                </Row>
            </Modal.Header>
            
            <Modal.Body>
                <Row className='mb-3'>
                    <Col><Button className={step >= 0 ? 'text-primary' : 'text-secondary'} onClick={() => setStep(0)} variant='ligth' disabled={step <0}><strong>1-Guidelines</strong></Button></Col>
                    <Col><Button className={step >= 1 ? 'text-primary' : 'text-secondary'} onClick={() => setStep(1)} variant='ligth' disabled={step <1}><strong>2-Upload in App</strong></Button></Col>
                    <Col><Button className={step >= 2 ? 'text-primary' : 'text-secondary'} onClick={() => setStep(2)} variant='ligth' disabled={step <2}><strong>3-Start update</strong></Button></Col>
                    <Col><Button className={step >= 3 ? 'text-primary' : 'text-secondary'} onClick={() => setStep(3)} variant='ligth' disabled={step <3}><strong>4-Result</strong></Button></Col>
                </Row>
                
                <Row className='align-items-center'>
                    
                    <Col>
                    {step === 0 && (
                        <Row>
                            <Col>
                                <h4>Process to upload pxx and update availabilities</h4>
                                    <p>In the next steps you will be invit to</p>
                                    <ul>
                                            <li>Select your Pxx storage directory</li>
                                            <li>Wait untill all Pxx files are uploaded</li>
                                            <li>Start the backend calculation to update availabilities</li>
                                            <li>Check the results and if asked proceed to corrections</li>
                                        </ul>  
                            </Col>
                        </Row>
                    )}
                    {step === 1 && (
                        <Row className='align-items-center'>
                            <Col className='text-center'>
                                <h4>Upload you file here</h4>
                                {loadingUpload ? <Loader /> : (
                                    <input 
                                        className='my-3' 
                                        type='file' 
                                        name='file' 
                                        onChange={onChangeHandler} 
                                        webkitdirectory='true'
                                        directory='true'
                                        multiple
                                    />
                                )}
                            </Col>
                        </Row>
                    )}
                    {step === 2 && (
                        path ? (
                            <Row>
                                <Col className='text-center'>
                                    <h4>Do you want to update availabilities ?</h4>
                                    <Button variant='primary' className='m-3' onClick={startImportData}>
                                        {loadingUpdate ? <Loader /> : 'Update'}
                                    </Button>
                                    <p>Process could take a few minute</p>
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

export default FlowImportPxx;

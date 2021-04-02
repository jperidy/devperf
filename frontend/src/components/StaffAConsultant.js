import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ViewStaffs from '../components/ViewStaffs';
import ViewOldStaffs from '../components/ViewOldStaffs';
import SkillsDetails from './SkillsDetails';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import { getConsultantCdm } from '../actions/consultantActions';
import DisplayChildren from '../components/DisplayChildren';


const StaffAConsultant = ({ history, onHide, show, consultant, loadingData={}, mode, addStaffHandler }) => {

    const dispatch = useDispatch();

    const [sdResponsability, setSdResponsability] = useState(loadingData.responsability ? loadingData.responsability : '');
    const [sdPriority, setSdPriority] = useState(loadingData.priority ? loadingData.priority : '');
    const [sdInformation, setSdInformation] = useState(loadingData.information ? loadingData.information : '');
    //console.log('consultant', consultant)


    const consultantGetCdm = useSelector(state => state.consultantGetCdm);
    const { cdm } = consultantGetCdm;

    useEffect(() => {
        if(show) {
            dispatch(getConsultantCdm(consultant._id))
        }
    }, [dispatch, consultant, show])

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
                    {consultant.name ? consultant.name + ' - ' + consultant.grade + (cdm ? ' (' + cdm.name + ')' : '') : ''}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {mode === 'staffing' && (
                    <DisplayChildren access='editStaff'>
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
                    </DisplayChildren>
                )}

                <DisplayChildren access='viewSkills'>
                    <SkillsDetails
                        consultantId={consultant._id}
                        editable={false}
                        close={(mode === 'consultation') ? false : true}
                    />
                </DisplayChildren>

                <DisplayChildren access='viewStaffings'>
                    <DropDownTitleContainer title='Others staffings' close={false}>
                        <ViewStaffs
                            history={history}
                            consultantId={consultant._id}
                            onNavigate={onHide}
                        />
                    </DropDownTitleContainer>
                </DisplayChildren>

                <DropDownTitleContainer title='Old staffings' close={true}>
                    <ViewOldStaffs
                        history={history}
                        consultantId={consultant._id}
                        onNavigate={onHide}
                    />
                </DropDownTitleContainer>
                
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={onHide} variant='secondary'>Cancel</Button>
                <DisplayChildren access='editStaff'>
                    {mode === 'staffing' && (
                        <Button
                            onClick={() => {
                                addStaffHandler(consultant, sdResponsability, sdPriority, sdInformation);
                                onHide();
                            }}
                            variant='primary'
                            disabled={!(sdResponsability !== '' && sdPriority !== '')}
                        >Staff</Button>
                    )}
                </DisplayChildren>
            </Modal.Footer>

        </Modal>
    )
}

export default StaffAConsultant;

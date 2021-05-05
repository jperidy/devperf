import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { getAvailabilities } from '../actions/pxxActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import StaffAConsultant from './StaffAConsultant';
import DisplayChildren from '../components/DisplayChildren';
import SelectComponent from '../components/SelectComponent';

import SelectInput from '../components/SelectInput';
import { getAllSkills } from '../actions/skillActions';

const ConsoDispo = ({ 
    //practice, 
    start, end, mode, addStaffHandler, history }) => {

    const dispatch = useDispatch();

    const [focus, setFocus] = useState('');
    const [searchExperienceStart, setSearchExperienceStart] = useState('');
    const [searchExperienceEnd, setSearchExperienceEnd] = useState('');
    const [practice, setPractice] = useState('');

    const [searchSkillsList, setSearchSkillsList] = useState([]);

    const [searchMode, setSearchMode] = useState('filterAvailable');

    const [modalWindowShow, setModalWindowShow] = useState(false);
    const [sdConsultant, setSdConsultant] = useState('');

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const pxxAvailabilities = useSelector(state => state.pxxAvailabilities);
    const { loading: loadingAvailabilities, error: errorAvailabilities, availabilities } = pxxAvailabilities;

    const skillList = useSelector(state => state.skillList);
    const { skills } = skillList;

    useEffect(() => {
        if(userInfo) {
            setPractice(userInfo.consultantProfil.practice);
        }
    }, [userInfo]);

    useEffect(() => {
        if (practice) {
            dispatch(getAvailabilities(practice, start, end, searchSkillsList.map(skill => skill.value).join(';'), searchExperienceStart, searchExperienceEnd, searchMode));
        }
    }, [dispatch, practice, start, end, searchMode, searchSkillsList, searchExperienceStart, searchExperienceEnd]);

    useEffect(() => {
        dispatch(getAllSkills('','',1,10000));
    },[dispatch]);

    const removeFilterAction = () => {
        setSearchSkillsList([]);
        setSearchExperienceStart('');
        setSearchExperienceEnd('');
        //dispatch(getAvailabilities(practice, start, end, '', '', '', searchMode));
    };

    const handlerSkillsSubmit = (e) => {
        e.preventDefault();
        dispatch(getAvailabilities(practice, start, end, searchSkillsList.map(skill => skill.value).join(';'), searchExperienceStart, searchExperienceEnd, searchMode));
    };

    const moreConsultantDetails = (consultant) => {
        setModalWindowShow(true);
        setSdConsultant(consultant);
    };

    return (
        <>
            {modalWindowShow && (
                <StaffAConsultant
                    show={modalWindowShow}
                    onHide={() => setModalWindowShow(false)}
                    consultant={sdConsultant}
                    mode={mode}
                    addStaffHandler={addStaffHandler}
                    history={history}
                />
            )}

            <Row className='mt-5'>
                <Col>
                    <Form.Group controlId='switch-practices' className='my-0'>
                        <Form.Check
                            type='switch'
                            id='switch-all-practices'
                            label='All practices'
                            checked={practice === 'all' ? true : false}
                            onChange={(e) => { e.target.checked === true ? setPractice('all') : setPractice(userInfo.consultantProfil.practice) }}
                        ></Form.Check>
                    </Form.Group>
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col md={12}>
                    <Form onSubmit={handlerSkillsSubmit}>

                        <Form.Row className='align-items-center mb-3'>
                            <Col md={1}>
                                {( searchExperienceStart || searchExperienceEnd) ? (
                                    <Button 
                                        variant='secondary'
                                        onClick={removeFilterAction}
                                        block
                                    ><i className="fas fa-minus-circle"></i></Button>
                                ) : (
                                    <Button 
                                        variant='primary'
                                        disabled
                                        block
                                    ><i className="fas fa-keyboard"></i></Button>
                                )}
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId='skill-search' className='my-0'>
                                    <SelectInput
                                        options={skills ? skills.map(skill => ({ value: skill._id, label: skill.name })) : []}
                                        value={searchSkillsList.length ? searchSkillsList.map(skill => ({ value: skill._id, label: skill.value })) : []}
                                        setValue={setSearchSkillsList}
                                        multi={true}
                                        disabled={false}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={2}>
                                <Form.Group controlId='experience-search-start' className='my-0'>
                                    <Form.Control
                                        type='number'
                                        min={0}
                                        step={0.5}
                                        placeholder='From (year)'
                                        value={searchExperienceStart && searchExperienceStart}
                                        onChange={(e) => setSearchExperienceStart(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={2}>
                                <Form.Group controlId='experience-search-end' className='my-0'>
                                    <Form.Control
                                        type='number'
                                        step={0.5}
                                        min={searchExperienceStart || 0}
                                        placeholder='To (year)'
                                        value={searchExperienceEnd && searchExperienceEnd}
                                        onChange={(e) => setSearchExperienceEnd(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={2}>
                                <Form.Group controlId='switch-only-available'  className='my-0'>
                                    <SelectComponent 
                                        editRequest={true}
                                        label=''
                                        id='select-filter'
                                        value={searchMode}
                                        onChange={setSearchMode}
                                        required={true}
                                        options={
                                            <>
                                                <option value='filterAvailable'>Is available</option>
                                                <option value='notAvailable'>Is not available</option>
                                                <option value='notProd'>Has not prod</option>
                                            </>
                                        }
                                    />
                                    {/* <Form.Check
                                        type='switch'
                                        id='switch-only-available'
                                        label='Not available'
                                        checked={searchMode === 'filterAvailable' ? false : true}
                                        onChange={(e) => {e.target.checked === true ? setSearchMode('all') : setSearchMode('filterAvailable')}}
                                    ></Form.Check> */}
                                </Form.Group>

                            </Col>

                            <Col md={1}>
                                <Button
                                    type='submit'
                                    variant='primary'
                                    block
                                >Search</Button>
                            </Col>
                        </Form.Row>
                    </Form>

                </Col>
            </Row>

            <Tabs defaultActiveKey="Analysts" id="uncontrolled-tab-example">
                <Tab eventKey="Intern" title="Intern">
                    <Row className='mt-3'>
                        {loadingAvailabilities ? <Loader /> : errorAvailabilities ? <Message variant='danger'>{errorAvailabilities}</Message> : (
                            availabilities && availabilities.map((x, xVal) => (
                                <Col sm={12} md={4} key={xVal}>
                                    <ConsoDispoUnit
                                        monthData={x}
                                        grades={['Intern']}
                                        mode={mode}
                                        //addStaff={addStaff}
                                        addStaff={moreConsultantDetails}
                                        focus={focus}
                                        setFocus={setFocus}
                                    />
                                </Col>
                            ))
                        )}
                    </Row>
                </Tab>

                <Tab eventKey="Analysts" title="Analysts">
                    <Row className='mt-3'>
                        {loadingAvailabilities ? <Loader /> : errorAvailabilities ? <Message variant='danger'>{errorAvailabilities}</Message> : (
                            availabilities && availabilities.map((x, xVal) => (
                                <Col key={xVal} sm={12} md={4}>
                                    <ConsoDispoUnit
                                        monthData={x}
                                        grades={['Analyst']}
                                        mode={mode}
                                        //addStaff={addStaff}
                                        addStaff={moreConsultantDetails}
                                        focus={focus}
                                        setFocus={setFocus}
                                    />
                                </Col>
                            ))
                        )}
                    </Row>
                </Tab>

                <Tab eventKey="Consultants" title="Consultants">
                    <Row className='mt-3'>
                        {loadingAvailabilities ? <Loader /> : errorAvailabilities ? <Message variant='danger'>{errorAvailabilities}</Message> : (
                            availabilities && availabilities.map((x, xVal) => (
                                <Col key={xVal} sm={12} md={4}>
                                    <ConsoDispoUnit
                                        monthData={x}
                                        grades={['Consultant']}
                                        mode={mode}
                                        //addStaff={addStaff}
                                        addStaff={moreConsultantDetails}
                                        focus={focus}
                                        setFocus={setFocus}
                                    />
                                </Col>
                            ))
                        )}
                    </Row>
                </Tab>

                <Tab eventKey="Senior consultants" title="Senior consultants">
                    <Row className='mt-3'>
                        {loadingAvailabilities ? <Loader /> : errorAvailabilities ? <Message variant='danger'>{errorAvailabilities}</Message> : (
                            availabilities && availabilities.map((x, xVal) => (
                                <Col key={xVal} sm={12} md={4}>
                                    <ConsoDispoUnit
                                        monthData={x}
                                        grades={['Senior consultant']}
                                        mode={mode}
                                        //addStaff={addStaff}
                                        addStaff={moreConsultantDetails}
                                        focus={focus}
                                        setFocus={setFocus}
                                    />
                                </Col>
                            ))
                        )}
                    </Row>
                </Tab>

                <Tab eventKey="Managers" title="Managers and +">
                    <Row className='mt-3'>
                        {loadingAvailabilities ? <Loader /> : errorAvailabilities ? <Message variant='danger'>{errorAvailabilities}</Message> : (
                            availabilities && availabilities.map((x, xVal) => (
                                <Col key={xVal} sm={12} md={4}>
                                    <ConsoDispoUnit
                                        monthData={x}
                                        grades={['Manager', 'Senior manager', 'Director', 'Partner']}
                                        mode={mode}
                                        //addStaff={addStaff}
                                        addStaff={moreConsultantDetails}
                                        focus={focus}
                                        setFocus={setFocus}
                                    />
                                </Col>
                            ))
                        )}
                    </Row>
                </Tab>
            </Tabs>
        </>
    )
}


const ConsoDispoUnit = ({monthData, grades, mode, addStaff, focus, setFocus}) => {

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    
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

    const calculateExperience = (date) => {

        if (date) {
            return ((Date.now() - new Date(date)) / (1000 * 24 * 3600 * 365.25)).toString().substring(0, 4)
        } else {
            return '-';
        }
    }

    return (
        <Card className='my-1 rounded' >
            <Card.Header as="h5">{monthData.month.firstDay.toString().substring(0, 7)}</Card.Header>
            <Card.Body>
                {monthData.availabilities.map((consultantData, yVal) => (
                    grades.includes(consultantData.grade) && (
                        <Row key={yVal} className='align-items-middle'>
                            {(mode === 'staffing' || mode === 'consultation') && (
                                <Col sm={1}>
                                    <Button
                                        size='sm'
                                        variant='ligth'
                                        className='mx-0 px-0'
                                        onClick={() => addStaff(consultantData)}
                                    ><i className="fas fa-search"></i></Button>
                                </Col>
                            )}
                            <Col sm={10}>

                                <OverlayTrigger
                                    overlay={
                                        <Tooltip id="tooltip-disabled" html="true">
                                            <DisplayChildren access='viewComment'>
                                                {userInfo && userInfo.consultantProfil._id !== consultantData._id ? (
                                                    (
                                                        <div>
                                                            <div><p className='m-0 p-0 text-left'><strong>Information</strong></p>{consultantData.comment && consultantData.comment.split('\n').map((x, val) => (<p key={val} className='m-0 p-0 text-left'>{x}</p>))}</div>
                                                            <div><p className='m-0 mt-3 p-0 text-left'><strong>Availability comment</strong></p>{consultantData.availabilityComment && consultantData.availabilityComment.split('\n').map((x, val) => (<p key={val} className='m-0 p-0 text-left'>{x}</p>))}</div>
                                                            <div><p className='m-0 mt-3 p-0 text-left'><strong>Not Prod comment</strong></p>{consultantData.notProdComment && consultantData.notProdComment.split('\n').map((x, val) => (<p key={val} className='m-0 p-0 text-left'>{x}</p>))}</div>
                                                        </div>
                                                    )
                                                ) : 'No access to this data'}
                                            </DisplayChildren>
                                        </Tooltip>
                                    }>
                                    <Form.Control
                                        plaintext
                                        readOnly
                                        id={consultantData.email}
                                        value={consultantData.availableDay.toString() + ' days : ' + formatName(consultantData.name) + ' (' + calculateExperience(consultantData.valued) + ' years)'}
                                        style={(consultantData.email === focus) ? { background: '#464277', color: 'white' } : { color: 'black' }}
                                        onFocus={(e) => {
                                            setFocus(e.target.id)
                                        }}
                                    />
                                </OverlayTrigger>

                            </Col>
                        </Row>
                    )
                ))}
            </Card.Body>
        </Card>
    )
}


export default ConsoDispo

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup';
import PxxEditor from '../components/PxxEditor';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import ConsultantsTab from '../components/ConsultantsTab';
import Message from '../components/Message';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import { getAllMyConsultants, updateComment, updateMyConsultant } from '../actions/consultantActions';
import { Container, FormControl, InputGroup } from 'react-bootstrap';
import { setConsultantFocus } from '../actions/consultantActions';
import ViewStaffs from '../components/ViewStaffs';
import ViewOldStaffs from '../components/ViewOldStaffs';
import SkillsDetails from '../components/SkillsDetails';
import DisplayChildren from '../components/DisplayChildren';

const PxxEditScreen = ({ history }) => {

    const dispatch = useDispatch();

    const [commentText, setCommentText] = useState('');
    const [trObjectives, setTrObjectives] = useState('');
    //const [myObjectives, setMyObjectives] = useState('');
    const [availabilityComment, setAvailabilityComment] = useState('');
    const [notProdComment, setNotProdComment] = useState('');

    const [delegateOption, setDelegationOption] = useState(false);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantsMyList = useSelector(state => state.consultantsMyList);
    const { loading: loadingConsultantsMyList, error: errorConsultantsMyList, consultantsMy, focus } = consultantsMyList;


    const [searchDate, setSearchDate] = useState(new Date(Date.now()));

    useEffect(() => {

        if (!userInfo) {
            history.push('/login');
        }
    }, [history, userInfo]);


    useEffect(() => {
        // Effect to start loading my consultants and then to update every time focus change
        const option = delegateOption ? 'delegate' : '';
        //console.log('option', option);
        dispatch(getAllMyConsultants(option));
    }, [dispatch, focus, delegateOption])

    useEffect(() => {
        if (consultantsMy) {
            setCommentText(consultantsMy[focus].comment);
            //setMyObjectives(consultantsMy[focus].personalObjectives);
            setTrObjectives(consultantsMy[focus].talentReviewObjectives);
            setNotProdComment(consultantsMy[focus].notProdComment);
            setAvailabilityComment(consultantsMy[focus].availabilityComment);
        }
    }, [consultantsMy, focus]);

    const navigationMonthHandler = (value) => {
        const navigationDate = new Date(searchDate);
        navigationDate.setMonth(navigationDate.getMonth() + value);
        setSearchDate(navigationDate);
    }

    const navigationConsultantHandler = (value) => {

        if (((focus + value) >= 0) && ((focus + value) < consultantsMy.length)) {
            dispatch(setConsultantFocus(focus + value));
        }
    }

    const updateCommentHandler = (consultantId, value) => {
        dispatch(updateComment(consultantId, value));
    }

    return (

        <Container>
            <Meta />
            {loadingConsultantsMyList ? <Loader /> :
                errorConsultantsMyList ? <Message variant='danger'>{errorConsultantsMyList}</Message>
                    : !consultantsMy || consultantsMy.length === 0 ?
                        <Message variant='info'>You don't have consultant to edit yet</Message> : (
                            <>
                                <div className='border-bottom p-3'>
                                    <Row>
                                        <Col className="text-center" xs={2}>
                                            <Button
                                                variant='primary'
                                                size='sm'
                                                onClick={() => navigationConsultantHandler(-1)}
                                                disabled={focus === 0}
                                            ><i className="fas fa-caret-left"></i>
                                            </Button>
                                        </Col>
                                        <Col className="text-center" xs={8}>
                                            <LinkContainer to={`/editconsultant/${consultantsMy[focus]._id}`}>
                                                <Nav.Link>
                                                    <h4>{consultantsMy[focus].name} <i>({consultantsMy[focus].matricule})</i></h4>
                                                </Nav.Link>
                                            </LinkContainer>
                                        </Col>
                                        <Col className="text-center" xs={2}>
                                            <Button
                                                variant='primary'
                                                size='sm'
                                                onClick={() => navigationConsultantHandler(1)}
                                                disabled={focus === consultantsMy.length - 1}
                                            ><i className="fas fa-caret-right"></i>
                                            </Button>
                                        </Col>
                                    </Row>

                                    <Row className='mt-3'>
                                        <Col xs={12} md={4}>
                                            <ListGroup>
                                            <ListGroup.Item>
                                                <Row className="my-3">
                                                    <Col className="text-left"><b>Arrival:</b> {consultantsMy[focus].arrival && consultantsMy[focus].arrival.substring(0, 10)}</Col>
                                                    <Col className="text-left"><b>Valued:</b> {consultantsMy[focus].valued && consultantsMy[focus].valued.substring(0, 10)}</Col>
                                                    <Col className="text-left"><b>Leaving:</b> {consultantsMy[focus].leaving && consultantsMy[focus].leaving.substring(0, 10)}</Col>
                                                </Row>
                                                <Row className="my-3">
                                                    <Col><b>Seniority:</b> {((new Date(Date.now()) - new Date(consultantsMy[focus].arrival.substring(0, 10))) / (1000 * 3600 * 24 * 365.25)).toString().substring(0, 4)} years</Col>
                                                </Row>

                                                <Row className="my-3">
                                                    <Col>
                                                        {!(consultantsMy[focus]._id === userInfo.consultantProfil._id) && (
                                                            <>
                                                                <label htmlFor="comment"><strong>Staffing comment</strong></label>
                                                                <InputGroup>
                                                                    <FormControl
                                                                        as='textarea'
                                                                        size='sm'
                                                                        rows={7}
                                                                        id='comment'
                                                                        value={commentText}
                                                                        placeholder='Please enter a comment'
                                                                        onChange={(e) => {
                                                                            setCommentText(e.target.value);
                                                                            updateCommentHandler(consultantsMy[focus]._id, e.target.value)
                                                                        }}
                                                                    ></FormControl>
                                                                </InputGroup>
                                                            </>
                                                        )}

                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            </ListGroup>
                                        </Col>

                                        <Col xs={12} md={8}>
                                            <PxxEditor
                                                consultantsMy={consultantsMy}
                                                consultantFocus={focus}
                                                searchDate={searchDate}
                                                navigationMonthHandler={navigationMonthHandler}
                                            />
                                        </Col>
                                    </Row>
                                </div>

                                <div className='border-bottom p-3'>
                                    <Row>
                                    <Col xs={12} md={4}>
                                        <label htmlFor="annual-objectives"><strong>Annual objectives</strong></label>
                                            <InputGroup>
                                                <FormControl
                                                    as='textarea'
                                                    size='sm'
                                                    rows={3}
                                                    id='annual-objectives'
                                                    value={trObjectives}
                                                    placeholder='Please complete with your CDM'
                                                    onChange={(e) => {
                                                        setTrObjectives(e.target.value);
                                                        dispatch(updateMyConsultant({
                                                            ...consultantsMy[focus], 
                                                            //personalObjectives: myObjectives,
                                                            talentReviewObjectives: e.target.value,
                                                            notProdComment: notProdComment,
                                                            availabilityComment: availabilityComment
                                                        }))
                                                        //updateCommentHandler(consultantsMy[focus]._id, e.target.value)
                                                    }}
                                                ></FormControl>
                                            </InputGroup>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <label htmlFor="not-prod-comment"><strong>Not production justification</strong></label>
                                            <InputGroup>
                                                <FormControl
                                                    as='textarea'
                                                    size='sm'
                                                    rows={3}
                                                    id='not-prod-comment'
                                                    value={notProdComment}
                                                    placeholder='Please justify not production time. For example:&#10;- 3d-june: inter-contrat&#10;- 1d/Week: business&#10;- etc.'
                                                    onChange={(e) => {
                                                        setNotProdComment(e.target.value);
                                                        dispatch(updateMyConsultant({
                                                            ...consultantsMy[focus], 
                                                            //personalObjectives: e.target.value,
                                                            talentReviewObjectives: trObjectives,
                                                            notProdComment: e.target.value,
                                                            availabilityComment: availabilityComment
                                                        }));
                                                        //updateCommentHandler(consultantsMy[focus]._id, e.target.value)
                                                    }}
                                                ></FormControl>
                                            </InputGroup>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <label htmlFor="availability-comment"><strong>Availability comment</strong></label>
                                            <InputGroup>
                                                <FormControl
                                                    as='textarea'
                                                    size='sm'
                                                    rows={3}
                                                    id='availability-comment'
                                                    value={availabilityComment}
                                                    placeholder='Please share any information on your availability. For example: end of mission the 23th of October > 2d/5 available'
                                                    onChange={(e) => {
                                                        setAvailabilityComment(e.target.value);
                                                        dispatch(updateMyConsultant({
                                                            ...consultantsMy[focus], 
                                                            //personalObjectives: e.target.value,
                                                            talentReviewObjectives: trObjectives,
                                                            notProdComment: notProdComment,
                                                            availabilityComment: e.target.value
                                                        }));
                                                        //updateCommentHandler(consultantsMy[focus]._id, e.target.value)
                                                    }}
                                                ></FormControl>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </div>

                                <Row>
                                    <Col>
                                        <DisplayChildren access='viewStaffings'>
                                            <DropDownTitleContainer title='Staffings on track' close={false}>
                                                <ViewStaffs
                                                    history={history}
                                                    consultantId={consultantsMy[focus]._id}
                                                />
                                            </DropDownTitleContainer>
                                        </DisplayChildren>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <DropDownTitleContainer title='Old staffings' close={true}>
                                            <ViewOldStaffs
                                                history={history}
                                                consultantId={consultantsMy[focus]._id}
                                            />
                                        </DropDownTitleContainer>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col>
                                        <DisplayChildren access='viewSkills'>
                                            <SkillsDetails consultantId={consultantsMy[focus]._id} />
                                        </DisplayChildren>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <DisplayChildren access='viewOthersConsultants'>
                                            <DropDownTitleContainer title='Others consultants' close={false}>
                                                <Form.Group controlId='switch-only-available' className='mt-3'>
                                                    <Form.Check
                                                        type='switch'
                                                        id='switch-delegation'
                                                        label='View delegation'
                                                        checked={delegateOption}
                                                        onChange={(e) => { e.target.checked === true ? setDelegationOption(true) : setDelegationOption(false) }}
                                                    ></Form.Check>
                                                </Form.Group>
                                                <ConsultantsTab
                                                    consultantsMy={consultantsMy}
                                                    history={history}
                                                    focusActive={true}
                                                />
                                            </DropDownTitleContainer>
                                        </DisplayChildren>
                                    </Col>
                                </Row>
                            </>
                        )}
        </Container>
    )
}

export default PxxEditScreen;

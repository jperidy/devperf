import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup';
//import ConsultantSelector from '../components/ConsultantSelector';
import PxxEditor from '../components/PxxEditor';
import ConsultantsTab from '../components/ConsultantsTab';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getAllMyConsultants } from '../actions/consultantActions';
import { Container } from 'react-bootstrap';
import { setConsultantFocus } from '../actions/consultantActions';
import ConsultantComment from '../components/ConsultantComment';

const PxxEditScreen = ({ history }) => {

    const dispatch = useDispatch();


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
        dispatch(getAllMyConsultants());
    }, [dispatch, focus])

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

    return (

        <Container>
            {loadingConsultantsMyList ? <Loader /> :
                errorConsultantsMyList ? <Message variant='danger'>{errorConsultantsMyList}</Message>
                    : !consultantsMy || consultantsMy.length === 0 ?
                        <Message variant='info'>You don't have consultant to edit yet</Message> : (
                            <>
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
                                                <b>{consultantsMy[focus].name} <i>({consultantsMy[focus].matricule})</i></b>
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
                                                {<ConsultantComment
                                                    comment={consultantsMy[focus].comment}
                                                    consultantId={consultantsMy[focus]._id}
                                                />}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

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

                                <Row className="pt-5">
                                    <ConsultantsTab
                                        consultantsMy={consultantsMy}
                                        history={history}
                                        focusActive={true}
                                    />
                                </Row>
                            </>
                        )}
        </Container>
    )
}

export default PxxEditScreen;

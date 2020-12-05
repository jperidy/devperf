import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import PxxComment from '../components/PxxComment';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getAllMyConsultants } from '../actions/consultantActions';
import { Nav } from 'react-bootstrap';

const ConsultantSelector = ({ consultantFocus, setConsultantFocus }) => {

    const dispatch = useDispatch();

    const consultantsMyList = useSelector(state => state.consultantsMyList);
    const { loading: loadingConsultantsMyList, error: errorConsultantsMyList, consultantsMy } = consultantsMyList;

    
    const navigationConsultantHandler = (value) => {
        if (((consultantFocus + value) >= 0) && ((consultantFocus + value) < consultantsMy.length)) {
            setConsultantFocus(consultantFocus + value);
            dispatch(getAllMyConsultants());
        }
    }

    return (
        <>
            {loadingConsultantsMyList ? <Loader /> : errorConsultantsMyList ? <Message variant='danger'>{errorConsultantsMyList}</Message> : (
                <>
                    <Row>
                        <Col className="text-center" xs={2}>
                            <Button
                                variant='primary'
                                size='sm'
                                onClick={() => navigationConsultantHandler(-1)}
                                disabled={consultantFocus === 0}
                            ><i className="fas fa-caret-left"></i>
                            </Button>
                        </Col>
                        <Col className="text-center" xs={8}>
                            <LinkContainer to={`/editconsultant/${consultantsMy[consultantFocus]._id}`}>
                                <Nav.Link>
                                <b>{consultantsMy[consultantFocus].name} <i>({consultantsMy[consultantFocus].matricule})</i></b>
                                </Nav.Link>
                            </LinkContainer>
                        </Col>
                        <Col className="text-center" xs={2}>
                            <Button
                                variant='primary'
                                size='sm'
                                onClick={() => navigationConsultantHandler(1)}
                                disabled={consultantFocus === consultantsMy.length - 1}
                            ><i className="fas fa-caret-right"></i>
                            </Button>
                        </Col>
                    </Row>
                    <Row className="my-3">
                        <Col className="text-left"><b>Arrival:</b> {consultantsMy[consultantFocus].arrival.substring(0,10)}</Col>
                        <Col className="text-left"><b>Leaving:</b> {consultantsMy[consultantFocus].leaving.substring(0,10)}</Col>
                    </Row>
                    <Row className="my-3">
                        <Col><b>Seniority:</b> {consultantsMy[consultantFocus].seniority.substring(0,4)} years</Col>
                    </Row>
                    <Row className="my-3">
                        <Col>
                            {<PxxComment 
                                comment={consultantsMy[consultantFocus].comment}
                                consultantId={consultantsMy[consultantFocus]._id} />}
                        </Col>
                    </Row>
                </>

            )}

        </>
    )
}

export default ConsultantSelector;

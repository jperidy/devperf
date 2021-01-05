import React from 'react';
import { useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import ConsultantComment from './ConsultantComment';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { Nav } from 'react-bootstrap';
import { setConsultantFocus } from '../actions/consultantActions';

//const ConsultantSelector = ({ consultantFocus, setConsultantFocus }) => {
const ConsultantSelector = ({ consultantsMy, focus }) => {

    const dispatch = useDispatch();

    //const [commentUpdated, setCommentUpdated] = useState(false);

    const navigationConsultantHandler = (value) => {

        if (((focus + value) >= 0) && ((focus + value) < consultantsMy.length)) {
            dispatch(setConsultantFocus(focus + value));
            //setFocus(focus + value);
        }
    }

    return (
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
                    //disabled={consultantFocus === consultantsMy.length - 1}
                    ><i className="fas fa-caret-right"></i>
                    </Button>
                </Col>
            </Row>
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
                        //setCommentUpdated={setCommentUpdated}
                    />}
                </Col>
            </Row>

        </>
    )
}

export default ConsultantSelector;

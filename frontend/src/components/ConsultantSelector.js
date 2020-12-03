import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PxxComment from '../components/PxxComment';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getAllMyConsultants } from '../actions/consultantActions';

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
                                variant='secondary'
                                onClick={() => navigationConsultantHandler(-1)}
                                disabled={consultantFocus === 0}
                            ><i className="fas fa-caret-left"></i>
                            </Button>
                        </Col>
                        <Col className="text-center" xs={8}>
                            <h3>
                                {consultantsMy[consultantFocus].name} <i>({consultantsMy[consultantFocus].matricule})</i>
                            </h3>
                        </Col>
                        <Col className="text-center" xs={2}>
                            <Button
                                variant='secondary'
                                onClick={() => navigationConsultantHandler(1)}
                                disabled={consultantFocus === consultantsMy.length - 1}
                            ><i className="fas fa-caret-right"></i>
                            </Button>
                        </Col>
                    </Row>
                    <Row className="my-3">
                        <Col className="text-left">Arrival: {consultantsMy[consultantFocus].arrival}</Col>
                        <Col className="text-left">Leaving: {consultantsMy[consultantFocus].leaving}</Col>
                    </Row>
                    <Row className="my-3">
                        <Col>Seniority: {consultantsMy[consultantFocus].seniority} years</Col>
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

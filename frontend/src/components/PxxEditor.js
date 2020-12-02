import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Message from '../components/Message';
import Loader from '../components/Loader';
import PxxUserLine from '../components/PxxUserLine';
import { getMyConsultantPxxToEdit } from '../actions/pxxActions';

const PxxEditor = ({consultantFocus}) => {

    const dispatch = useDispatch();

    const [searchDate, setSearchDate] = useState(Date.now()); //match.params.dateId
    const [numberOfMonth, setNumberOfMonth] = useState(3);

    const consultantsMyList = useSelector(state => state.consultantsMyList);
    const { loading: loadingConsultantsMyList, error: errorConsultantsMyList, consultantsMy } = consultantsMyList;

    const pxxMyToEditReducer = useSelector(state => state.pxxMyToEdit);
    const { loading: loadingConsultantMyToEdit, error: errorConsultantMyToEdit, pxx } = pxxMyToEditReducer;

    useEffect(() => {
        
        let consultantId = consultantsMy[consultantFocus]._id;
        //console.log("consultantId", consultantId)
        dispatch(getMyConsultantPxxToEdit(consultantId, searchDate, numberOfMonth));

    }, [dispatch, searchDate, numberOfMonth, consultantFocus, consultantsMy]);

    const navigationMonthHandler = () => {
        console.log('navigation month to configure');
    }

    return (
        <>
            {loadingConsultantMyToEdit ? <Loader /> : errorConsultantMyToEdit ? <Message variant='danger'>{errorConsultantMyToEdit}</Message> : (
                <>
                    
                        <Row>
                            <Col xs={2} className="text-center"></Col>
                            <Col xs={2} className="text-center align-middle"><b>Prod</b></Col>
                            <Col xs={2} className="text-center align-middle"><b>Not Prod</b></Col>
                            <Col xs={2} className="text-center align-middle"><b>Hollidays</b></Col>
                            <Col xs={2} className="text-center align-middle"><b>Availability</b></Col>
                            <Col xs={2} className="text-center">
                                <Button
                                    variant='secondary'
                                    onClick={() => navigationMonthHandler()}
                                ><i className="fas fa-caret-up"></i>
                                </Button>
                            </Col>
                        </Row>

                        {loadingConsultantMyToEdit ? <Loader /> : errorConsultantMyToEdit ? <Message variant="danger">{errorConsultantMyToEdit}</Message> : (
                            pxx.map((line) => (
                                <PxxUserLine
                                    key={line.monthId}
                                    data={line}
                                />
                            ))
                        )}
                        <Row>
                            <Col className="text-center"></Col>
                            <Col className="text-center align-middle"></Col>
                            <Col className="text-center align-middle"></Col>
                            <Col className="text-center align-middle"></Col>
                            <Col className="text-center align-middle"></Col>
                            <Col className="text-center">
                                <Button
                                    variant='secondary'
                                    onClick={() => navigationMonthHandler()}
                                ><i className="fas fa-caret-down"></i>
                                </Button>
                            </Col>
                        </Row>  
                </>
            )}
        </>
    )
}

export default PxxEditor

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ConsultantSelector from '../components/ConsultantSelector';
import PxxEditor from '../components/PxxEditor';
import PxxListConsultants from '../components/pxxListConsultants';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getAllMyConsultants } from '../actions/consultantActions';
import { Container } from 'react-bootstrap';
import { CONSULTANT_MY_RESET } from '../constants/consultantConstants';


const PxxEditScreen = ({ history }) => {

    const dispatch = useDispatch();

    dispatch({type: CONSULTANT_MY_RESET});

    const [consultantFocus, setConsultantFocus] = useState(0);
    const [searchDate, setSearchDate] = useState(new Date(Date.now()));

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantsMyList = useSelector(state => state.consultantsMyList);
    const { loading: loadingConsultantsMyList, error: errorConsultantsMyList, consultantsMy } = consultantsMyList;

    useEffect(() => {

        if (!userInfo) {
            history.push('/login');
        }

        dispatch(getAllMyConsultants());

    }, [history, dispatch, userInfo]);

    const navigationMonthHandler = (value) => {
        const navigationDate = new Date(searchDate);
        navigationDate.setMonth(navigationDate.getMonth() + value);
        setSearchDate(navigationDate);
    }

    return (
        <>
            {loadingConsultantsMyList ? <Loader />
                : errorConsultantsMyList
                    ? <Message variant='danger'>{errorConsultantsMyList}</Message>
                    : (
                        <Container>
                            <Row>
                                <Col xs={12} md={4}>
                                    <ConsultantSelector
                                        consultantFocus={consultantFocus}
                                        setConsultantFocus={setConsultantFocus}
                                    />
                                </Col>
                                <Col xs={12} md={8}>
                                    <PxxEditor 
                                        consultantFocus={consultantFocus}
                                        searchDate={searchDate}
                                        navigationMonthHandler={navigationMonthHandler}
                                    />
                                </Col>
                            </Row>
                            <Row className="pt-5">
                                <PxxListConsultants 
                                    consultantsMy={consultantsMy}
                                    consultantFocus={consultantFocus} />
                            </Row>
                        </Container>
                    )}
        </>
    )
}

export default PxxEditScreen;

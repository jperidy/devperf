import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ConsultantSelector from '../components/ConsultantSelector';
import PxxEditor from '../components/PxxEditor';
import ConsultantsTab from '../components/ConsultantsTab';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getAllMyConsultants } from '../actions/consultantActions';
import { Container } from 'react-bootstrap';
import { CONSULTANT_MY_RESET } from '../constants/consultantConstants';


const PxxEditScreen = ({ history }) => {

    const dispatch = useDispatch();


    const consultantMy = useSelector(state => state.consultantMy);
    const { consultant } = consultantMy;


    //const [consultantFocus, setConsultantFocus] = useState(-1);

    const [searchDate, setSearchDate] = useState(new Date(Date.now()));

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantsMyList = useSelector(state => state.consultantsMyList);
    const { loading: loadingConsultantsMyList, error: errorConsultantsMyList, consultantsMy, focus } = consultantsMyList;

    useEffect(() => {

        if (!userInfo) {
            history.push('/login');
        }

        // initialisation of consultantMy selector
        if (consultant._id) {
            dispatch({ type: CONSULTANT_MY_RESET });
            //console.log('dispatch reset');
        }

        dispatch(getAllMyConsultants());

    }, [history, dispatch, userInfo, consultant]);

    const navigationMonthHandler = (value) => {
        const navigationDate = new Date(searchDate);
        navigationDate.setMonth(navigationDate.getMonth() + value);
        setSearchDate(navigationDate);
    }

    return (
        <>
            {consultantsMy.length === 0 ? <Message variant="info">You don't have CDMee yet</Message> :
                loadingConsultantsMyList ? <Loader />
                : errorConsultantsMyList
                    ? <Message variant='danger'>{errorConsultantsMyList}</Message>
                    : (
                        <Container>
                            <Row>
                                <Col xs={12} md={4}>
                                    <ConsultantSelector />
                                </Col>
                                <Col xs={12} md={8}>
                                    <PxxEditor
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
                        </Container>
                    )
            }
        </>
    )
}

export default PxxEditScreen;

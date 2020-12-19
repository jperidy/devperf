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
//import { CONSULTANT_MY_RESET } from '../constants/consultantConstants';


const PxxEditScreen = ({ history }) => {

    const dispatch = useDispatch();


    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantsMyList = useSelector(state => state.consultantsMyList);
    const { loading: loadingConsultantsMyList, error: errorConsultantsMyList, consultantsMy, focus } = consultantsMyList;

    /*
    const consultantMy = useSelector(state => state.consultantMy);
    const { consultant } = consultantMy;
    */

    const [searchDate, setSearchDate] = useState(new Date(Date.now()));
    //const [focus, setFocus] = useState(0);


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

    return (
        <>
            <Container>
                {loadingConsultantsMyList ? <Loader /> :
                    errorConsultantsMyList ? <Message variant='danger'>{errorConsultantsMyList}</Message>
                        : !consultantsMy || consultantsMy.length === 0 ? 
                            <Message variant='info'>You don't have consultant to edit yet</Message> : (
                            <>
                                <Row>
                                    <Col xs={12} md={4}>
                                        <ConsultantSelector
                                            consultantsMy={consultantsMy}
                                            focus={focus}
                                            //setFocus={setFocus}
                                        />
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
                                        //setFocus={setFocus}
                                        focusActive={true}
                                    />
                                </Row>
                            </>
                        )}
            </Container>

        </>
    )
}

export default PxxEditScreen;

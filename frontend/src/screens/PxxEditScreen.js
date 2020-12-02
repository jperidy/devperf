import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import Button from 'react-bootstrap/Button';
//import PxxUserLine from '../components/PxxUserLine';
import ConsultantSelector from '../components/ConsultantSelector';
import PxxEditor from '../components/PxxEditor';
import Message from '../components/Message';
import Loader from '../components/Loader';
//import { getMyConsultantPxxToEdit } from '../actions/pxxActions';
import { getAllMyConsultants } from '../actions/consultantActions';
//import { PXX_MY_TO_EDIT_RESET } from '../constants/pxxConstants';
//import { CONSULTANTS_MY_DETAILS_RESET } from '../constants/consultantConstants';


const PxxEditScreen = ({ history }) => {

    const dispatch = useDispatch();

    const [consultantFocus, setConsultantFocus] = useState(0);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantsMyList = useSelector(state => state.consultantsMyList);
    const { loading: loadingConsultantsMyList, error: errorConsultantsMyList } = consultantsMyList;

    useEffect(() => {

        if (!userInfo) {
            history.push('/login');
        }

        dispatch(getAllMyConsultants());

    }, [history, dispatch, userInfo]);


    return (
        <>
            {loadingConsultantsMyList ? <Loader />
                : errorConsultantsMyList
                    ? <Message variant='danger'>{errorConsultantsMyList}</Message>
                    : (

                        <Row>
                            <Col xs={12} md={4}>
                                <ConsultantSelector
                                    consultantFocus={consultantFocus}
                                    setConsultantFocus={setConsultantFocus} />
                            </Col>
                            <Col xs={12} md={8}>
                                <PxxEditor consultantFocus={consultantFocus} />
                            </Col>
                        </Row>
                    )}
        </>
    )
}

export default PxxEditScreen;

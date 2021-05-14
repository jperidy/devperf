import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import  FormControl from 'react-bootstrap/FormControl' 
import  InputGroup from 'react-bootstrap/InputGroup' 
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { useDispatch, useSelector } from 'react-redux';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import { getUsersToCreate } from '../actions/userActions';
import Message from '../components/Message';
import Loader from '../components/Loader';


const AddUsersScreen = () => {

    const dispatch = useDispatch();

    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState('');

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userToCreate = useSelector(state => state.userToCreate);
    const { usersListToCreate, pages, page, count, loading, error } = userToCreate;

    useEffect(() => {
        dispatch(getUsersToCreate({
            practice: userInfo.consultantProfil.practice,
            keyword: keyword,
            pageNumber: pageNumber,
            pageSize: pageSize,
        }));
    }, [dispatch, keyword, userInfo.consultantProfil.practice, pageNumber, pageSize]);

    return (
        <div>
            <DropDownTitleContainer title='Not created users' close={false}>
                <ListGroup.Item>
                    <Row>
                        <Col xs={6} md={3}>
                            <InputGroup>
                                <FormControl
                                    type='text'
                                    className="mb-3"
                                    placeholder='Search name'
                                    value={keyword && keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                ></FormControl>
                            </InputGroup>
                        </Col>

                        <Col xs={6} md={6}>
                            <Form.Control
                                plaintext
                                readOnly
                                value={count ? `${count} consultants found` : '0 consultant found'} />
                        </Col>

                        <Col xs={6} md={3}>
                            <InputGroup>
                                <FormControl
                                    as='select'
                                    id='number-c'
                                    className="mb-3"
                                    value={pageSize && pageSize}
                                    onChange={(e) => setPageSize(e.target.value)}
                                >
                                    {[5, 10, 15, 20, 50].map(x => (
                                        <option
                                            key={x}
                                            value={x}
                                        >{x} / page</option>
                                    ))}
                                </FormControl>
                            </InputGroup>
                        </Col>

                    </Row>
                    {error && <Row><Col><Message variant='danger'>{error}</Message></Col></Row>}
                    {loading ? (<Row><Col><Loader /></Col></Row>) : (
                        <Row><Col>
                            <p>To create</p>
                            {usersListToCreate && usersListToCreate.map((x,val) => (
                                <p key={val}>{x.name}</p>
                            ))}
                        </Col></Row>
                    )}
                </ListGroup.Item>
            </DropDownTitleContainer>

        </div>
    )
};

export default AddUsersScreen;

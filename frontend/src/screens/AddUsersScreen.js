import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import { getUsersToCreate } from '../actions/userActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import PageSize from '../components/PageSize';
import PaginateComponent from '../components/PaginateComponent';

const AddUsersScreen = () => {

    const dispatch = useDispatch();

    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState('');

    const [allCheck, setAllCheck] = useState(false);

    const [consultantToCreateList, setConsultantToCreateList] = useState([]);

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


    const onChangeHandler = (consultant, state) => {
        if (state === true) {
            const checkIfAlreadyInList = consultantToCreateList.filter(x => x._id === consultant._id);
            if (!checkIfAlreadyInList.length) {
                let newList = consultantToCreateList.slice();
                newList.push(consultant);
                setConsultantToCreateList(newList);
            }
        }
        if (state === false) {
            const checkIfAlreadyInList = consultantToCreateList.filter(x => x._id === consultant._id);
            if (checkIfAlreadyInList.length) {
                let newList = consultantToCreateList.slice();
                newList = newList.filter(x => x._id !== consultant._id);
                setConsultantToCreateList(newList);
            }
        }
    };

    useEffect(() => {
        if (allCheck && usersListToCreate) {
            usersListToCreate.map(consultant => onChangeHandler(consultant, true));
        } else {
            setConsultantToCreateList([]);
        }
        // eslint-disable-next-line
    }, [allCheck, usersListToCreate]);

    useEffect(() => {
        console.log('consultantToCreate', consultantToCreateList);
    }, [consultantToCreateList]);


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

                        <PageSize pageSize={pageSize} setPageSize={setPageSize} />
                    </Row>

                    {error && <Row><Col><Message variant='danger'>{error}</Message></Col></Row>}
                    {loading ? (<Row><Col><Loader /></Col></Row>) : (
                        <Table responsive hover striped>
                            <thead>
                                <tr className='table-primary'>
                                    <th className='align-middle text-light'>
                                        {<Form.Check type="checkbox" checked={allCheck} onChange={() => setAllCheck(!allCheck)} />}
                                    </th>
                                    <th className='align-middle text-light'>Consultant name</th>
                                    <th className='align-middle text-light'>Matricule</th>
                                    <th className='align-middle text-light text-center'>Practice</th>
                                    <th className='align-middle text-light'>Email</th>
                                    <th className='align-middle text-light text-center'>Arrival</th>
                                    <th className='align-middle text-light text-center'>Leaving</th>
                                    <th className='align-middle text-light text-center'>is CDM?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersListToCreate && usersListToCreate.map((consultant, val) => (
                                    <tr key={val}>
                                        <td className='align-middle'>
                                            <CheckComponent consultant={consultant} allCheck={allCheck} setStatus={onChangeHandler} />
                                        </td>
                                        <td className='align-middle'>{consultant.name}</td>
                                        <td className='align-middle'>{consultant.matricule}</td>
                                        <td className='align-middle text-center'>{consultant.practice}</td>
                                        <td className='align-middle'>{consultant.email}</td>
                                        <td className='align-middle text-center'>{consultant.arrival && consultant.arrival.substring(0, 10)}</td>
                                        <td className='align-middle text-center'>{consultant.leaving && consultant.leaving.substring(0, 10)}</td>
                                        <td className='align-middle text-center'>{consultant.isCDM ? <i className="fas fa-circle"></i> : <i className="far fa-circle"></i>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}

                    <Row>
                        <Col xs={8}>
                            <PaginateComponent
                                userInfo={userInfo && userInfo}
                                keyword={keyword}
                                page={page}
                                pages={pages}
                                pageSize={pageSize}
                                setPageNumber={setPageNumber}
                                action={getUsersToCreate}
                            />
                        </Col>
                        <Col xs={4} className='text-right'>
                            <Button
                                onClick={() => console.log('create')}
                            ><i className="far fa-user-circle"></i>  Create account</Button>
                        </Col>
                    </Row>

                </ListGroup.Item>
            </DropDownTitleContainer>

        </div>
    )
};

const CheckComponent = ({ consultant, allCheck, setStatus }) => {

    const [checked, setChecked] = useState(allCheck);

    useEffect(() => {
        setChecked(allCheck);
    }, [allCheck]);

    useEffect(() => {
        setStatus(consultant, checked);
    }, [checked, consultant, setStatus]);

    return (
        <Form.Check
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
        //onClick={(e) => console.log(e.target.checked)}
        />
    );
}

export default AddUsersScreen;

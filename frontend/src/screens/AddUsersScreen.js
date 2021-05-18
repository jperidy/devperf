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
import { createUser, getUsersToCreate } from '../actions/userActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import PageSize from '../components/PageSize';
import PaginateComponent from '../components/PaginateComponent';
import { USER_CREATE_RESET } from '../constants/userConstants';

const AddUsersScreen = ({history}) => {

    const dispatch = useDispatch();

    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState({consultantName:'', cdmName:''});

    const [allCheck, setAllCheck] = useState(false);

    const [consultantToCreateList, setConsultantToCreateList] = useState([]);

    const [sendProcess, setSendProcess] = useState(false);
    const [countSend, setCountSend] = useState(0);
    const [waitSend, setWaitSend] = useState(true);
    const [noAction, setNoAction] = useState(false);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userToCreate = useSelector(state => state.userToCreate);
    const { usersListToCreate, pages, page, count, loading, error } = userToCreate;

    const userCreate = useSelector(state => state.userCreate);
    const { loading:loadingCreate, error:errorCreate, success:successCreate, consultantId } = userCreate;

    useEffect(() => {
        dispatch(getUsersToCreate({
            practice: userInfo.consultantProfil.practice,
            keyword: keyword,
            pageNumber: pageNumber,
            pageSize: pageSize,
        }));
    }, [dispatch, keyword, userInfo.consultantProfil.practice, pageNumber, pageSize]);

    // copie data to be able to add processus informations
    useEffect(() => {
        if (usersListToCreate) {
            const newList = usersListToCreate.map(consultant => ({ ...consultant, send: allCheck ? 'checked' : 'no' }));
            setConsultantToCreateList(newList);
        }
    // eslint-disable-next-line
    }, [usersListToCreate]);

    const onCheck = (oldStatus) => {
        //let newStatus = 'no';
        switch (oldStatus) {
            case 'no':
                return 'checked';
            case 'ckecked':
                return 'checked';
            case 'yes':
                return 'yes';
            case 'error':
                return 'checked';
            default:
                return 'no';
        }
    };

    const onUnCheck = (oldStatus) => {
        switch (oldStatus) {
            case 'no':
                return 'no';
            case 'ckecked':
                return 'no';
            case 'yes':
                return 'yes';
            case 'error':
                return 'no';
            default:
                return 'no';
        }
    };

    const onChangeHandler = (consultant, state) => {
        let newList
        if (state === true) {
            newList = consultantToCreateList.slice();
            const oldStatus = newList.filter(x => x._id === consultant._id)[0].send;
            const newStatus = onCheck(oldStatus);
            newList.filter(x => x._id === consultant._id)[0].send = newStatus;
            setConsultantToCreateList(newList);
        }
        if (state === false) {
            newList = consultantToCreateList.slice();
            const oldStatus = newList.filter(x => x._id === consultant._id)[0].send;
            let newStatus = onUnCheck(oldStatus);
            newList.filter(x => x._id === consultant._id)[0].send = newStatus;
            setConsultantToCreateList(newList);
        }
    };

    useEffect(() => {
        let newList
        if (allCheck) {
            newList = consultantToCreateList.map(consultant => ({...consultant, send:onCheck(consultant.send)}));
        } else {
            newList = consultantToCreateList.map(consultant => ({...consultant, send:onUnCheck(consultant.send)}));
        }
        setConsultantToCreateList(newList);
    // eslint-disable-next-line
    }, [allCheck]);

    // useEffect(() => {
    //     console.log('consultantToCreate', consultantToCreateList.map(x => x.send));
    // }, [consultantToCreateList]);


    useEffect(() => {
        if(sendProcess && !waitSend) {
            // console.log('countSend', countSend, ' / total', consultantToCreateList.length);
            if (countSend < consultantToCreateList.length) {
                const userToCreate = consultantToCreateList[countSend];
                if (userToCreate.send === 'checked') {
                    dispatch(createUser(userToCreate));
                } else {
                    setNoAction(true);
                }
                setWaitSend(true);
            } else {
                setSendProcess(false);
                setCountSend(0);
                setWaitSend(true);
            }
        }
    // eslint-disable-next-line
    }, [dispatch, sendProcess, countSend, waitSend]);

    useEffect(() => {
        if(successCreate && waitSend && sendProcess) {
            let newList = consultantToCreateList.slice();
            newList.filter(x => x._id === consultantId)[0].send = 'yes';
            setConsultantToCreateList(newList);
            setCountSend(countSend+1);
            setWaitSend(false);
        }
        if (errorCreate && waitSend && sendProcess) {
            let newList = consultantToCreateList.slice();
            newList.filter(x => x._id === consultantId)[0].send = 'error';
            setConsultantToCreateList(newList);
            setCountSend(countSend+1);
            setWaitSend(false);
        }
    // eslint-disable-next-line
    }, [successCreate, errorCreate, waitSend]);

    useEffect(() => {
        if(noAction && waitSend) {
            setCountSend(countSend+1);
            setWaitSend(false);
            setNoAction(false);
        }
    // eslint-disable-next-line
    }, [noAction, waitSend]);

    const verifyStatus = (consultant) => {
        if (consultantToCreateList.map(x => x._id).includes(consultant._id)) {
            if(consultantToCreateList.filter( x => x._id === consultant._id)[0].send === 'no') {
                return (
                    <div className='text-secondary'><i className="fas fa-circle text-secondary"></i>  not created</div>
                );
            }
            if(consultantToCreateList.filter( x => x._id === consultant._id)[0].send === 'checked') {
                return (
                    <div className='text-warning'><i className="fas fa-circle text-warning"></i>  to create</div>
                );
            }
            if (consultantToCreateList.filter( x => x._id === consultant._id)[0].send === 'yes') {
                return (
                    <div className='text-success'><i className="fas fa-circle text-success"></i>  created</div>
                );
            }
            if (consultantToCreateList.filter( x => x._id === consultant._id)[0].send === 'error') {
                return (
                    <div className='text-danger'><i className="fas fa-circle text-danger"></i>  error</div>
                );
            }
        } else {
            return (<div className='text-secondary'><i className="fas fa-circle text-secondary"></i>  undefined</div>);
        }
    }

    const onCreateUserHandler = () => {

        dispatch({type: USER_CREATE_RESET});
        setCountSend(0);
        setSendProcess(true);
        setWaitSend(false);
    }

    return (
        <div>
            <Row><Col className='text-left'>
                <Button className='mb-3' onClick={() => history.go(-1)}>
                    Go Back
                </Button>
            </Col></Row>

            <DropDownTitleContainer title='Not created users' close={false}>
                <ListGroup.Item>
                    <Row>
                        <Col xs={6} md={3}>
                            <InputGroup>
                                <FormControl
                                    type='text'
                                    className="mb-3"
                                    placeholder='consultant name'
                                    value={keyword && keyword.consultantName}
                                    onChange={(e) => setKeyword({...keyword, consultantName: e.target.value})}
                                ></FormControl>
                            </InputGroup>
                        </Col>
                        <Col xs={6} md={3}>
                            <InputGroup>
                                <FormControl
                                    type='text'
                                    className="mb-3"
                                    placeholder='cdm name'
                                    value={keyword && keyword.cdmName}
                                    onChange={(e) => setKeyword({...keyword, cdmName: e.target.value})}
                                ></FormControl>
                            </InputGroup>
                        </Col>

                        <Col xs={6} md={3}>
                            <Form.Control
                                plaintext
                                readOnly
                                value={count ? `${count} consultants found` : '0 consultant found'} />
                        </Col>

                        <Col xs={6} md={3}>
                            <PageSize pageSize={pageSize} setPageSize={setPageSize} />
                        </Col>
                    </Row>

                    {error && <Row><Col><Message variant='danger'>{error}</Message></Col></Row>}
                    {loading ? (<Row><Col><Loader /></Col></Row>) : (
                        <Table responsive hover striped>
                            <thead>
                                <tr className='table-primary'>
                                    <th className='align-middle text-light'>
                                        {<Form.Check 
                                            type="checkbox" 
                                            checked={allCheck} 
                                            onChange={() => setAllCheck(!allCheck)} 
                                            disabled={sendProcess}
                                        />}
                                    </th>
                                    <th className='align-middle text-light'>Consultant name</th>
                                    <th className='align-middle text-light'>Matricule</th>
                                    <th className='align-middle text-light text-center'>Practice</th>
                                    <th className='align-middle text-light text-center'>CDM</th>
                                    <th className='align-middle text-light'>Email</th>
                                    <th className='align-middle text-light text-center'>Arrival</th>
                                    <th className='align-middle text-light text-center'>Leaving</th>
                                    <th className='align-middle text-light text-center'>is CDM?</th>
                                    <th className='align-middle text-light text-center'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersListToCreate && usersListToCreate.map((consultant, val) => (
                                    <tr key={val}>
                                        <td className='align-middle'>
                                            <CheckComponent 
                                                consultant={consultant} 
                                                allCheck={allCheck} 
                                                setStatus={onChangeHandler} 
                                                sendProcess={sendProcess}
                                            />
                                        </td>
                                        <td className='align-middle'>{consultant.name}</td>
                                        <td className='align-middle'>{consultant.matricule}</td>
                                        <td className='align-middle text-center'>{consultant.practice}</td>
                                        <td className='align-middle text-center'>{consultant.cdmId.name ? consultant.cdmId.name : 'unknown'}</td>
                                        <td className='align-middle'>{consultant.email}</td>
                                        <td className='align-middle text-center'>{consultant.arrival && consultant.arrival.substring(0, 10)}</td>
                                        <td className='align-middle text-center'>{consultant.leaving && consultant.leaving.substring(0, 10)}</td>
                                        <td className={`align-middle text-center ${consultant.isCDM ? 'text-success' : 'text-warning'}`}>{consultant.isCDM ? "Yes" : "No"}</td>
                                        <td className='align-middle text-center'>{
                                            consultant._id === consultantId && sendProcess ? 
                                                <Loader /> 
                                                : verifyStatus(consultant)
                                        }</td>
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
                            {loadingCreate ? <Loader /> : (
                                <Button
                                    onClick={() => onCreateUserHandler()}
                                ><i className="far fa-user-circle"></i>  Create account</Button>
                            )}
                        </Col>
                    </Row>

                </ListGroup.Item>
            </DropDownTitleContainer>

        </div>
    )
};

const CheckComponent = ({ consultant, allCheck, setStatus, sendProcess }) => {

    const [checked, setChecked] = useState(allCheck);

    useEffect(() => {
        setChecked(allCheck);
    }, [allCheck]);

    // useEffect(() => {
    //     setStatus(consultant, checked);
    // }, [checked, consultant, setStatus]);

    const checkChangeHandler = () => {
        setStatus(consultant, !checked);
        setChecked(!checked);
    }

    return (
        <Form.Check
            type="checkbox"
            checked={checked}
            //onChange={() => setChecked(!checked)}
            onChange={() => checkChangeHandler()}
            disabled={sendProcess}
        />
    );
}

export default AddUsersScreen;

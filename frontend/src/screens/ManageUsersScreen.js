import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import Message from '../components/Message';
import ListGroup from 'react-bootstrap/ListGroup';
import { deleteUser, listUsers } from '../actions/userActions';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import SelectComponent from '../components/SelectComponent';

const ManageUsersScreen = ({ history }) => {

    const dispatch = useDispatch();

    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState({searchName:'', searchStatus:''});
    
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userList = useSelector(state => state.userList);
    const { users, pages, page, count } = userList;

    const userDelete = useSelector(state => state.userDelete);
    const { error, success } = userDelete;

    useEffect(() => {

        if (userInfo) {
            dispatch(listUsers(userInfo.consultantProfil.practice, keyword, pageNumber, pageSize));
        } else {
            history.push('/login');
        }

    }, [dispatch, history, userInfo, success, keyword, pageNumber, pageSize]);


    const onClickEditHandler = (userId) => {
        history.push(`/admin/edituser/${userId}`);
    };

    const onClickDeleteHandler = (user) => {
        //console.log('delete user');
        if (window.confirm(`Are you sure to delete user: ${user.name} ?`)) {
            dispatch(deleteUser(user._id));
        }
    };

    const getStatusDisplay =(status) => {
        switch (status) {
            case 'Waiting approval':
                return(<i className="far fa-clock text-warning"></i>);
            case 'Validated':
                return(<i className="fas fa-check-circle text-success"></i>);
            case 'Refused':
                return(<i className="fas fa-times text-danger"></i>);
            case 'Blocked':
                return(<i className="far fa-hand-paper text-danger"></i>);
            case 'Left':
                return(<i className="fas fa-sign-out-alt text-secondary"></i>);
            default:
                return(<p className='text-secondary'>Unknown</p>);
        }
    };

    return (
        <div>
            {error && (<Message variant='danger'>{error}</Message>)}

            <Row><Col className='text-right'>
                <Button onClick={() => history.push('/admin/add-users')}><i className="far fa-user"></i>  Create users</Button>
            </Col></Row>

            <DropDownTitleContainer title='Manage users' close={false}>
                <ListGroup.Item>
                    <Row>
                        <Col xs={6} md={3}>
                            <InputGroup>
                                <FormControl
                                    type='text'
                                    className="mb-3"
                                    placeholder='Search name'
                                    value={keyword && keyword.searchName}
                                    onChange={(e) => setKeyword({...keyword, searchName:e.target.value})}
                                ></FormControl>
                            </InputGroup>
                        </Col>

                        <Col xs={6} md={3}>
                            <Form.Control
                                plaintext
                                readOnly
                                value={count ? `${count} users found` : '0 users found'} />
                        </Col>

                        <Col xs={6} md={3}>
                            <SelectComponent 
                                editRequest={true}
                                id='search-status'
                                value={keyword && keyword.searchStatus}
                                onChange={(val) => setKeyword({...keyword, searchStatus:val})}
                                required={false}
                                options={
                                    <div>
                                        <option value=''>--All status--</option>
                                        {['Waiting approval', 'Validated', 'Refused', 'Blocked', 'Left'].map((x, val) => (
                                            <option key={val} value={x}>{x}</option>
                                        ))}
                                    </div>
                                }
                            />
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

                    <Table responsive hover striped>
                        <thead>
                            <tr className='table-primary'>
                                <th className='align-middle text-light'>User name</th>
                                <th className='align-middle text-light'>Matricule</th>
                                <th className='align-middle text-light text-center'>Practice</th>
                                <th className='align-middle text-light text-center'>Created at</th>
                                <th className='align-middle text-light text-center'>Last connection</th>
                                <th className='align-middle text-light text-center'>Status</th>
                                <th className='align-middle text-light text-center'>User Profil</th>
                                <th className='align-middle text-light'></th>
                                <th className='align-middle text-light'></th>
                            </tr>
                        </thead>

                        <tbody>
                            {users && users.map((user) => (
                                <tr key={user._id}>
                                    <td className='align-middle'><b>{user.name && user.name}</b></td>
                                    <td className='align-middle'>{user.consultantProfil && user.consultantProfil.matricule}</td>
                                    <td className='align-middle text-center'>{user.consultantProfil && user.consultantProfil.practice}</td>
                                    <td className='align-middle text-center'>{user.createdAt && user.createdAt.toString().substring(0, 10)}</td>
                                    <td className='align-middle text-center'>{user.lastConnexion && user.lastConnexion.toString().substring(0, 10)}</td>
                                    <td className='align-middle text-center'>
                                        {user.status && (
                                            <OverlayTrigger
                                                placement='top'
                                                overlay={<Tooltip>{user.status}</Tooltip>}
                                            >{getStatusDisplay(user.status)}</OverlayTrigger>
                                        )}
                                    </td>
                                    <td className='align-middle text-center'>{user.profil && user.profil.profil && user.profil.profil}</td>
                                    <td className='align-middle'>
                                        <Button
                                            className='btn btn-primary p-1'
                                            onClick={() => onClickEditHandler(user._id)}
                                            size='sm'
                                        ><i className="fas fa-user-edit"></i>
                                        </Button>
                                    </td>
                                    <td className='align-middle'>
                                        <Button
                                            className='btn btn-danger p-1'
                                            onClick={() => onClickDeleteHandler(user)}
                                            size='sm'
                                        ><i className="fas fa-user-times"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Pagination>
                        <Pagination.Prev
                            onClick={() => setPageNumber(page - 1)}
                            disabled={page === 1}
                        />
                        {[...Array(pages).keys()].map(x => (
                            [0, 1, pages - 2, pages - 1].includes(x) ? (
                                <Pagination.Item
                                    key={x + 1}
                                    active={x + 1 === page}
                                    onClick={() => {
                                        dispatch(listUsers(userInfo.consultantProfil.practice, keyword, x + 1, pageSize));
                                        setPageNumber(x + 1);
                                    }}
                                >{x + 1}</Pagination.Item>
                            ) : (pages > 4 && x === 2) && (
                                <Pagination.Ellipsis key={x + 1} />
                            )
                        ))}
                        <Pagination.Next
                            onClick={() => setPageNumber(page + 1)}
                            disabled={page === pages}
                        />
                    </Pagination>
                </ListGroup.Item>
            </DropDownTitleContainer>
        </div>
    )
}

export default ManageUsersScreen;

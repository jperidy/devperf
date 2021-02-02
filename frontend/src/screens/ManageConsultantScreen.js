import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteConsultant, getAllMyAdminConsultants } from '../actions/consultantActions';
import { CONSULTANT_DELETE_RESET } from '../constants/consultantConstants';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import ListGroup from 'react-bootstrap/ListGroup';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

const ManageConsultantScreen = ({ history, match }) => {

    const dispatch = useDispatch();

    // pagination configuration

    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState('');

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantsMyAdminList = useSelector(state => state.consultantsMyAdminList);
    const { loading, error, consultantsMyAdmin, pages, page, count } = consultantsMyAdminList;

    const consultantDelete = useSelector(state => state.consultantDelete);
    const { success: successConsultantDelete } = consultantDelete;

    useEffect(() => {

        if (userInfo && (['admin', 'domain', 'coordinator', 'cdm'].includes(userInfo.profil.profil))) {
            dispatch(getAllMyAdminConsultants(keyword, pageNumber, pageSize));
        } else {
            history.push('/login');
        }

    }, [dispatch, history, userInfo, pageNumber, pageSize, keyword]);

    useEffect(() => {
        if (successConsultantDelete) {
            dispatch(getAllMyAdminConsultants(keyword, pageNumber, pageSize));
            dispatch({ type: CONSULTANT_DELETE_RESET });
        }
    }, [dispatch, successConsultantDelete, keyword, pageNumber, pageSize, userInfo]);

    const addConsultantHandler = () => {
        history.push('/admin/consultant/add');
    }

    const onClickEditHandler = (consultantId) => {
        history.push(`/editconsultant/${consultantId}`);
    };

    const onClickDeleteHandler = (consultant) => {
        if (window.confirm(`Are you sure to delete user: ${consultant.name} ?`)) {
            dispatch(deleteConsultant(consultant._id));
        }
    }

    return (
        <>
            <DropDownTitleContainer title='Manage consultants' close={false}>
                <ListGroup.Item>
                    <Row>

                        <Col xs={6} md={4}>
                            <Button className="mb-3" onClick={() => addConsultantHandler()}>
                                <i className="fas fa-user-edit mr-2"></i>Add
                    </Button>
                        </Col>

                        <Col xs={6} md={2}>
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

                        <Col xs={6} md={4}>
                            <Form.Control
                                plaintext
                                readOnly
                                value={count ? `${count} consultants found` : '0 consultant found'} />
                        </Col>

                        <Col xs={6} md={2}>
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

                    {consultantsMyAdmin && consultantsMyAdmin.length === 0 ? <Message variant='information'>You have not access to these information</Message> :
                        loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (


                            <Table responsive hover striped>
                                <thead>
                                    <tr className='table-primary'>
                                        <th className='align-middle text-light'>Consultant name</th>
                                        <th className='align-middle text-light'>Matricule</th>
                                        <th className='align-middle text-light'>Practice</th>
                                        <th className='align-middle text-light'>Valued</th>
                                        <th className='align-middle text-light'>Arrival</th>
                                        <th className='align-middle text-light'>Leaving</th>
                                        <th className='align-middle text-light'>Seniority</th>
                                        <th className='align-middle text-light'></th>
                                        <th className='align-middle text-light'></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {consultantsMyAdmin && consultantsMyAdmin.map((consultant) => (
                                        <tr key={consultant._id}>
                                            <td className='align-middle'>{consultant.name}</td>
                                            <td className='align-middle'>{consultant.matricule}</td>
                                            <td className='align-middle'>{consultant.practice}</td>
                                            <td className='align-middle'>{consultant.valued ? consultant.valued.substring(0, 10) : ''}</td>
                                            <td className='align-middle'>{consultant.arrival ? consultant.arrival.substring(0, 10) : ''}</td>
                                            <td className='align-middle'>{consultant.leaving ? consultant.leaving.substring(0, 10) : ''}</td>
                                            <td className='align-middle'>{
                                                consultant.valued ? ((new Date(Date.now()) - new Date(consultant.valued.substring(0, 10))) / (1000 * 3600 * 24 * 365.25)).toString().substring(0, 4) : 0
                                            } years</td>
                                            <td className='align-middle'>
                                                <Button 
                                                    className='btn btn-primary p-1' 
                                                    onClick={() => onClickEditHandler(consultant._id)}
                                                    size='sm'
                                                ><i className="fas fa-user-edit"></i>
                                                </Button>
                                            </td>
                                            <td className='align-middle'>
                                                <Button 
                                                    className='btn btn-danger p-1' 
                                                    onClick={() => onClickDeleteHandler(consultant)}
                                                    size='sm'
                                                ><i className="fas fa-user-times"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                        )}

                    <Pagination>
                        <Pagination.Prev
                            onClick={() => setPageNumber(page - 1)}
                            disabled={page === 1}
                        />
                        {[...Array(pages).keys()].map(x => (
                            [0,1,pages-2,pages-1].includes(x) ? (
                                <Pagination.Item
                                    key={x + 1}
                                    active={x + 1 === page}
                                    onClick={() => {
                                        dispatch(getAllMyAdminConsultants(keyword, x + 1, pageSize));
                                        setPageNumber(x + 1);
                                    }}
                                >{x + 1}</Pagination.Item>
                            ) : (pages > 4 && x === 2) && (
                                <Pagination.Ellipsis key={x+1} />
                            )

                        ))}
                        <Pagination.Next
                            onClick={() => setPageNumber(page + 1)}
                            disabled={page === pages}
                        />
                    </Pagination>
                </ListGroup.Item>
            </DropDownTitleContainer>
        </>
    )
}

export default ManageConsultantScreen;

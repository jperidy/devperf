import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import ListGroup from 'react-bootstrap/ListGroup';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { getAllClients, updateAClient } from '../actions/clientActions';

const ManageCompaniesScreen = ({ history }) => {

    const dispatch = useDispatch();

    // pagination configuration

    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState('');

    const [showAddContact, setShowAddContact] = useState({state:false, companyId:'', companyName:""});
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [message, setMessage] = useState('');

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const clientAll = useSelector(state => state.clientAll);
    const { error, loading, clients: companies, count, page, pages } = clientAll;

    const clientUpdate = useSelector(state => state.clientUpdate);
    const { error: errorUpdate, success:successUpdate } = clientUpdate;

    useEffect(() => {

        if (userInfo) {
            dispatch(getAllClients(keyword, pageNumber, pageSize));
        } else {
            history.push('/login');
        }

    }, [dispatch, history, userInfo, pageNumber, pageSize, keyword]);

    useEffect(() => {
        if (successUpdate) {
            dispatch(getAllClients(keyword, pageNumber, pageSize));
        }
    }, [dispatch, successUpdate, keyword, pageNumber, pageSize]);


    const addCompanyHandler = () => {
        // Add company function

    }

    const onClickEditHandler = () => {
        // Add edit function

    }

    const onClickDeleteHandler = () => {
        // Add delete company function

    }

    const addContactHandler = (e, contactName, contactEmail, companyId) => {
        e.preventDefault();

        let contactNameConform = false;
        let contactEmailConform = false;
        let message = []

        if (contactName) {
            contactNameConform = true
        } else {
            message.push('Thanks to enter a correct Name')
        }

        const regexEmail = /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
        if (regexEmail.test(contactEmail)) {
            contactEmailConform = true
        } else {
            message.push('Thanks to enter a correct Email address')
        }

        setMessage(message);

        if (contactEmailConform && contactNameConform) {

            let clientToUpdate = companies.filter(x => x._id === companyId)[0];
            clientToUpdate.commercialTeam = clientToUpdate.commercialTeam.map(x => ({contactName: x.contactName, contactEmail:x.contactEmail}));
            clientToUpdate.commercialTeam.push({contactName:contactName, contactEmail:contactEmail});

            dispatch(updateAClient(clientToUpdate));

            setShowAddContact({state:false, companyId:'', companyName:''});
            setMessage('');
        }
    }

    const deleteContactHandler = (contactEmail, companyId) => {
        if (window.confirm(`Are you sure to delete contact: ${contactEmail} ?`)) {
            let clientToUpdate = companies.filter(x => (x._id === companyId))[0];
            clientToUpdate.commercialTeam = clientToUpdate.commercialTeam.map(x => ({contactName: x.contactName, contactEmail:x.contactEmail}));
            const newContacts = clientToUpdate.commercialTeam.filter(x => x.contactEmail !== contactEmail);
            clientToUpdate.commercialTeam = newContacts;

            dispatch(updateAClient(clientToUpdate));
        }

    }



    return (
        <>
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            <DropDownTitleContainer title='Manage companies' close={false}>
                <ListGroup.Item>
                    <Row>

                        <Col xs={6} md={4}>
                            <Button className="mb-3" onClick={() => addCompanyHandler()}>
                                <i className="fas fa-plus mr-2"></i>Add
                            </Button>
                        </Col>

                        <Col xs={6} md={2}>
                            <InputGroup>
                                <FormControl
                                    type='text'
                                    className="mb-3"
                                    placeholder='Search company'
                                    value={keyword && keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                ></FormControl>
                            </InputGroup>
                        </Col>

                        <Col xs={6} md={4}>
                            <Form.Control
                                plaintext
                                readOnly
                                value={count ? `${count} companies found` : '0 company found'} />
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

                    {companies && companies.length === 0 ? <Message variant='information'>You have not access to these information</Message> :
                        loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (

                            <Table responsive hover striped>
                                <thead>
                                    <tr className='table-primary'>
                                        <th className='align-middle text-light'>Company name</th>
                                        <th className='align-middle text-light'>Commercial contacts</th>
                                        <th className='align-middle text-light'></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {companies && companies.map((company) => (
                                        <tr key={company._id}>
                                            <td className='align-middle'>{company.name}</td>
                                            <td className='align-middle'>
                                                <DisplayContact
                                                    company={company}
                                                    setShowAddContact={setShowAddContact}
                                                    deleteContactHandler={deleteContactHandler}
                                                />
                                            </td>

                                            <td className='align-middle text-right'>
                                                <Button
                                                    className='btn btn-primary p-1 mx-3'
                                                    onClick={() => onClickEditHandler(company._id)}
                                                    size='sm'
                                                ><i className="fas fa-user-edit"></i>
                                                </Button>
                                                <Button
                                                    className='btn btn-danger p-1 mx-3'
                                                    onClick={() => onClickDeleteHandler(company)}
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
                            [0, 1, pages - 2, pages - 1].includes(x) ? (
                                <Pagination.Item
                                    key={x + 1}
                                    active={x + 1 === page}
                                    onClick={() => {
                                        dispatch(getAllClients(keyword, x + 1, pageSize));
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

            <Modal show={showAddContact.state} onHide={() => setShowAddContact({state:false, companyId:'', companyName:""})}>
                <Modal.Header closeButton>
                    <Modal.Title>{`New contact for: ${showAddContact.companyName}`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name *</Form.Label>
                            <Form.Control
                                type='text'
                                value={contactName && contactName}
                                onChange={(e) => setContactName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                                type='email'
                                value={contactEmail && contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Button type='submit' variant="primary" onClick={(e) => addContactHandler(e, contactName, contactEmail, showAddContact.companyId)} disabled={!contactEmail || !contactName}>Create</Button>
                    </Form>
                    {message && <Message variant='danger'>{message}</Message>}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddContact({state:false, companyId:'', companyName:""})}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const DisplayContact = ({ company, setShowAddContact, deleteContactHandler }) => {

    const [contacts] = useState(company.commercialTeam || []);

    return (
        <div>
            {contacts.map((contact, incr) => (
                <div key={incr}>
                    {`${contact.contactName} (${contact.contactEmail})`}
                    <Button
                        variant='ligth'
                        className='ml-3 px-1 text-danger'
                        onClick={() => deleteContactHandler(contact.contactEmail, company._id)}
                    ><i className="fas fa-times"></i></Button>
                    <Button
                        className='mx-0 px-1 text-primary'
                        variant='ligth'
                        onClick={() => setShowAddContact({state:true, companyId:company._id, companyName:company.name})}
                    ><i className="fas fa-plus"></i></Button>
                </div>
            ))}


        </div>
    )
}

export default ManageCompaniesScreen

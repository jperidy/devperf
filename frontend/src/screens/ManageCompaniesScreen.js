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
import { deleteAClient, getAllClients, updateAClient } from '../actions/clientActions';

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

    const [showModifyName, setShowModifyName] = useState({state:false, companyId:'', companyName:''});
    const [newCompanyName, setNewCompanyName] = useState('');

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const clientAll = useSelector(state => state.clientAll);
    const { error, loading, clients: companies, count, page, pages } = clientAll;

    const clientUpdate = useSelector(state => state.clientUpdate);
    const { error: errorUpdate, success:successUpdate } = clientUpdate;

    const clientDelete = useSelector(state => state.clientDelete);
    const { error: errorDelete, success:successDelete } = clientDelete;

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
        // eslint-disable-next-line
    }, [dispatch, successUpdate]);

    useEffect(() => {
        if (successDelete) {
            dispatch(getAllClients(keyword, pageNumber, pageSize));
        }
        // eslint-disable-next-line
    }, [dispatch, successDelete]);


    const addCompanyHandler = () => {
        // Add company function

    }

    const modifyCompanyNameHandler = (e, companyId, newCompanyName) => {
        e.preventDefault();
        let clientToUpdate = companies.filter(x => x._id === companyId)[0];
        clientToUpdate.name = newCompanyName;
        dispatch(updateAClient(clientToUpdate));
        setShowModifyName({ state: false, companyId: '', companyName: '' });
    }

    const onClickDeleteHandler = (company) => {
        if (window.confirm(`Are you sure to delete company: ${company.name} ?`)) {
            dispatch(deleteAClient(company._id));
        }
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
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
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
                                            <td className='align-middle'>
                                                <Row><Col>{company.name}</Col></Row>
                                                <Row><Col>
                                                    <Button
                                                        variant='ligth'
                                                        className="m-0 p-1 text-primary"
                                                        onClick={() => setShowModifyName({ state: true, companyId: company._id, companyName: company.name })}
                                                    ><i className="fas fa-minus"></i><i>  modify</i>
                                                    </Button>
                                                    <Button
                                                        variant='ligth'
                                                        className='m-0 p-1 btn text-danger'
                                                        onClick={() => onClickDeleteHandler(company)}
                                                    ><i className="fas fa-times"></i><i>  Delete</i>
                                                    </Button>
                                                </Col></Row>
                                            </td>
                                            <td className='align-middle'>
                                                <DisplayContact
                                                    company={company}
                                                    setShowAddContact={setShowAddContact}
                                                    deleteContactHandler={deleteContactHandler}
                                                />
                                            </td>

                                            <td className='align-middle text-right'>
                                                {/* <Button
                                                    className='btn btn-danger p-1 mx-3'
                                                    onClick={() => onClickDeleteHandler(company)}
                                                    size='sm'
                                                ><i className="fas fa-user-times"></i>
                                                </Button> */}
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

            <Modal show={showModifyName.state} onHide={() => setShowModifyName({state:false, companyId:'', companyName:""})}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Original name: ${showModifyName.companyName}`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>New company name *</Form.Label>
                            <Form.Control
                                type='text'
                                value={newCompanyName ? newCompanyName : showModifyName.companyName}
                                onChange={(e) => setNewCompanyName(e.target.value)}
                            />
                        </Form.Group>
                        <Button 
                            type='submit' 
                            variant="primary" 
                            onClick={(e) => modifyCompanyNameHandler(e, showModifyName.companyId, newCompanyName)} 
                            disabled={!(newCompanyName && (newCompanyName !== showModifyName.companyName))}>Modify</Button>
                    </Form>
                    {/*message && <Message variant='danger'>{message}</Message>*/}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModifyName({ state: false, companyId: '', companyName: "" });
                        setNewCompanyName('')
                    }}>Close</Button>
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
                <Row key={incr}>
                    <Col>
                        {`${contact.contactName} (${contact.contactEmail})`}
                        <Button
                            variant='ligth'
                            className='ml-3 px-1 text-danger'
                            onClick={() => deleteContactHandler(contact.contactEmail, company._id)}
                        ><i className="fas fa-times"></i></Button>
                    </Col>
                </Row>
            ))}
            <Row><Col className='text-left'>
                <Button
                    className='m-0 p-1 text-primary'
                    variant='ligth'
                    onClick={() => setShowAddContact({state:true, companyId:company._id, companyName:company.name})}
                ><i className="fas fa-plus"></i><i>  add a contact</i></Button>
            </Col></Row>

        </div>
    )
}

export default ManageCompaniesScreen

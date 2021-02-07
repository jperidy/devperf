import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Message from '../components/Message';
import Button from 'react-bootstrap/Button';
import SearchInput from '../components/SearchInput';
import { createAClient, getAllClients } from '../actions/clientActions';
import { CLIENT_CREATE_RESET } from '../constants/clientConstants';

const SelectCompany = ({ setCompany, editRequest }) => {

    const dispatch = useDispatch();

    const clientAll = useSelector(state => state.clientAll);
    const { error, clients: companies } = clientAll;

    const clientCreate = useSelector(state => state.clientCreate);
    const { error:errorCreate, success } = clientCreate;

    const [searchCompany, setSearchCompany] = useState('');

    useEffect(() => {
        dispatch(getAllClients(searchCompany))
    }, [dispatch, searchCompany]);

    useEffect(() => {
        if(success) {
            setCompany(searchCompany.toUpperCase());
            dispatch({type: CLIENT_CREATE_RESET});
        }
        //dispatch(getAllClients(searchCompany));
    }, [dispatch, setCompany, success, searchCompany]);

    const updateResult = (result) => {
        const newValue = result && result.value ? result.value : '';
        console.log('company', newValue);
        setCompany(newValue);
    }

    const createClientHandler = () => {
        dispatch(createAClient([{name:searchCompany, commercialTeam:[]}]))
        //setCompany(searchCompany.toUpperCase())
    }

    return (
        <Row className='align-items-end'>
            <Col xs={10}>
                {error && <Message variant='danger'>{error}</Message>}
                <SearchInput
                    title='Company'
                    searchValue={searchCompany ? searchCompany : ''}
                    setSearchValue={setSearchCompany}
                    possibilities={companies && companies.map(company => ({ id: company._id, value: company.name }))}
                    updateResult={updateResult}
                    editMode={editRequest}
                />
            </Col>
            <Col xs={2}>
                {companies && companies.length === 0 && (
                    <Button
                        variant='success'
                        onClick={() => createClientHandler()}
                    ><i className="far fa-address-book"></i></Button>
                )}
            </Col>
        </Row>
    )
}

export default SelectCompany

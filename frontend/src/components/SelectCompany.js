import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Message from '../components/Message';
import Button from 'react-bootstrap/Button';
import SearchInput from '../components/SearchInput';
import { createAClient, getAllClients } from '../actions/clientActions';
import { CLIENT_CREATE_RESET } from '../constants/clientConstants';

import CreatableSelect from 'react-select/creatable';

const SelectCompany = ({ company, setCompany, editRequest }) => {

    const dispatch = useDispatch();

    const clientAll = useSelector(state => state.clientAll);
    const { error, clients: companies } = clientAll;

    const clientCreate = useSelector(state => state.clientCreate);
    const { success } = clientCreate;

    //const [searchCompany, setSearchCompany] = useState('');

    useEffect(() => {
        //dispatch(getAllClients(searchCompany));
        dispatch(getAllClients(''));
    }, [dispatch, success]);

    /* useEffect(() => {
        if(success) {
            setCompany(searchCompany.toUpperCase());
            dispatch({type: CLIENT_CREATE_RESET});
        }
        //dispatch(getAllClients(searchCompany));
    }, [dispatch, setCompany, success, searchCompany]); */

    /* const updateResult = (result) => {
        const newValue = result && result.value ? result.value : '';
        setCompany(newValue);
    }

    const createClientHandler = () => {
        dispatch(createAClient([{name:searchCompany, commercialTeam:[]}]))
        //setCompany(searchCompany.toUpperCase())
    } */

    const handleChange = (e) => {
        //console.log('e', e);
        if (e) {
            const currentCompaniesId = companies.map(x => x._id);
            //console.log('currentCompaniesId', currentCompaniesId);
            if (currentCompaniesId.includes(e.value)) {
                setCompany(e.label);
            } else {
                //console.log('create a compay');
                dispatch(createAClient([{name:e.label, commercialTeam:[]}]));
                setCompany(e.label);
            }
        } else {
            setCompany('');
        }
    }

    //console.log('company', company)

    return (
        <Row className='align-items-end'>
            <Col>
                <CreatableSelect
                    placeholder='Select a company'
                    isClearable
                    onChange={handleChange}
                    value={(company && company.label !=='') ? company : null}
                    //onInputChange={handleInputChange}
                    options={companies && companies.map(company => ({ value: company._id, label: company.name }))}
                />
            </Col>


            {/* <Col xs={10}>
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
            </Col> */}
        </Row>
    )
}

export default SelectCompany

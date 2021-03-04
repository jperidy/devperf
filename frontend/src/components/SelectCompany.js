import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//import Message from '../components/Message';
//import Button from 'react-bootstrap/Button';
//import SearchInput from '../components/SearchInput';
import { createAClient, getAllClients } from '../actions/clientActions';
//import { CLIENT_CREATE_RESET } from '../constants/clientConstants';

import CreatableSelect from 'react-select/creatable';

const SelectCompany = ({ company, setCompany, editRequest }) => {

    const dispatch = useDispatch();

    const clientAll = useSelector(state => state.clientAll);
    const { clients: companies } = clientAll;

    const clientCreate = useSelector(state => state.clientCreate);
    const { success } = clientCreate;

    useEffect(() => {
        //dispatch(getAllClients(searchCompany));
        dispatch(getAllClients(''));
    }, [dispatch, success]);

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

    return (
        <Row className='align-items-end'>
            <Col>
                <CreatableSelect
                    placeholder='Select a company'
                    isClearable
                    onChange={handleChange}
                    value={(company && company.label !=='') ? company : null}
                    options={companies && companies.map(company => ({ value: company._id, label: company.name }))}
                    isDisabled={!editRequest}
                />
            </Col>
        </Row>
    )
}

export default SelectCompany

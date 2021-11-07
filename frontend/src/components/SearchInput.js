import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
//import Input from 'react-bootstrap/Input';

// TO DELETE //////////////////////////////////////////////////////////////////////////////////////

const SearchInput = ({ title, searchValue, setSearchValue, possibilities, updateResult, editMode }) => {

    const size = 5;
    const [show, setShow] = useState(false);

    const onSearchValueChange = (value) => {
        setSearchValue(value);
        updateResult(null);
        if(value) {
            setShow(true);
        } else {
            setShow(false);
        }
    }

    const onClickHandler = (index, id, value) => {
        updateResult({id, value});
        setSearchValue('');
        setShow(false);
    }

    return (

        <Form.Group controlId='search-box' className='mb-0'>
            <Form.Label as='h5'>{title}</Form.Label>
            {editMode && (
                <div>
                    <Form.Control
                        type='text'
                        placeholder='Search box...'
                        value={searchValue && searchValue}
                        onChange={(e) => onSearchValueChange(e.target.value)}
                    ></Form.Control>
                    <ListGroup>
                        {show && possibilities && possibilities.splice(0, size).map(({ id, value }, index) => (
                            <ListGroup.Item
                                key={id}
                                action
                                variant='light'
                                onClick={() => onClickHandler(index, id, value)}
                            >{value}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}
        </Form.Group>
    )
}

export default SearchInput

import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

const SearchInput = ({ title, searchValue, setSearchValue, possibilities, updateResult, editMode }) => {

    const size = 5;
    const [show, setShow] = useState(false);

    const onSearchValueChange = (value) => {
        setSearchValue(value);
        setShow(true);
        updateResult(null);
        //setUpdate(true);
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
                <>
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
                                style={{ position: 'relative', zIndex: '10' }}
                                onClick={() => onClickHandler(index, id, value)}
                            >{value}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </>
            )}
        </Form.Group>
    )
}

export default SearchInput

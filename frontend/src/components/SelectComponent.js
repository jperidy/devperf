import React from 'react';
import Form from 'react-bootstrap/Form';

const SelectComponent = ({ editRequest, label, value, onChange, required, options }) => {
    return (
        <Form.Group controlId='type' className='mb-0'>
            <Form.Label as='h5'>{label} {editRequest && required && '*'}</Form.Label>
            {editRequest ? (
                <Form.Control
                    as='select'
                    className='border border-light border-top-0 border-right-0 border-left-0 rounded'
                    value={value ? value : ''}
                    onChange={(e) => onChange(e.target.value) }
                    required={required}
                >
                    {options}
                </Form.Control>
            ) : (
                <Form.Control
                    type='text'
                    className='pl-3 border border-light border-top-0 border-right-0 border-left-0 rounded bg-light'
                    plaintext
                    value={value ? value : ''}
                    readOnly
                ></Form.Control>
            )}
        </Form.Group>
    )
}

export default SelectComponent;

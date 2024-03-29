import React from 'react';
import Form from 'react-bootstrap/Form';

const DateComponent = ({ label, id, placeholder, value, onChange, required, editMode }) => {
    return (
        <Form.Group controlId={id} className='mb-0'>
            <Form.Label>{label} {editMode && required && '*'}</Form.Label>
            {editMode ? (
                <Form.Control
                    className='border border-light border-top-0 border-right-0 border-left-0'
                    type='date'
                    placeholder={placeholder}
                    value={value ? value : ''}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                ></Form.Control>
            ) : (
                <Form.Control
                    className='border border-light border-top-0 border-right-0 border-left-0 bg-light text-secondary'
                    type='date'
                    value={value ? value : ''}
                    plaintext
                    readOnly
                ></Form.Control>
            )}
        </Form.Group>
    )
}

export default DateComponent

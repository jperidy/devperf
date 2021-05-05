import React from 'react';
import Form from 'react-bootstrap/Form';

const TextAreaComponent = ({ label, id, editRequest, required, placeholder, value, onChange, rows}) => {
    return (
        <Form.Group controlId={id} className='mb-0'>
            <Form.Label as='h5'>{label} {editRequest && required && '*'}</Form.Label>
            {editRequest ? (
                <Form.Control
                    as='textarea'
                    rows={rows}
                    className='custom-select border border-light border-top-0 border-right-0 border-left-0'
                    placeholder={placeholder}
                    value={value ? value : ''}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                ></Form.Control>
            ) : (
                <Form.Control
                    as='textarea'
                    className='pl-3 border border-light border-top-0 border-right-0 border-left-0 bg-light text-secondary'
                    rows={rows}
                    value={value ? value : ''}
                    plaintext
                    readOnly
                ></Form.Control>
            )}
        </Form.Group>
    )
}

export default TextAreaComponent;

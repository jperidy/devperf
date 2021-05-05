import React from 'react';
import Form from 'react-bootstrap/Form';

const NumberComponent = ({ label, placeholder, id, min, max, step, value, onChange, required, editRequest  }) => {
    return (
        <Form.Group controlId={id} className='mb-0'>
            <Form.Label>{label} {editRequest && required && '*'}</Form.Label>
            {editRequest ? (
                <Form.Control
                    className='border border-light border-top-0 border-right-0 border-left-0'
                    type='number'
                    placeholder={placeholder}
                    min={Number(min)}
                    step={Number(step)}
                    value={value ? Number(value) : 0}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                ></Form.Control>
            ) : (
                <Form.Control
                    type='number'
                    className='border border-light border-top-0 border-right-0 border-left-0 bg-light text-secondary'
                    value={value ? value : 0}
                    plaintext
                    readOnly
                ></Form.Control>
            )}
        </Form.Group>
    )
};

export default NumberComponent;

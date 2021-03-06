import React from 'react';
import Form from 'react-bootstrap/Form';

const TextComponent = ({ label, id, placeholder, value, onChange, required, editRequest, formInline }) => {
    return (
        <Form.Group controlId={id} className={formInline ? 'mb-0 form-inline' : 'mb-0 '}>
            <Form.Label as='h5'>{label} {editRequest && required && '*'}</Form.Label>
            {editRequest ? (
                <Form.Control
                    type='text'
                    className='border border-light border-top-0 border-right-0 border-left-0'
                    placeholder={placeholder}
                    value={value ? value : ''}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                ></Form.Control>
            ) : (
                <Form.Control
                    type='text'
                    className='pl-3 border border-light border-top-0 border-right-0 border-left-0 bg-light text-secondary'
                    plaintext
                    value={value ? value : ''}
                    readOnly
                ></Form.Control>
            )}
        </Form.Group>
    )
}

export default TextComponent;

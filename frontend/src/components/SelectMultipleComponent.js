import React from 'react';
import Form from 'react-bootstrap/Form';

const SelectMultipleComponent = ({ label, id, editRequest, required, value, onChange, options }) => {

    const updateOthersPractices = () => {
        const selectedList = [];
        const selectBox = document.getElementById(id);
        for (let i = 0; i < selectBox.options.length; i++) {
            if (selectBox.options[i].selected) {
                selectedList.push(selectBox.options[i].value);
            }
        }
        onChange(selectedList);
    }

    return (
        <Form.Group controlId={id} className='mb-0'>
            <Form.Label as='h5'>{label} {editRequest && required && '*'}</Form.Label>
            {editRequest ? (
                <Form.Control
                    as='select'
                    className='custom-select border border-light border-top-0 border-right-0 border-left-0'
                    multiple
                    value={value ? value : []}
                    onChange={(e) => updateOthersPractices()}
                >
                    {options}
                </Form.Control>
            ) : (
                <Form.Control
                    type='text'
                    className='pl-3 border border-light border-top-0 border-right-0 border-left-0 bg-light text-secondary'
                    value={value ? value.join(', ') : ''}
                    plaintext
                    readOnly
                ></Form.Control>
            )}
        </Form.Group>
    )
}

export default SelectMultipleComponent;

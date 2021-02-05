import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const Rating = ({ value, setValue, text, color, editable }) => {

    const valueList = [...new Array(Math.floor(value)).fill(1)];
    if (value % 1 >= 0.5) {
        valueList.push(value % 1)
    }
    while (valueList.length < 5) {
        valueList.push(0)
    }

    return (
        
            <Form.Group className='mb-0'>
                <InputGroup>
                    {valueList && valueList.map((x, val) => (
                        <span key={val}>
                            <Button
                                className='mx-0 px-0'
                                variant='ligth'
                                onClick={() => { editable && (
                                    x >= 1
                                        ? setValue(val)
                                        : x >= 0.5
                                            ? setValue(val + 1)
                                            : setValue(val + 0.5)
                                )}}
                            ><i style={{ color }}
                                className={
                                    x >= 1
                                        ? 'fas fa-star'
                                        : x >= 0.5
                                            ? 'fas fa-star-half-alt'
                                            : 'far fa-star'
                                }>
                                </i></Button>

                        </span>
                    ))}
                    <span>{text && text}</span>
                </InputGroup>
            </Form.Group>

        

    )
};

Rating.defaultProps = {
    color: '#f8e825',
    text: '',
    editable: true,
};


Rating.propTypes = {
    value: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    color: PropTypes.string,
};

export default Rating;
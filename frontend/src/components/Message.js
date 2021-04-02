import React from 'react';
import { Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Message = ({ variant, children }) => {
    return (
        <Alert variant={variant} className='my-1'>
            {children}
        </Alert>
    )
};

Message.defaultProps = {
    variant: 'info',
};

Message.propTypes = {
    variant: PropTypes.string
}

export default Message;

import React from 'react';
import Alert from 'react-bootstrap/Alert';

const AlertUser = ({header, message, setShow}) => {

    return (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{header}</Alert.Heading>
                <p>
                    {message}
                </p>
        </Alert>
    )
}

export default AlertUser

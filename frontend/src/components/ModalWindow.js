import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ModalWindow = ({ onSubmit, onHide, show, header, title, isValid, body }) => {
    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {header}
        </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{title}</h4>
                {body}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide} variant='secondary'>Cancel</Button>
                <Button onClick={onSubmit} variant='primary' disabled={!isValid}>Submit</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalWindow;

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ModalWindow = ({ onSubmit, show, header, title, body }) => {
    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
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
                <Button onClick={onSubmit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalWindow;

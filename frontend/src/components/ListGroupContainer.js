import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ListGroupContainer = ({children, title, initial = true}) => {

    const [hide, setHide] = useState(initial);

    return (
        <Row className='mt-3'>
            <Col>
                <Button
                    onClick={() => setHide(!hide)}
                    variant='light'
                    className='text-left'
                    block
                ><h3>{hide ? (
                    <><i className="fas fa-caret-down"></i> {title}</>
                ) : (
                        <><i className="fas fa-caret-up"></i> {title}</>
                    )}</h3></Button>

                {!hide && children}
            </Col>
        </Row>
    )
}

export default ListGroupContainer

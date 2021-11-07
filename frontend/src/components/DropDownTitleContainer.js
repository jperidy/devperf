import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const DropDownTitleContainer = ({children, title, close}) => {

    const [hide, setHide] = useState(close);

    return (
        <Row className='mt-3'>
            <Col>
                <Button
                    onClick={() => setHide(!hide)}
                    variant='light'
                    className='text-left'
                    block
                > <h3>{hide ? (
                    <div><i className="fas fa-caret-down"></i> {title}</div>
                ) : (
                        <div><i className="fas fa-caret-up"></i> {title}</div>
                    )}</h3></Button>

                {!hide && children}
            </Col>
        </Row>
    )
}

DropDownTitleContainer.defaultProps = {
    close: true
};

export default DropDownTitleContainer

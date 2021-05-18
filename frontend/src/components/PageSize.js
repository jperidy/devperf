import React from 'react';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

const PageSize = ({ pageSize, setPageSize }) => {
    return (

        <Col>
            <InputGroup>
                <FormControl
                    as='select'
                    id='number-c'
                    className="mb-3"
                    value={pageSize && pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                >
                    <option value='all'>All data</option>
                    {[5, 10, 15, 20, 50].map(x => (
                        <option
                            key={x}
                            value={x}
                        >{x} / page</option>
                    ))}
                </FormControl>
            </InputGroup>
        </Col>

    )
}

export default PageSize;

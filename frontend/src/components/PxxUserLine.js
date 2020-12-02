import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

const PxxUserLine = ({ data }) => {

    const [prodDayComponent, setProdDayComponent] = useState(Number(data.prodDay));
    const [notProdDayComponent, setNotProdDayComponent] = useState(Number(data.notProdDay));
    const [leavingDayComponent, setLeavingDayComponent] = useState(Number(data.leavingDay));
    const [availableDayComponent, setAvailableDayComponent] = useState(Number(data.availableDay));
    const [submitButtonState, setSubmitButtonState] = useState(false);
    const workingDay = Number(data.prodDay) + Number(data.notProdDay) + Number(data.leavingDay) + Number(data.availableDay)

    useEffect(() => {
        const value = workingDay >= (prodDayComponent+notProdDayComponent+leavingDayComponent)
        setSubmitButtonState(value);
        setAvailableDayComponent(workingDay - (prodDayComponent + notProdDayComponent + leavingDayComponent))
    }, [prodDayComponent, 
        notProdDayComponent, 
        leavingDayComponent, 
        availableDayComponent,
        workingDay
        ]);
    

    const clickButtonHandler = () => {
        console.log('clickButtonHandler');
    };

    return (
        <>
            <Row className="py-3">
                <Col className="text-center align-middle">{data.month.name} <i> ({workingDay} days)</i></Col>
                <Col className="text-center align-middle">
                    <InputGroup>
                        <FormControl
                            type="number"
                            min={0}
                            max={data.workingDay}
                            step={0.5}
                            className="align-middle text-center"
                            value={prodDayComponent}
                            //onChange={(e) => changeHandler({ type:'prodDay', value: Number(e.target.value)})}
                            onChange={(e) => setProdDayComponent(Number(e.target.value))} 
                        />
                    </InputGroup>
                </Col>
                <Col className="text-center align-middle">
                    <InputGroup>
                        <FormControl
                            type="number"
                            min={0}
                            max={data.workingDay}
                            step={0.5}
                            className="align-middle text-center"
                            value={notProdDayComponent}
                            onChange={(e) => setNotProdDayComponent(Number(e.target.value))} 
                        />
                    </InputGroup>
                </Col>
                <Col className="text-center align-middle">
                    <InputGroup>
                        <FormControl
                            type="number"
                            min={0}
                            max={data.workingDay}
                            step={0.5}
                            className="align-middle text-center"
                            value={leavingDayComponent} 
                            onChange={(e) => setLeavingDayComponent(Number(e.target.value))} 
                        />
                    </InputGroup>
                </Col>
                <Col className="text-center align-middle">
                    <InputGroup>
                        <FormControl
                            type="number"
                            min={0}
                            max={data.workingDay}
                            step={0.5}
                            className="align-middle text-center"
                            value={availableDayComponent} 
                            //onChange={(e) => setAvailableDayComponent(Number(e.target.value))} 
                        />
                    </InputGroup>
                </Col>
                <Col className="text-center">
                    <Button
                        type='submit'
                        variant='primary'
                        disabled={submitButtonState ? false : true}
                        onClick={() => clickButtonHandler()}
                    >Submit</Button>
                </Col>
            </Row>
        </>
    )
}

export default PxxUserLine;

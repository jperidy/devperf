import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { updatePxx } from '../actions/pxxActions';

const PxxUserLine = ({ data }) => {

    const dispatch = useDispatch();

    const [prodDayComponent, setProdDayComponent] = useState(Number(data.prodDay));
    const [notProdDayComponent, setNotProdDayComponent] = useState(Number(data.notProdDay));
    const [leavingDayComponent, setLeavingDayComponent] = useState(Number(data.leavingDay));
    const [availableDayComponent, setAvailableDayComponent] = useState(Number(data.availableDay));
    const [submitButtonState, setSubmitButtonState] = useState(false);
    const [hasBeenModified, setHasBeenModified] = useState(false);
    const workingDay = Number(data.prodDay) + Number(data.notProdDay) + Number(data.leavingDay) + Number(data.availableDay)

    const pxxUpdate = useSelector(state => state.pxxUpdate);
    const { loading, error } = pxxUpdate;
    
    // Calculate firstday of current month to compare with firstDayMonth of displayed Pxx
    let firstDayOfCurrentMonth = new Date(Date.now());
    firstDayOfCurrentMonth.setDate(1);
    firstDayOfCurrentMonth = firstDayOfCurrentMonth.toISOString().substring(0,10);
    //const firstdayPxxMonth = data.month ? data.month.firstDay : 'Not Created yet';
    
    const editable = data.month ? (data.month.firstDay >= firstDayOfCurrentMonth) : false;


    useEffect(() => {
        const value = workingDay >= (prodDayComponent + notProdDayComponent + leavingDayComponent)
        setSubmitButtonState(value);
        setAvailableDayComponent(workingDay - (prodDayComponent + notProdDayComponent + leavingDayComponent))
    }, [prodDayComponent,
        notProdDayComponent,
        leavingDayComponent,
        availableDayComponent,
        workingDay
    ]);

    const clickButtonHandler = () => {

        dispatch(updatePxx({
            _id: data._id,
            name: data.name,
            month: data.month._id,
            prodDay: prodDayComponent,
            notProdDay: notProdDayComponent,
            leavingDay: leavingDayComponent,
            availableDay: availableDayComponent
        }))
        setHasBeenModified(false);
    };

    return (
        <>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
            <Row className="py-1">
                <Col xs={2} className="text-center align-middle"><b>{data.month ? data.month.name : 'Not created Yeat'}</b><br/><i>{workingDay ? `(${workingDay} days)` : null}</i></Col>
                <Col xs={2} className="text-center align-middle px-1">
                    <InputGroup>
                        <FormControl
                            type="number"
                            min={0}
                            max={(workingDay - notProdDayComponent - leavingDayComponent) ? (workingDay - notProdDayComponent - leavingDayComponent) : 0}
                            step={0.5}
                            disabled={!editable || !workingDay}
                            className="align-middle text-center p-0"
                            value={prodDayComponent ? prodDayComponent : 0}
                            onChange={(e) => {
                                setProdDayComponent(Number(e.target.value));
                                setHasBeenModified(true);
                            }}
                        />
                    </InputGroup>
                </Col>
                <Col xs={2} className="text-center align-middle px-1">
                    <InputGroup>
                        <FormControl
                            type="number"
                            min={0}
                            max={(workingDay - prodDayComponent - leavingDayComponent) ? (workingDay - prodDayComponent - leavingDayComponent) : 0}
                            step={0.5}
                            disabled={!editable || !workingDay}
                            className="align-middle text-center p-0"
                            value={notProdDayComponent ? notProdDayComponent : 0}
                            onChange={(e) => {
                                setNotProdDayComponent(Number(e.target.value));
                                setHasBeenModified(true);    
                            }}
                        />
                    </InputGroup>
                </Col>
                <Col xs={2} className="text-center align-middle px-1">
                    <InputGroup>
                        <FormControl
                            type="number"
                            min={0}
                            max={(workingDay - prodDayComponent - notProdDayComponent) ? (workingDay - prodDayComponent - notProdDayComponent) : 0}
                            step={0.5}
                            disabled={!editable || !workingDay}
                            className="align-middle text-center p-0"
                            value={leavingDayComponent ? leavingDayComponent : 0}
                            onChange={(e) => {
                                setLeavingDayComponent(Number(e.target.value));
                                setHasBeenModified(true);
                            }}
                        />
                    </InputGroup>
                </Col>
                <Col xs={2} className="text-center align-middle px-1">
                    <InputGroup>
                        <FormControl
                            type="number"
                            min={0}
                            max={workingDay ? workingDay : 0}
                            step={0.5}
                            className="align-middle text-center p-0"
                            value={availableDayComponent ? availableDayComponent : 0}
                            disabled
                        />
                    </InputGroup>
                </Col>
                <Col xs={2} className="text-center">
                    <Button
                        type='submit'
                        variant='outline-primary'
                        disabled={(submitButtonState && hasBeenModified) ? false : true}
                        onClick={() => clickButtonHandler()}
                    >Submit</Button>
                </Col>
            </Row>

            )}
        </>
    )
}

export default PxxUserLine;

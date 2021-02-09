import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { updatePxx } from '../actions/pxxActions';

const PxxUserLine = ({ data }) => {

    const dispatch = useDispatch();

    const [prodDayComponent, setProdDayComponent] = useState(Number(data.prodDay) || 0);
    const [notProdDayComponent, setNotProdDayComponent] = useState(Number(data.notProdDay) || 0);
    const [leavingDayComponent, setLeavingDayComponent] = useState(Number(data.leavingDay) || 0);
    const [availableDayComponent, setAvailableDayComponent] = useState(Number(data.availableDay) || 0);
    const [workingDay] = useState(Number(data.prodDay) + Number(data.notProdDay) + Number(data.leavingDay) + Number(data.availableDay));

    const [hasChange, setHasChange] = useState(false);

    // Calculate firstday of current month to compare with firstDayMonth of displayed Pxx
    let firstDayOfCurrentMonth = new Date(Date.now());
    firstDayOfCurrentMonth.setDate(1);
    firstDayOfCurrentMonth = firstDayOfCurrentMonth.toISOString().substring(0, 10);

    const editable = data.month ? (data.month.firstDay >= firstDayOfCurrentMonth) : false;

    useEffect(() => {
        if (hasChange && workingDay >= (prodDayComponent + notProdDayComponent + leavingDayComponent)) {
            setAvailableDayComponent(workingDay - (prodDayComponent + notProdDayComponent + leavingDayComponent))
            dispatch(updatePxx({
                _id: data._id,
                name: data.name,
                month: data.month._id,
                prodDay: prodDayComponent,
                notProdDay: notProdDayComponent,
                leavingDay: leavingDayComponent,
                availableDay: workingDay - (prodDayComponent + notProdDayComponent + leavingDayComponent)
            }));
            setHasChange(false);
        }
    // eslint-disable-next-line
    },[workingDay, prodDayComponent, notProdDayComponent, leavingDayComponent, data]);

    return (
        <>
            <Row className="py-1">
                <Col xs={4} className="text-center align-middle"><b>{data.month ? data.month.name : 'Not created Yeat'}</b> <i>{workingDay ? `(${workingDay}d)` : null}</i></Col>
                <Col xs={2} className="text-center align-middle px-1">
                    <InputGroup>
                        <FormControl
                            type="number"
                            min={0}
                            max={(workingDay - notProdDayComponent - leavingDayComponent) ? (workingDay - notProdDayComponent - leavingDayComponent) : '-'}
                            step={0.5}
                            disabled={!editable || !workingDay}
                            className="align-middle text-center p-0"
                            value={prodDayComponent && prodDayComponent.toString()}
                            onChange={(e) => {
                                setProdDayComponent(Number(e.target.value));
                                setHasChange(true);
                            }}
                        />
                    </InputGroup>
                </Col>
                <Col xs={2} className="text-center align-middle px-1">
                    <InputGroup>
                        <FormControl
                            type="number"
                            min={0}
                            max={(workingDay - prodDayComponent - leavingDayComponent) ? (workingDay - prodDayComponent - leavingDayComponent) : '-'}
                            step={0.5}
                            disabled={!editable || !workingDay}
                            className="align-middle text-center p-0"
                            value={notProdDayComponent && notProdDayComponent.toString()}
                            onChange={(e) => {
                                if (!e.target.value.toString().match(/[0-9]*[,.]$/g)) {
                                    setNotProdDayComponent(Number(e.target.value));
                                    setHasChange(true);
                                }
                            }}
                        />
                    </InputGroup>
                </Col>
                <Col xs={2} className="text-center align-middle px-1">
                    <InputGroup>
                        <FormControl
                            type="number"
                            min={0}
                            max={(workingDay - prodDayComponent - notProdDayComponent) ? (workingDay - prodDayComponent - notProdDayComponent) : '-'}
                            step={0.5}
                            disabled={!editable || !workingDay}
                            className="align-middle text-center p-0"
                            value={leavingDayComponent && leavingDayComponent.toString()}
                            onChange={(e) => {
                                setLeavingDayComponent(Number(e.target.value));
                                setHasChange(true);
                            }}
                        />
                    </InputGroup>
                </Col>
                <Col xs={2} className="text-center align-middle px-1">
                    <InputGroup>
                        <FormControl
                            type="number"
                            min={0}
                            max={workingDay ? workingDay : '-'}
                            step={0.5}
                            className="align-middle text-center p-0"
                            value={availableDayComponent && availableDayComponent.toString()}
                            disabled
                        />
                    </InputGroup>
                </Col>

            </Row>
        </>
    )
}

export default PxxUserLine;

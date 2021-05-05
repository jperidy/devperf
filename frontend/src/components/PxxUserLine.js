import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
// import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import { updatePxx } from '../actions/pxxActions';

const PxxUserLine = ({ data }) => {

    const dispatch = useDispatch();

    // const [prodDayComponent, setProdDayComponent] = useState(Number(data.prodDay) ? Number(data.prodDay) : 0);
    // const [notProdDayComponent, setNotProdDayComponent] = useState(Number(data.notProdDay) ? Number(data.notProdDay) : 0);
    // const [leavingDayComponent, setLeavingDayComponent] = useState(Number(data.leavingDay) ? Number(data.leavingDay) : 0);
    const [prodDayComponent, setProdDayComponent] = useState(data.prodDay ? data.prodDay : '0');
    const [notProdDayComponent, setNotProdDayComponent] = useState(data.notProdDay ? data.notProdDay : '0');
    const [leavingDayComponent, setLeavingDayComponent] = useState(data.leavingDay ? data.leavingDay : '0');
    const [availableDayComponent, setAvailableDayComponent] = useState(Number(data.availableDay) ? Number(data.availableDay) : 0);
    const [workingDay] = useState(Number(data.prodDay) + Number(data.notProdDay) + Number(data.leavingDay) + Number(data.availableDay));

    const [hasChange, setHasChange] = useState(false);

    // Calculate firstday of current month to compare with firstDayMonth of displayed Pxx
    let firstDayOfCurrentMonth = new Date(Date.now());
    firstDayOfCurrentMonth.setDate(1);
    firstDayOfCurrentMonth = firstDayOfCurrentMonth.toISOString().substring(0, 10);

    const editable = data.month ? (data.month.firstDay >= firstDayOfCurrentMonth) : false;

    useEffect(() => {
        const prd = transformNumber(prodDayComponent);
        const nPrd = transformNumber(notProdDayComponent);
        const lvg = transformNumber(leavingDayComponent);

        if (hasChange && workingDay >= (prd + nPrd + lvg)) {
            setAvailableDayComponent(workingDay - (prd + nPrd + lvg))
            dispatch(updatePxx({
                _id: data._id,
                name: data.name,
                month: data.month._id,
                prodDay: prd,
                notProdDay: nPrd,
                leavingDay: lvg,
                availableDay: workingDay - (prd + nPrd + lvg)
            }));
            setHasChange(false);
        }
    // eslint-disable-next-line
    },[workingDay, prodDayComponent, notProdDayComponent, leavingDayComponent, data]);

    // useEffect(() => {
    //     if (hasChange && workingDay >= (prodDayComponent + notProdDayComponent + leavingDayComponent)) {
    //         setAvailableDayComponent(workingDay - (prodDayComponent + notProdDayComponent + leavingDayComponent))
    //         dispatch(updatePxx({
    //             _id: data._id,
    //             name: data.name,
    //             month: data.month._id,
    //             prodDay: prodDayComponent,
    //             notProdDay: notProdDayComponent,
    //             leavingDay: leavingDayComponent,
    //             availableDay: workingDay - (prodDayComponent + notProdDayComponent + leavingDayComponent)
    //         }));
    //         setHasChange(false);
    //     }
    // // eslint-disable-next-line
    // },[workingDay, prodDayComponent, notProdDayComponent, leavingDayComponent, data]);

    const transformNumber = (value) => {
        if(value.toString().match(/^[0-9]{0,}[.,]$/i)){
            return Number(value + '0');
        } else {
            return Number(value);
        }
    }

    return (
        <>
            <Row className="py-1">
                <Col xs={4} className="text-center align-middle"><b>{data.month ? data.month.name : 'Not created Yeat'}</b> <i>{workingDay ? `(${workingDay}d)` : null}</i></Col>
                <Col xs={2} className="text-center align-middle px-1">
                    <InputGroup>
                        <Form.Control
                            type="number"
                            min={0}
                            max={(workingDay - notProdDayComponent - leavingDayComponent) ? (workingDay - notProdDayComponent - leavingDayComponent) : '-'}
                            step={0.5}
                            placeholder='-'
                            disabled={!editable || !workingDay}
                            className="align-middle text-center p-0"
                            value={prodDayComponent && prodDayComponent.toString()}
                            onChange={(e) => {
                                //setProdDayComponent(Number(e.target.value));
                                if (e.target.value.match(/^[0-9]{0,}[.,][05]{0,1}$|^[0-9]{0,}$/i)) {
                                    setProdDayComponent(e.target.value);
                                    setHasChange(true);
                                }
                            }}
                        ></Form.Control>
                    </InputGroup>
                </Col>
                <Col xs={2} className="text-center align-middle px-1">
                    <InputGroup>
                        <Form.Control
                            type="number"
                            min={0}
                            max={(workingDay - prodDayComponent - leavingDayComponent) ? (workingDay - prodDayComponent - leavingDayComponent) : '-'}
                            step={0.5}
                            placeholder='-'
                            disabled={!editable || !workingDay}
                            className="align-middle text-center p-0"
                            value={notProdDayComponent && notProdDayComponent.toString()}
                            onChange={(e) => {
                                if (e.target.value.match(/^[0-9]{0,}[.,][05]{0,1}$|^[0-9]{0,}$/i)) {
                                    //setNotProdDayComponent(Number(e.target.value));
                                    setNotProdDayComponent(e.target.value);
                                    setHasChange(true);
                                }
                            }}
                        ></Form.Control>
                    </InputGroup>
                </Col>
                <Col xs={2} className="text-center align-middle px-1">
                    <InputGroup>
                        <Form.Control
                            type="number"
                            min={0}
                            max={(workingDay - prodDayComponent - notProdDayComponent) ? (workingDay - prodDayComponent - notProdDayComponent) : '-'}
                            step={0.5}
                            placeholder='-'
                            disabled={!editable || !workingDay}
                            className="align-middle text-center p-0"
                            value={leavingDayComponent && leavingDayComponent.toString()}
                            onChange={(e) => {
                                if (e.target.value.match(/^[0-9]{0,}[.,][05]{0,1}$|^[0-9]{0,}$/i)) {
                                    //setLeavingDayComponent(Number(e.target.value));
                                    setLeavingDayComponent(e.target.value);
                                    setHasChange(true);
                                }
                            }}
                        ></Form.Control>
                    </InputGroup>
                </Col>
                <Col xs={2} className="text-center align-middle px-1">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            //min={0}
                            //max={workingDay ? workingDay : '-'}
                            //step={0.5}
                            placeholder='-'
                            className="align-middle text-center p-0"
                            value={availableDayComponent && availableDayComponent.toString()}
                            disabled
                        ></Form.Control>
                    </InputGroup>
                </Col>

            </Row>
        </>
    )
}

export default PxxUserLine;

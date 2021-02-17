import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import DisplayChildren from '../components/DisplayChildren';
import { createTaceData } from '../actions/taceActions';


const Tace = ({ tace, practice }) => {

    const dispatch = useDispatch();

    const [target, setTarget] = useState(tace.target);
    const [bid, setBid] = useState(tace.bid);
    const [editRequest, setEditRequest] = useState(false);
    const [update, setUpdate] = useState(false);

    const [missingFTEToBid, setMissingFTEToBid] = useState('');
    const [missingFTEToTarget, setMissingFTEToTarget] = useState('');

    const createTace = useSelector(state => state.createTace);
    const { success } = createTace;

    useEffect(() => {
        if(update) {
            dispatch(createTaceData({
                month:tace.month._id,
                practice: practice,
                target: target,
                bid: bid,
            }))
            setUpdate(false);
        }
    }, [dispatch, createTace, update, practice, tace, target, bid]);

    useEffect(() => {
        
        const prodDay = Number(tace.totalProdDay);
        const totalProdDayToBid = Number(bid) / 100 * (Number(tace.totalProdDay) + Number(tace.totalNotProdDay) + Number(tace.totalAvailableDay));
        const totalProdDayToTarget = Number(target) / 100 * (Number(tace.totalProdDay) + Number(tace.totalNotProdDay) + Number(tace.totalAvailableDay));
    
        const today = new Date(Date.now());
        const lastMonthDay = new Date(Date.now());
        lastMonthDay.setUTCMonth(lastMonthDay.getUTCMonth() + 1);
        lastMonthDay.setUTCDate(1);

        const todayToEnd = (lastMonthDay - today) / (3600 * 24 * 1000);

        if(bid) {
            const missingFTEToBidCalculated = (prodDay - totalProdDayToBid) / todayToEnd;
            setMissingFTEToBid(missingFTEToBidCalculated);
        }
        if(target){
            const missingFTEToTargetCalculated = (prodDay - totalProdDayToTarget) / todayToEnd;
            setMissingFTEToTarget(missingFTEToTargetCalculated);
        }

    },[tace, bid, target]);


    return (

        <Col sm={12} md={4}>
            <Card className='my-3 p-3 rounded'>
                <Card.Header as="h5">{tace.month.firstDay.toString().substring(0, 7)}</Card.Header>
                <Card.Body className='p-1 mt-3'>
                    <Card.Text as='h4'>Tace <Button 
                                                size='sm' 
                                                variant='ligth'
                                                onClick={() => {
                                                    if(editRequest) {
                                                        setUpdate(true)
                                                    }
                                                    setEditRequest(!editRequest)}
                                                }
                                                ><i className="fas fa-edit"></i></Button>
                    </Card.Text>

                    <ListGroup>
                        <ListGroup.Item className='py-1 bg-primary text-white'>
                            <Row>
                                <Col className='text-center' xs={4}><strong>Current</strong></Col>
                                <Col className='text-center' xs={4}><strong>Target</strong></Col>
                                <Col className='text-center' xs={4}><strong>Bid</strong></Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row className='align-items-center'>
                                <Col className='text-center' xs={4}>{(Number(tace.totalTACE) * 100).toFixed(1)} %</Col>
                                
                                <Col className='text-center' xs={4}>
                                    <Form.Group controlId='tace-target' className='mb-0'>
                                        {editRequest ? (
                                            <Form.Control
                                                type='Number'
                                                className='text-center'
                                                min={0}
                                                max={100}
                                                step={0.1}
                                                value={target}
                                                onChange={(e) => setTarget(e.target.value)}
                                            ></Form.Control>
                                        ) : (
                                                <Row className='align-items-center'>
                                                    <Col className='m-0 p-0'>
                                                        <Form.Control
                                                            type='text'
                                                            className='text-right'
                                                            plaintext
                                                            value={target}
                                                            readOnly
                                                        ></Form.Control>
                                                    </Col>
                                                    <Col className='m-0 p-0 text-left'>&nbsp;%</Col>
                                                </Row>
                                            )}
                                    </Form.Group>
                                </Col>
                                <Col className='text-center' xs={4}>
                                    <Form.Group controlId='title' className='mb-0'>
                                        {editRequest ? (
                                            <Form.Control
                                                type='Number'
                                                className='text-center'
                                                min={0}
                                                max={100}
                                                step={0.1}
                                                value={bid}
                                                onChange={(e) => setBid(e.target.value)}
                                            ></Form.Control>
                                        ) : (
                                                <Row className='align-items-center'>
                                                    <Col className='m-0 p-0'>
                                                        <Form.Control
                                                            type='text'
                                                            className='text-right'
                                                            plaintext
                                                            value={bid}
                                                            readOnly
                                                        ></Form.Control>
                                                    </Col>
                                                    <Col className='m-0 p-0 text-left'>&nbsp;%</Col>
                                                </Row>
                                            )}
                                    </Form.Group>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col xs={4}>&Delta; FTE</Col>
                                <Col xs={4} className='text-center'>{missingFTEToTarget && missingFTEToTarget.toFixed(2)}</Col>
                                <Col xs={4} className='text-center'>{missingFTEToBid && missingFTEToBid.toFixed(2)}</Col>
                            </Row>
                        </ListGroup.Item>
                    </ListGroup>

                    <ListGroup className='mt-3'>
                        <ListGroup.Item className='py-1 bg-primary text-white'>
                            <Row>
                                <Col><strong>Leaving</strong></Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col className='text-right'>{(Number(tace.totalLeaving) * 100).toFixed(2)} %</Col>
                            </Row>
                        </ListGroup.Item>
                    </ListGroup>

                    <ListGroup className='mt-3'>
                        <ListGroup.Item className='py-1 bg-primary text-white'>
                            <Row>
                                <Col><strong>FTE</strong></Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col className='text-right'>{tace.totalETP && tace.totalETP.toFixed(2)}</Col>
                            </Row>
                        </ListGroup.Item>
                    </ListGroup>  
                </Card.Body>
                <Card.Footer className='mt-3'>
                    <DisplayChildren access='tace'>
                        <Link to={`/pxxdetails/${tace.month._id}`}>View details</Link>
                    </DisplayChildren>
                </Card.Footer>
            </Card>
        </Col>

    )
}

export default Tace;

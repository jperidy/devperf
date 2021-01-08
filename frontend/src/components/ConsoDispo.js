import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { getAvailabilities } from '../actions/pxxActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';

const ConsoDispo = ({ practice, start, end, mode, addStaff }) => {

    const dispatch = useDispatch();

    const [focus, setFocus] = useState('');
    const [searchSkills, setSearchSkills] = useState('');
    const [searchExperienceStart, setSearchExperienceStart] = useState('');
    const [searchExperienceEnd, setSearchExperienceEnd] = useState('');

    const pxxAvailabilities = useSelector(state => state.pxxAvailabilities);
    const { loading: loadingAvailabilities, error: errorAvailabilities, availabilities } = pxxAvailabilities;

    useEffect(() => {
        if (!loadingAvailabilities) {
            dispatch(getAvailabilities(practice, start, end, '', '', ''));
        }
        // eslint-disable-next-line
    }, [dispatch, practice, start, end]);

    const formatName = (fullName) => {
        const separateName = fullName.split(' ');
        if (separateName.length === 1) {
            return separateName[0];
        } else {
            const outName = separateName.map((word, indice1) => {
                if (indice1 === 0) {
                    return word[0].toUpperCase() + '.';
                } else {
                    return word.toUpperCase();
                }
            });
            return outName.join(' ');
        }
    }

    const handlerSkillsSubmit = (e) => {
        e.preventDefault();
        dispatch(getAvailabilities(practice, start, end, searchSkills, searchExperienceStart, searchExperienceEnd));
    };

    return (
        <>
            <Row className='mt-5'>
                <Col md={12}>
                    <Form onSubmit={handlerSkillsSubmit}>
                        <Form.Row>
                            <Col md={5}>
                                <Form.Group controlId='skill-search'>
                                    <Form.Control
                                        type='text'
                                        placeholder='Search: skill1 ; skill2'
                                        value={searchSkills && searchSkills}
                                        onChange={(e) => setSearchSkills(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={2}>
                                <Form.Group controlId='experience-search-start'>
                                    <Form.Control
                                        type='number'
                                        min={0}
                                        step={0.1}
                                        placeholder='From (year)'
                                        value={searchExperienceStart && searchExperienceStart}
                                        onChange={(e) => setSearchExperienceStart(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={2}>
                                <Form.Group controlId='experience-search-end'>
                                    <Form.Control
                                        type='number'
                                        step={0.1}
                                        min={searchExperienceStart || 0}
                                        placeholder='To (year)'
                                        value={searchExperienceEnd && searchExperienceEnd}
                                        onChange={(e) => setSearchExperienceEnd(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={1}>
                                <Button 
                                    type='submit' 
                                    variant='primary'
                                    block
                                >Search</Button>
                            </Col>
                            <Col md={2}>
                                <OverlayTrigger
                                    trigger="click"
                                    placement="right"
                                    overlay={
                                        <Popover id="popover-basic">
                                            <Popover.Title as="h3">How to use search box</Popover.Title>
                                            <Popover.Content>
                                                Example: <strong>workpl ; telec</strong> will find workplace or telecom 
                                            </Popover.Content>
                                        </Popover>
                                    }>
                                    <Button 
                                        variant="light"
                                        block
                                    >info  <i className="fas fa-info-circle ml-3"></i></Button>
                                </OverlayTrigger>

                                
                            </Col>
                        </Form.Row>
                    </Form>

                </Col>
            </Row>

            {[['Analyst'], ['Consultant'], ['Senior consultant'], ['Manager', 'Senior manager', 'Director', 'Partner']].map((grades, gradVal) => (

                <div key={gradVal}>

                    <Row className='mt-3'>
                        <Col>
                            <h5>{grades.join(', ')}</h5>
                        </Col>
                    </Row>

                    <Row className='mt-3'>
                        {loadingAvailabilities ? <Loader /> : errorAvailabilities ? <Message variant='danger'>{errorAvailabilities}</Message> : (
                            availabilities && availabilities.map((x, xVal) => (
                                <Col key={xVal} sm={12} md={6} lg={4} xl={3}>
                                    <Card className='my-1 rounded' >
                                        <Card.Header as="h5">{x.month.firstDay.toString().substring(0, 7)}</Card.Header>
                                        <Card.Body>
                                            {x.availabilities.map((y, yVal) => (
                                                grades.includes(y.grade) && (
                                                    <Row key={yVal}>
                                                        {mode === 'staffing' && (
                                                            <Col sm={2}>
                                                                <Button
                                                                    size='sm'
                                                                    variant='ligth'
                                                                    onClick={() => addStaff(y)}
                                                                ><i className="fas fa-plus-square"></i></Button>
                                                            </Col>
                                                        )}
                                                        <Col sm={10}>
                                                            <OverlayTrigger
                                                                placement="bottom"
                                                                overlay={<Tooltip id="button-tooltip-2">{
                                                                    <>
                                                                        <>{y.valued && ((Date.now() - new Date(y.valued)) / (1000 * 24 * 3600 * 365.25)).toString().substring(0, 4)} years</><br />
                                                                        <>{y.comment ? y.comment : 'no comment'}</>
                                                                    </>
                                                                }</Tooltip>}
                                                            >
                                                                <Form.Control
                                                                    plaintext
                                                                    readOnly
                                                                    id={y.email}
                                                                    value={y.availableDay.toString() + ' days : ' + formatName(y.name)}
                                                                    style={(y.email === focus) ? { background: '#464277', color: 'white' } : { color: 'black' }}
                                                                    onFocus={(e) => {
                                                                        setFocus(e.target.id)
                                                                    }}
                                                                />
                                                            </OverlayTrigger>
                                                        </Col>
                                                    </Row>
                                                )
                                            ))}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>
                </div>
            ))}
        </>
    )
}

export default ConsoDispo

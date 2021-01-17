import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';



const SkillDisplayLine = ({ consultantId, skill, val, handleUpdateSkillLevel, handlerDeleteConsultantSkill}) => {

    const [level, setLevel] = useState(skill.level);

    return (
        <>
            <Form.Row key={val}>
                <Col xs={12} md={3}>
                    <Form.Group controlId='skillcategory'>
                        <Form.Control
                            plaintext
                            readOnly
                            value={skill.skill && skill.skill.category}
                        ></Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Group controlId='skillName'>
                        <Form.Control
                            plaintext
                            readOnly
                            value={skill.skill && skill.skill.name}
                        ></Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Group controlId='skillLevel'>
                        <Form.Control
                            type='Number'
                            min={1}
                            max={3}
                            value={Number(level)}
                            onChange={(e) => {
                                setLevel(e.target.value);
                                handleUpdateSkillLevel(consultantId, skill.skill._id, e.target.value)
                            }}
                        ></Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Group>
                        <InputGroup>
                            <Button
                                block
                                variant="danger"
                                onClick={() => handlerDeleteConsultantSkill(consultantId, skill.skill._id)}
                            ><i className="fas fa-times-circle"></i></Button>
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Form.Row>
        </>
    )
}

export default SkillDisplayLine;

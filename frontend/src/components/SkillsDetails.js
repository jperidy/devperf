import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';

import ListGroup from 'react-bootstrap/ListGroup';
import { consultantAddASkill, consultantDeleteSkill, consultantUpdateASkillLevel, getAllConsultantSkills, getConsultantSkills } from '../actions/consultantActions';

const SkillsDetails = ({consultantId, close=true}) => {

    const dispatch = useDispatch();

    const [skillCategory, setSkillCategory] = useState('default');
    const [skillId, setSkillId] = useState('default');
    const [skillLevel, setSkillLevel] = useState(1);
    const [skillCategoryList, setSkillCategoryList] = useState([]);
    const [quality, setQuality] = useState([]);

    const [update, setUpdate] = useState(false);


    const consultantAllSkills = useSelector(state => state.consultantAllSkills);
    const { skills: skillsAll } = consultantAllSkills;

    const consultantSkills = useSelector(state => state.consultantSkills);
    const { loading, skills } = consultantSkills;

    const consultantAddSkill = useSelector(state => state.consultantAddSkill);
    const { loading: loadingConsultantAddSkill, success: successConsultantAddSkill, error: errorConsultantAddSkill } = consultantAddSkill;

    const consultantUpdateSkill = useSelector(state => state.consultantUpdateSkill);
    const { loading: loadingConsultantUpdateSkill, success: successConsultantUpdateSkill, error: errorConsultantUpdateSkill } = consultantUpdateSkill;

    const consultantDeleteSkillReducer = useSelector(state => state.consultantDeleteSkill);
    const { success: successConsultantDeleteSkill } = consultantDeleteSkillReducer;

    useEffect(() => {
        if (!skillsAll) {
            dispatch(getAllConsultantSkills());
        }
    }, [dispatch, skillsAll]);

    useEffect(() => {
        if (!skills && !loading) {
            dispatch(getConsultantSkills(consultantId));
        } else {
            setQuality(skills)
        }
    }, [dispatch, skills, consultantId, loading]);

    useEffect(() => {
        if(update && !loading) {
            dispatch(getConsultantSkills(consultantId));
            setUpdate(false);
        }
    }, [dispatch, update, consultantId, loading])

    useEffect(() => {
        if (skillsAll) {
            let categoryList = skillsAll.map(x => x.category);
            categoryList = [...new Set(categoryList)];
            setSkillCategoryList(categoryList);
        }
    }, [skillsAll]);

    useEffect(() => {
        if ((successConsultantAddSkill || successConsultantDeleteSkill)) {
            setUpdate(true);
        }
    }, [
        successConsultantAddSkill,
        //successConsultantUpdateSkill,
        successConsultantDeleteSkill,
    ]);

    const handleAddSkill = (consultantId, skillId, skillLevel) => {
        dispatch(consultantAddASkill(consultantId, skillId, skillLevel));
    }

    const handlerDeleteConsultantSkill = (consultantId, skillId) => {
        dispatch(consultantDeleteSkill(consultantId, skillId));
    }

    const handleUpdateSkillLevel = (consultantId, skillId, level) => {
        //console.log(consultantId, skillId, level)
        dispatch(consultantUpdateASkillLevel(consultantId, skillId, level));
    }

    return (

        <DropDownTitleContainer title='Skills' close={close}>

            <ListGroup.Item>
                <h4>Add skills</h4> 

                <Form.Row className='mt-3 align-items-end'>
                    <Col xs={12} md={3}>
                        <Form.Group controlId='skillCategory'>
                            <Form.Label><strong>Category</strong></Form.Label>
                            <Form.Control
                                as='select'
                                value={skillCategory ? skillCategory : 'default'}
                                onChange={(e) => setSkillCategory(e.target.value)}
                                required
                            >
                                <option value='default'>Please Select</option>
                                {skillCategoryList && (
                                    skillCategoryList.map((x, val) => (
                                        <option
                                            value={x}
                                            key={val}
                                            onChange={(e) => { setSkillCategory(e.target.value) }}
                                        >{x}</option>
                                    )))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3} >
                        <Form.Group controlId='skillName'>
                            <Form.Label><strong>Skill</strong></Form.Label>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id="button-tooltip-2">{skillId && skillsAll ? skillsAll.map(x => (x._id === skillId) && x.description) : 'no description'}</Tooltip>}
                            >
                                <Form.Control
                                    as='select'
                                    value={skillId ? skillId : 'default'}
                                    onChange={(e) => setSkillId(e.target.value)}
                                    required
                                >
                                    <option value='default'>Please Select</option>
                                    {skillsAll && skillCategory && (
                                        skillsAll.map((x, val) => (
                                            x.category === skillCategory && (
                                                <option
                                                    value={x._id}
                                                    key={val}
                                                >{x.name}</option>
                                            )
                                        )))}

                                </Form.Control>
                            </OverlayTrigger>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3} >
                        <Form.Group controlId='skillLevel'>
                            <Form.Label><strong>Level</strong></Form.Label>
                            <Form.Control
                                as='select'
                                value={skillLevel ? skillLevel : 1}
                                onChange={(e) => setSkillLevel(e.target.value)}
                                required
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>

                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3} className='align-items-bottom'>
                        <Form.Group>
                            <InputGroup>
                                <Button
                                    block
                                    onClick={() => handleAddSkill(consultantId, skillId, skillLevel)}
                                >{loadingConsultantAddSkill ? <Loader /> : 'Add'}</Button>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Form.Row>

                {errorConsultantUpdateSkill && <Message variant='danger'>{errorConsultantUpdateSkill}</Message>}
                {errorConsultantAddSkill && <Message variant='danger'>{errorConsultantAddSkill}</Message>}
                {errorConsultantUpdateSkill && <Message variant='danger'>{errorConsultantUpdateSkill}</Message>}

            </ListGroup.Item>

            <ListGroup.Item>
                {quality && quality.length ? (
                    <ListGroup variant='flush'>
                        {quality.map((x, val) => (
                            <ListGroup.Item key={val}>
                                <SkillDisplayLine
                                    consultantId={consultantId}
                                    key={val}
                                    skill={x}
                                    val={val}
                                    handleUpdateSkillLevel={handleUpdateSkillLevel}
                                    handlerDeleteConsultantSkill={handlerDeleteConsultantSkill}
                                />
                            </ListGroup.Item>
                        ))}
                        <Form.Row>
                            <Col xs={6} md={8}></Col>
                            <Col xs={6} md={4} className='text-center'>{loadingConsultantUpdateSkill && <Loader />}</Col>
                        </Form.Row>
                    </ListGroup>
                ) : <p>Please add qualities</p>}
            </ListGroup.Item>
        </DropDownTitleContainer>
    )
}

const SkillDisplayLine = ({ consultantId, skill, val, handleUpdateSkillLevel, handlerDeleteConsultantSkill}) => {

    const [level, setLevel] = useState(skill.level);

    return (
        <>
            <Form.Row key={val}>
                <Col xs={3}>
                    <Form.Group controlId='skillcategory'>
                        <Form.Control
                            plaintext
                            readOnly
                            value={skill.skill && skill.skill.category}
                        ></Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={3}>
                    <Form.Group controlId='skillName'>
                        <Form.Control
                            plaintext
                            readOnly
                            value={skill.skill && skill.skill.name}
                        ></Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={3}>
                    <Form.Group controlId='skillLevel'>
                        <Form.Control
                            type='Number'
                            min={1}
                            max={3}
                            value={Number(level)}
                            onChange={(e) => {
                                setLevel(e.target.value);
                                //console.log(consultantId, skill.skill._id, e.target.value)
                                handleUpdateSkillLevel(consultantId, skill.skill._id, e.target.value)
                            }}
                        ></Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={3}>
                    <Form.Group>
                        <InputGroup>
                            <Button
                                block
                                style={{color:'grey'}}
                                variant="white"
                                onClick={() => handlerDeleteConsultantSkill(consultantId, skill.skill._id)}
                            ><i className="fas fa-times-circle"></i></Button>
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Form.Row>
        </>
    )
}

export default SkillsDetails

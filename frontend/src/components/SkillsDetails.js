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
import Rating from './Rating';

const SkillsDetails = ({consultantId, close=true, editable=true}) => {

    const dispatch = useDispatch();

    const [skillCategory, setSkillCategory] = useState('default');
    const [skillId, setSkillId] = useState('default');
    const [skillLevel, setSkillLevel] = useState(1);
    const [skillCategoryList, setSkillCategoryList] = useState([]);

    const [qualityOrdonned, setQualityOrdonned] = useState([]);

    const [update, setUpdate] = useState(false);


    const consultantAllSkills = useSelector(state => state.consultantAllSkills);
    const { skills: skillsAll } = consultantAllSkills;

    const consultantSkills = useSelector(state => state.consultantSkills);
    const { loading, skills } = consultantSkills;

    const consultantAddSkill = useSelector(state => state.consultantAddSkill);
    const { loading: loadingConsultantAddSkill, success: successConsultantAddSkill, error: errorConsultantAddSkill } = consultantAddSkill;

    const consultantUpdateSkill = useSelector(state => state.consultantUpdateSkill);
    const { error: errorConsultantUpdateSkill } = consultantUpdateSkill;

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
            if (skills) {
                //setQuality(skills)
                const ordonnedSkills = orderSkills(skills);
                setQualityOrdonned(ordonnedSkills);
            }
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
        successConsultantDeleteSkill,
    ]);

    const orderSkills = (skills) => {
        const categoryList = [...new Set(skills.map(x => x.skill.category))]
        const orderSkills = []
        for (let incr = 0 ; incr < categoryList.length ; incr++) {
            orderSkills.push({
                category: categoryList[incr],
                data: skills.filter( x => x.skill.category === categoryList[incr])
            })
        }
        return orderSkills;
    }

    const handleAddSkill = (consultantId, skillId, skillLevel) => {
        dispatch(consultantAddASkill(consultantId, skillId, skillLevel));
    }

    const handlerDeleteConsultantSkill = (consultantId, skillId) => {
        dispatch(consultantDeleteSkill(consultantId, skillId));
    }

    const handleUpdateSkillLevel = (consultantId, skillId, level) => {
        dispatch(consultantUpdateASkillLevel(consultantId, skillId, level));
    }

    return (

        <DropDownTitleContainer title='Skills' close={close}>

            {editable && (
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
                                                //onChange={(e) => { setSkillCategory(e.target.value) }}
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
                                    type='number'
                                    min={0}
                                    max={5}
                                    step={0.5}
                                    value={skillLevel ? skillLevel : 1}
                                    onChange={(e) => setSkillLevel(e.target.value)}
                                    required
                                ></Form.Control>
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

            )}
            
            
            <ListGroup.Item>
                {qualityOrdonned && qualityOrdonned.length ? (
                    <ListGroup variant='flush'>
                        {qualityOrdonned.map((categoryList,val) => (
                            <ListGroup.Item key={val}>
                                <h4>{categoryList.category}</h4>
                                {categoryList.data.map( (x,val) => (
                                    <SkillDisplayLine 
                                        consultantId={consultantId}
                                        key={val}
                                        skill={x}
                                        val={val}
                                        handleUpdateSkillLevel={handleUpdateSkillLevel}
                                        handlerDeleteConsultantSkill={handlerDeleteConsultantSkill}
                                        editable={editable}
                                    />
                                ))}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : <p>Please add quality</p>}
            </ListGroup.Item>

        </DropDownTitleContainer>
    )
}

const SkillDisplayLine = ({ consultantId, skill, val, handleUpdateSkillLevel, handlerDeleteConsultantSkill, editable=true}) => {

    const [level, setLevel] = useState(skill.level);

    const updateLevel = (newLevel) => {
        setLevel(newLevel);
        handleUpdateSkillLevel(consultantId, skill.skill._id, newLevel)
    }

    return (
        <>
            <Form.Row key={val}>
                <Col xs={3}>
                    <Form.Group controlId='skillName'>
                        <Form.Control
                            plaintext
                            readOnly
                            value={skill.skill && skill.skill.name}
                        ></Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Rating
                        value={Number(level)}
                        setValue={updateLevel}
                    />
                </Col>

                <Col>
                    {editable && (
                        <Form.Group>
                            <InputGroup>
                                <Button
                                    //style={{color:'grey'}}
                                    variant="secondary"
                                    size='sm'
                                    onClick={() => handlerDeleteConsultantSkill(consultantId, skill.skill._id)}
                                ><i className="fas fa-times-circle"></i></Button>
                            </InputGroup>
                        </Form.Group>
                    )}
                </Col>
            </Form.Row>
        </>
    )
}

export default SkillsDetails

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { createSkills, deleteSkill, getAllSkills } from '../actions/skillActions';
import { getAllConsultantSkills } from '../actions/consultantActions';

const ManageSkillsScreen = ({ history }) => {

    const dispatch = useDispatch();

    // pagination configuration

    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');

    // local states to add a category
    const [skillCategoryList, setSkillCategoryList] = useState([]);
    const [skillCategory, setSkillCategory] = useState('default');
    const [skillName, setSkillName] = useState('');
    const [skillDescription, setSkillDescription] = useState('');

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const skillList = useSelector(state => state.skillList);
    const { loading, skills, pages, page, count } = skillList;

    const skillDelete = useSelector(state => state.skillDelete);
    const { error, success } = skillDelete;

    const skillCreate = useSelector(state => state.skillCreate);
    const { loading: loadingCreateSkill, error: errorCreateSkill, success: successCreateSkill } = skillCreate;

    const consultantAllSkills = useSelector(state => state.consultantAllSkills);
    const { loading: loadingSkills, error: errorSkills, skills: skillsList } = consultantAllSkills;

    useEffect(() => {
        if (userInfo && (userInfo.adminLevel <= 1)) {
            dispatch(getAllSkills(category, name, pageNumber, pageSize));
        } else {
            history.push('/login');
        }

    }, [dispatch, history, userInfo, pageNumber, pageSize, category, name]);

    useEffect(() => {
        if (success) {
            dispatch(getAllSkills(category, name, pageNumber, pageSize));
        }
    // eslint-disable-next-line
    }, [dispatch, success]);

    useEffect(() => {
        if (successCreateSkill) {
            dispatch(getAllSkills(category, name, pageNumber, pageSize));
        }
    // eslint-disable-next-line
    }, [dispatch, successCreateSkill]);

    useEffect(() => {
        if (!skillsList) {
            if (!loadingSkills) {
                dispatch(getAllConsultantSkills());
            }
        } else {
            let categoryList = skillsList.map(x => x.category);
            categoryList = [...new Set(categoryList)];
            setSkillCategoryList(categoryList);
        }
    }, [dispatch, skillsList, loadingSkills]);


    const handlerAddSkill = (e) => {
        e.preventDefault();
        const skillToCreate = {
            category: skillCategory,
            name: skillName,
            description: skillDescription
        };
        dispatch(createSkills(skillToCreate));
    }

    const onClickEditHandler = (skillId) => {
        history.push(`/admin/editskill/${skillId}`);
    };

    const onClickDeleteHandler = (skill) => {
        if (window.confirm(`Are you sure to delete skill: ${skill.name} ?`)) {
            dispatch(deleteSkill(skill._id));
        }
    }

    return (
        <>
            <Row className='mt-5'>
                <Col>
                    <Form onSubmit={handlerAddSkill}>
                        <Form.Row>
                            <Col md={3}>
                                <Form.Group controlId='skillCategory'>
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
                            <Col md={3}>
                                <Form.Group controlId='name-skill'>
                                    <Form.Control
                                        type='text'
                                        placeholder='Skill'
                                        value={skillName && skillName}
                                        onChange={(e) => setSkillName(e.target.value)}
                                        disabled={skillCategory === 'default'}
                                        required
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId='description-skill'>
                                    <Form.Control
                                        type='text'
                                        placeholder='Skill description'
                                        value={skillDescription && skillDescription}
                                        onChange={(e) => setSkillDescription(e.target.value)}
                                        disabled={skillCategory === 'default'}
                                        required
                                    ></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col className='text-right'>
                                <Button type='submit' variant='primary' block>
                                    {loadingCreateSkill ? <Loader /> : 'Add'}
                                </Button>
                            </Col>
                        </Form.Row>
                        {errorCreateSkill && <Message variant='danger'>{errorCreateSkill}</Message>}
                    </Form>

                </Col>
            </Row>

            <Row>

                <Col xs={6} md={2}>
                    <InputGroup>
                        <FormControl
                            type='text'
                            className="mb-3"
                            placeholder='Search skill'
                            value={name && name}
                            onChange={(e) => setName(e.target.value)}
                        ></FormControl>
                    </InputGroup>
                </Col>

                <Col xs={6} md={8}>
                    <Form.Control
                        plaintext
                        readOnly
                        value={count ? `${count} skills found` : '0 skills found'} />
                </Col>

                <Col xs={6} md={2}>
                    <InputGroup>
                        <FormControl
                            as='select'
                            id='number-c'
                            className="mb-3"
                            value={pageSize && pageSize}
                            onChange={(e) => setPageSize(e.target.value)}
                        >
                            {[5, 10, 15, 20, 50].map(x => (
                                <option
                                    key={x}
                                    value={x}
                                >{x} / page</option>
                            ))}
                        </FormControl>
                    </InputGroup>
                </Col>

            </Row>

            {skills && skills.length === 0 ? <Message variant='information'>You have not access to these information</Message> :
                loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (


                    <Table responsive hover striped>
                        <thead>
                            <tr className='table-primary'>
                                <th className='align-middle text-light'>Category</th>
                                <th className='align-middle text-light'>Skill</th>
                                <th className='align-middle text-light'>Description</th>
                                <th className='align-middle text-light'></th>
                                <th className='align-middle text-light'></th>
                            </tr>
                        </thead>

                        <tbody>
                            {skills && skills.map((skill) => (
                                <tr key={skill._id}>
                                    <td className='align-middle'>{skill.category}</td>
                                    <td className='align-middle'>{skill.name}</td>
                                    <td className='align-middle'>{skill.description}</td>
                                    <td className='align-middle'>
                                        <Button className='btn btn-primary p-1' onClick={() => onClickEditHandler(skill._id)}>
                                            <i className="fas fa-user-edit"></i>
                                        </Button>
                                    </td>
                                    <td className='align-middle'>
                                        <Button className='btn btn-danger p-1' onClick={() => onClickDeleteHandler(skill)}>
                                            <i className="fas fa-user-times"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                )}

            <Pagination>
                <Pagination.Prev
                    onClick={() => setPageNumber(page - 1)}
                    disabled={page === 1}
                />
                {[...Array(pages).keys()].map(x => (

                    <Pagination.Item
                        key={x + 1}
                        active={x + 1 === page}
                        onClick={() => {
                            dispatch(getAllSkills(category, name, x + 1, pageSize));
                            setPageNumber(x + 1);
                        }}
                    >{x + 1}</Pagination.Item>

                ))}
                <Pagination.Next
                    onClick={() => setPageNumber(page + 1)}
                    disabled={page === pages}
                />
            </Pagination>
        </>
    )
}

export default ManageSkillsScreen

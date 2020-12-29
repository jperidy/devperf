import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Alert from 'react-bootstrap/Alert';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { deleteSkill, getAllSkills } from '../actions/skillActions';
import { SKILL_DELETE_RESET } from '../constants/skillsConstants';

const ManageSkillsScreen = ({ history }) => {

    const dispatch = useDispatch();

    //const [message, setMessage] = useState({});

    // pagination configuration

    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const skillList = useSelector(state => state.skillList);
    const { loading, skills, pages, page, count } = skillList;

    const skillDelete = useSelector(state  => state.skillDelete);
    const {error, success} = skillDelete;

    useEffect(() => {

        if (userInfo && (userInfo.adminLevel <= 1)) {
            dispatch(getAllSkills(category, name, pageNumber, pageSize));
        } else {
            history.push('/login');
        }

    }, [dispatch, history, userInfo, success, pageNumber, pageSize, category, name] );

    /*
    useEffect(() => {

        if (error) {
            setMessage({message: error, type:'danger'});
        }
        if (success) {
            setMessage({message: 'Skill deleted', type:'success'})
        }

    }, [error, success]);
    */
    /*
    useEffect(() => {
        if (success) {
            dispatch(getAllSkills(category, name, pageNumber, pageSize));
            dispatch({type: SKILL_DELETE_RESET});
        }
    }, [dispatch, success, category, name, pageNumber, pageSize]);
    */

    const addSkillHandler = () => {
        console.log('Add a skill');
    }

    const onClickEditHandler = (skillId) => {
        history.push(`/admin/editskill/${skillId}`);
    };

    const onClickDeleteHandler = (skill) => {
        if (window.confirm(`Are you sure to delete skill: ${skill.name} ?`)) {
            //console.log(('deleteHandler'))
            dispatch(deleteSkill(skill._id));
        }
    }

    return (
        <>

            <Row>

                <Col xs={6} md={4}>
                    <Button className="mb-3" onClick={() => addSkillHandler()}>
                        <i className="fas fa-user-edit mr-2"></i>Add
                    </Button>
                </Col>

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

                <Col xs={6} md={4}>
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
                            {[5,10,15,20,50].map(x => (
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
                                        <Button  className='btn btn-danger p-1' onClick={() => onClickDeleteHandler(skill)}>
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
                        disabled={page===1}
                    />
                    {[...Array(pages).keys()].map(x => (
                        
                        <Pagination.Item
                            key={x+1}
                            active={x + 1 === page}
                            onClick={() => {
                                dispatch(getAllSkills(category, name, x + 1, pageSize));
                                setPageNumber(x+1);
                            }}
                        >{x + 1}</Pagination.Item>
                        
                    ))}
                    <Pagination.Next
                        onClick={() => setPageNumber(page + 1)}
                        disabled={page===pages}
                    />
                </Pagination>   
        </>
    )
}

export default ManageSkillsScreen

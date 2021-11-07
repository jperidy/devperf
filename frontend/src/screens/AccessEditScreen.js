import React, { useState, useEffect } from 'react';
import { Form, ListGroup, Col, Row, Tabs, Tab, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ACCESS_DATAS, ACCESS_MODES } from '../constants/accessConstants';
import DisplayChildren from '../components/DisplayChildren';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getAllAccess, updateprofilFrontAcessRule } from '../actions/accessActions';

const AccessEditScreen = ({ history }) => {

    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const accessList = useSelector(state => state.accessList);
    const { loading, error, access } = accessList;

    const accessFrontUpdate = useSelector(state => state.accessFrontUpdate);
    const { error: errorFrontUpdate } = accessFrontUpdate;

    useEffect(() => {
        if (!userInfo) {
            history.push('/login');
        }
    }, [history, userInfo]);

    useEffect(() => {
        if (!access) {
            dispatch(getAllAccess());
        }
    }, [dispatch, access]);
    

    return (
        <DisplayChildren access='manageProfils'>
            {loading && <Loader />}
            {error && <Message variant='danger'>{error}</Message>}
            {errorFrontUpdate && <Message variant='danger'>{errorFrontUpdate}</Message>}

            <h1>Manage user profils screen</h1>
            <Tabs defaultActiveKey={access && access[0].profil} id="uncontrolled-tab-example">
                {access && access.map((x, incr) => (
                    <Tab key={incr} eventKey={x.profil} title={x.profil}>
                        <ProfilDescription data={x} />
                    </Tab>
                ))}
            </Tabs>
        </DisplayChildren>
    )
}

const ProfilDescription = ({data}) => {

    const categorizeFrontAccess = (frontAccess) => {
        
        const categories = [...new Set(frontAccess.map(x => x.category))];

        const categorizedFrontAccess = [];
        for (let incr = 0; incr < categories.length; incr++) {
            const filterdData = frontAccess.filter(x => x.category === categories[incr]);
            categorizedFrontAccess.push({
                frontAccessRules: filterdData,
                category: categories[incr],
            });
        }
        return [categorizedFrontAccess, categories]
    }
    
    const [categorizedFrontAccess, categories] = categorizeFrontAccess(data.frontAccess);


    return (
        <ListGroup>
            {categorizedFrontAccess && categorizedFrontAccess.map((categoryRules, incr) => (
                <ListGroup.Item key={incr} className='pt-3'>
                    <CategoryAccess
                        accessRules={categoryRules.frontAccessRules}
                        category={categoryRules.category}
                        categories={categories}
                        profilId={data._id}
                    />
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
};

const CategoryAccess = ({ accessRules, category, categories, profilId }) => {

    const params = {
        categories: categories,
        modes: ACCESS_MODES,
        datas: ACCESS_DATAS
    }

    return (
        <div>
            <h4>{category && category}</h4>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <Row className='py-1 border-bottom bg-primary'>
                        <Col className='text-white' xs={3}><strong>TECHNICAL ID</strong></Col>
                        <Col className='text-white' xs={4}><strong>LABEL</strong></Col>
                        <Col className='text-white' xs={2}><strong>MODE</strong></Col>
                        <Col className='text-white' xs={2}><strong>ACCESS</strong></Col>
                        <Col xs={1}><strong></strong></Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
            {accessRules && accessRules.map((item, incr) => (
                <ListGroup key={incr} variant='flush' className='border-bottom'>
                    <ListGroup.Item>
                        <AccessLineEdit
                            frontAccessItem={item}
                            params={params}
                            profilId={profilId}
                        />
                    </ListGroup.Item>
                </ListGroup>
            ))}
        </div>
    )
}

const AccessLineEdit = ({ frontAccessItem, params, profilId }) => {

    const dispatch = useDispatch()

    const [id] = useState(frontAccessItem.id);
    const [label, setLabel] = useState(frontAccessItem.label);
    const [mode, setMode] = useState(frontAccessItem.mode);
    const [data, setData] = useState(frontAccessItem.data);

    const [loadingState, setLoadingState] = useState(false);

    const accessFrontUpdate = useSelector(state => state.accessFrontUpdate);
    const { error, success } = accessFrontUpdate;

    useEffect(() => {
        if(success) {
            setLoadingState(false)
        } 
    },[success]);

    useEffect(() => {
        if(error) {
            setLoadingState(false)
        } 
    },[error]);

    const submitHandler = (e) => {
        e.preventDefault();
        setLoadingState(true);
        const rule = {
            id: id,
            label: label,
            mode: mode,
            data: data,
            profilId: profilId
        }
        dispatch(updateprofilFrontAcessRule(rule))
        console.log('update to implement')
    }

    return (
        <Form onSubmit={submitHandler}>
            <Form.Row>
                <Col xs={3}>
                    <Form.Control
                        type='text'
                        value={id && id}
                        plaintext
                        readOnly
                    ></Form.Control>
                </Col>

                <Col xs={4}>
                    <Form.Control
                        type='text'
                        value={label && label}
                        onChange={(e) => setLabel(e.target.value)}
                    ></Form.Control>
                </Col>

                <Col xs={2}>
                    <Form.Control
                        as='select'
                        value={mode && mode}
                        onChange={(e) => setMode(e.target.value)}
                    >
                        <option value=''>--Select--</option>
                        {params.modes.map((x, incr) => (
                            <option key={incr} value={x}>{x}</option>
                        ))}
                    </Form.Control>
                </Col>

                <Col xs={2}>
                    <Form.Control
                        as='select'
                        value={data && data}
                        onChange={(e) => setData(e.target.value)}
                    >
                        <option value=''>--Select--</option>
                        {params.datas.map((x, incr) => (
                            <option key={incr} value={x}>{x}</option>
                        ))}
                    </Form.Control>
                </Col>

                <Col xs={1}>
                    <Button variant='ligth' className='text-secondary' type='submit'>
                        {loadingState ? <Loader /> : <i className="fas fa-download"></i>}
                    </Button>
                </Col>

            </Form.Row>
        </Form>
    )
}

export default AccessEditScreen

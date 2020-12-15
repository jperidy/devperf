import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMyAdminConsultants } from '../actions/consultantActions';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { CONSULTANT_MY_RESET } from '../constants/consultantConstants';

const ManageConsultantScreen = ({ history }) => {

    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantsMyAdminList = useSelector(state => state.consultantsMyAdminList);
    const { loading, error, consultantsMyAdmin } = consultantsMyAdminList;

    const consultantMy = useSelector(state => state.consultantMy);
    const { consultant } = consultantMy;

    const addConsultantHandler = () => {
        //console.log('AddConsultantHandler');
        history.push('/admin/consultant/add');
    }

    useEffect(() => {

        if (!userInfo) {
            history.push('/login');
        }

        if (!userInfo.isAdmin) {
            history.push('/');
        }

        // initialisation of consultantMy selector
        if (consultant && consultant._id) {
            dispatch({ type: CONSULTANT_MY_RESET });
            //console.log('dispatch reset');
        }

        dispatch(getAllMyAdminConsultants());

    }, [
        dispatch,
        history,
        userInfo,
        consultant
    ]);

    const onClickHandler = (focus, consultantId) => {
        history.push(`/editconsultant/${consultantId}`);
    };

    return (
        <>
            <Button className="mb-3" onClick={() => addConsultantHandler()}>
                <i className="fas fa-user-edit mr-2"></i>Add
            </Button>

            {consultantsMyAdmin.length === 0 ? <Message variant='information'>You have not access to these information</Message> :
                loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (


                    <Table responsive hover striped>
                        <thead>
                            <tr className='table-primary'>
                                <th className='align-middle text-light'>Consultant name</th>
                                <th className='align-middle text-light'>Matricule</th>
                                <th className='align-middle text-light'>Practice</th>
                                <th className='align-middle text-light'>Valued</th>
                                <th className='align-middle text-light'>Arrival</th>
                                <th className='align-middle text-light'>Leaving</th>
                                <th className='align-middle text-light'>Seniority</th>
                                <th className='align-middle text-light'>Comment</th>
                                <th className='align-middle text-light'></th>
                            </tr>
                        </thead>

                        <tbody>
                            {consultantsMyAdmin.map((consultant, focus) => (
                                <tr key={consultant._id}>
                                    <td className='align-middle'>{consultant.name}</td>
                                    <td className='align-middle'>{consultant.matricule}</td>
                                    <td className='align-middle'>{consultant.practice}</td>
                                    <td className='align-middle'>{consultant.valued ? consultant.valued.substring(0, 10) : ''}</td>
                                    <td className='align-middle'>{consultant.arrival ? consultant.arrival.substring(0, 10) : ''}</td>
                                    <td className='align-middle'>{consultant.leaving ? consultant.leaving.substring(0, 10) : ''}</td>
                                    <td className='align-middle'>{
                                        consultant.valued ? ((new Date(Date.now()) - new Date(consultant.valued.substring(0, 10))) / (1000 * 3600 * 24 * 365.25)).toString().substring(0, 4) : 0
                                    } years</td>
                                    <td className='align-middle'>{consultant.comment}</td>
                                    <td className='align-middle'>
                                        <Button className='btn btn-light p-1' onClick={() => onClickHandler(focus, consultant._id)}>
                                            <i className="fas fa-user-edit"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                )}
        </>
    )
}

export default ManageConsultantScreen;

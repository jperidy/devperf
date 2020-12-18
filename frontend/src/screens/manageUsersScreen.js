import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
//import Message from '../components/Message';
import { deleteUser, listUsers } from '../actions/userActions';

const ManageUsersScreen = ({ history }) => {

    const dispatch = useDispatch();

    const [message, setMessage] = useState({})

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userList = useSelector(state  => state.userList);
    const {users} = userList;

    const userDelete = useSelector(state  => state.userDelete);
    const {error, success} = userDelete;
    

    useEffect(() => {

        if (userInfo && (userInfo.adminLevel === 0)) {
            dispatch(listUsers());
        } else {
            history.push('/login');
        }

    }, [dispatch, history, userInfo, success]);

    useEffect(() => {

        if (error) {
            setMessage({message: error, type:'danger'});
        }
        if (success) {
            setMessage({message: 'User deleted', type:'success'})
        }

    }, [error, success]);
    

    const addUserHandler = () => {
        //console.log('AddConsultantHandler');
        history.push('/admin/user/add');
    };


    const onClickEditHandler = (userId) => {
        history.push(`/admin/edituser/${userId}`);
    };

    const onClickDeleteHandler = (user) => {
        console.log('delete user');
        if (window.confirm(`Are you sure to delete user: ${user.name} ?`)) {
            dispatch(deleteUser(user._id));
        }
    };

    
    return (
        <>
            {message && message.message && (

                <Alert variant={message.type} onClose={() => setMessage({})} dismissible>
                    <Alert.Heading>Notification</Alert.Heading>
                    <p>
                        {message.message}
                    </p>
                </Alert>

            )}


            <Button className="mb-3" onClick={() => addUserHandler()}>
                <i className="fas fa-user-edit mr-2"></i>Add
            </Button>

            

            <Table responsive hover striped>
                <thead>
                    <tr className='table-primary'>
                        <th className='align-middle text-light'>User name</th>
                        <th className='align-middle text-light'>Matricule</th>
                        <th className='align-middle text-light text-center'>Practice</th>
                        <th className='align-middle text-light text-center'>Created at</th>
                        <th className='align-middle text-light text-center'>Status</th>
                        <th className='align-middle text-light text-center'>Admin Level</th>
                        <th className='align-middle text-light'></th>
                        <th className='align-middle text-light'></th>
                    </tr>
                </thead>

                <tbody>
                    {users && users.map((user) => (
                        <tr key={user._id}>
                            <td className='align-middle'><b>{user.name && user.name}</b></td>
                            <td className='align-middle'>{user.consultantProfil.matricule && user.consultantProfil.matricule}</td>
                            <td className='align-middle text-center'>{user.consultantProfil.practice && user.consultantProfil.practice}</td>
                            <td className='align-middle text-center'>{user.createdAt && user.createdAt.toString().substring(0,10)}</td>
                            <td className='align-middle text-center'>{user.status && user.status}</td>
                            <td className='align-middle text-center'>{user.adminLevel && user.adminLevel}</td>
                            <td className='align-middle'>
                                <Button className='btn btn-primary p-1' onClick={() => onClickEditHandler(user._id)}>
                                    <i className="fas fa-user-edit"></i>
                                </Button>
                            </td>
                            <td className='align-middle'>
                                <Button className='btn btn-danger p-1' onClick={() => onClickDeleteHandler(user)}>
                                    <i className="fas fa-user-times"></i>
                                </Button>
                            </td>
                        </tr>
                    ))} 
                </tbody>
            </Table>
        </>
    )
}

export default ManageUsersScreen;

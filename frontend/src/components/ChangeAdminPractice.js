import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { changeAdminPractice } from '../actions/userActions';
import DisplayChildren from './DisplayChildren';
import { getAllPractice } from '../actions/consultantActions';

const ChangeAdminPractice = ({ userInfo }) => {

    const dispatch = useDispatch();

    const consultantPracticeList = useSelector(state => state.consultantPracticeList);
    const { practiceList } = consultantPracticeList;

    useEffect(() => {
        if (!practiceList) {
            dispatch(getAllPractice());
        }
    }, [dispatch, practiceList]);

    return (
        <DisplayChildren access='adminChangePractice'>
            <NavDropdown title={userInfo.consultantProfil.practice ? userInfo.consultantProfil.practice : 'undefined'}>
                {practiceList && practiceList.map((practiceName, val) => (
                    <NavDropdown.Item
                        key={val}
                        onClick={() => dispatch(changeAdminPractice(userInfo, practiceName))}
                    >{practiceName}</NavDropdown.Item>
                ))}
            </NavDropdown>
        </DisplayChildren>
    )
};

export default ChangeAdminPractice;

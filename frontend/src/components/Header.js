import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { logout } from '../actions/userActions';
import DisplayChildren from './DisplayChildren';

// MSAL
import { useMsal } from "@azure/msal-react";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";


const Header = () => {

    // MSAL
    const { instance } = useMsal();
    
    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const logoutHandler = () => {
        dispatch(logout());
    };

    const logoutHandlerMSAL = (logoutType) => {

        if (logoutType === "popup") {
            instance.logoutPopup();
        } else if (logoutType === "redirect") {
            instance.logoutRedirect();
        }
    }

    return (
        <header>
            <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect fixed="top">
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>Performance App</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">

                            <DisplayChildren access='staffingRequest'>
                                <LinkContainer to='/staffing'>
                                    <Nav.Link>Staffing Request</Nav.Link>
                                </LinkContainer>
                            </DisplayChildren>

                            <DisplayChildren access='editMyPxx'>
                                <LinkContainer to='/pxx'>
                                    <Nav.Link>Edit My Pxx</Nav.Link>
                                </LinkContainer>
                            </DisplayChildren>

                            {userInfo ? (

                                <NavDropdown title={`${userInfo.name} (${userInfo.profil.profil && userInfo.profil.profil})` || 'no user'} id="username">

                                    <DisplayChildren access='editMyProfil'>
                                        <LinkContainer to='/profile'>
                                            <NavDropdown.Item>Edit My Profil</NavDropdown.Item>
                                        </LinkContainer>
                                    </DisplayChildren>

                                    <DisplayChildren access={'manageConsultants'}>
                                        <NavDropdown.Divider />
                                        <LinkContainer to='/admin/consultants'>
                                            <NavDropdown.Item>Manage Consultant</NavDropdown.Item>
                                        </LinkContainer>
                                    </DisplayChildren>

                                    <DisplayChildren access={'manageDeals'}>
                                        <NavDropdown.Divider />
                                        <LinkContainer to='/admin/deals'>
                                            <NavDropdown.Item>Manage Deals</NavDropdown.Item>
                                        </LinkContainer>
                                    </DisplayChildren>

                                    <NavDropdown.Divider />
                                    <UnauthenticatedTemplate>
                                        <LinkContainer to='/login'>
                                            <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                        </LinkContainer>
                                    </UnauthenticatedTemplate>
                                    <AuthenticatedTemplate>
                                        <LinkContainer to='/login'>
                                            <NavDropdown.Item onClick={() => logoutHandlerMSAL('popup')}>Logout</NavDropdown.Item>
                                        </LinkContainer>
                                    </AuthenticatedTemplate>
                                </NavDropdown>

                            ) : (
                                    <LinkContainer to='/login'>
                                        <Nav.Link><i className='fas fa-user'></i>Sign In</Nav.Link>
                                    </LinkContainer>)}

                            <DisplayChildren access='adminMenu'>
                                <NavDropdown title='admin'>

                                    <DisplayChildren access='manageUsers'>
                                        <LinkContainer to='/admin/users'>
                                            <NavDropdown.Item>Manage Users</NavDropdown.Item>
                                        </LinkContainer>
                                    </DisplayChildren>

                                    <DisplayChildren access='manageSkills'>
                                        <NavDropdown.Divider />
                                        <LinkContainer to='/admin/skills'>
                                            <NavDropdown.Item>Manage Skills</NavDropdown.Item>
                                        </LinkContainer>
                                    </DisplayChildren>

                                    <DisplayChildren access='manageProfils'>
                                        <NavDropdown.Divider />
                                        <LinkContainer to='/admin/profils'>
                                            <NavDropdown.Item>Manage Profils</NavDropdown.Item>
                                        </LinkContainer>
                                    </DisplayChildren>

                                    <DisplayChildren access='manageCompanies'>
                                        <NavDropdown.Divider />
                                        <LinkContainer to='/admin/companies'>
                                            <NavDropdown.Item>Manage companies</NavDropdown.Item>
                                        </LinkContainer>
                                    </DisplayChildren>

                                </NavDropdown>
                            </DisplayChildren>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header

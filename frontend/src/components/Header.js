import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import { logout } from '../actions/userActions';

const Header = () => {

    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const logoutHandler = () => {
        dispatch(logout());
    };

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

                            <LinkContainer to='/staffing'>
                                <Nav.Link>Staffing Request</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to='/pxx'>
                                <Nav.Link>Edit My Pxx</Nav.Link>
                            </LinkContainer>


                            {userInfo ? (
                                <NavDropdown title={userInfo.name || 'no user'} id="username">
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Edit My Profil</NavDropdown.Item>
                                    </LinkContainer>

                                    {(userInfo.adminLevel <= 1) && (
                                        <>
                                            <NavDropdown.Divider />
                                            <LinkContainer to='/admin/consultants'>
                                                <NavDropdown.Item>Manage Consultant</NavDropdown.Item>
                                            </LinkContainer>
                                        </>
                                    )}

                                    {(userInfo.adminLevel === 0) && (
                                        <>
                                            <NavDropdown.Divider />
                                            <LinkContainer to='/admin/users'>
                                                <NavDropdown.Item>Manage Users</NavDropdown.Item>
                                            </LinkContainer>
                                        </>
                                    )}
                                    
                                    <NavDropdown.Divider />
                                    <LinkContainer to='/login'>
                                        <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>

                            ) : (
                                <LinkContainer to = '/login'>
                                    <Nav.Link><i className='fas fa-user'></i>Sign In</Nav.Link>
                                </LinkContainer>)}

                        </Nav>
                        <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-success">Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header

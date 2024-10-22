import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import Auth from '../utils/auth';

const Navbar = () => {
    const loggedIn = Auth.loggedIn();

    return (
        <BootstrapNavbar bg='light' expand='lg'>
            <BootstrapNavbar.Brand as={Link} to='/'>
                Your App Name
            </BootstrapNavbar.Brand>
            <BootstrapNavbar.Toggle aria-controls='basic-navbar-nav' />
            <BootstrapNavbar.Collapse id='basic-navbar-nav'>
                <Nav className='ml-auto'>
                    {loggedIn ? (
                        <>
                            <Nav.Link as={Link} to='/saved'>
                                Saved Books
                            </Nav.Link>
                            <Nav.Link as={Link} to='/search'>
                                Search
                            </Nav.Link>
                            <Nav.Link as={Link} to='/profile'>
                                Profile
                            </Nav.Link>
                            <Nav.Link
                                onClick={() => {
                                    Auth.logout();
                                }}
                            >
                                Logout
                            </Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to='/login'>
                                Login
                            </Nav.Link>
                            <Nav.Link as={Link} to='/signup'>
                                Sign Up
                            </Nav.Link>
                        </>
                    )}
                </Nav>
            </BootstrapNavbar.Collapse>
        </BootstrapNavbar>
    );
};

export default Navbar;

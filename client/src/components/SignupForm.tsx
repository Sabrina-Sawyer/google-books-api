import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useRegisterUser } from '../utils/api'; // Import the hook for signup
import Auth from '../utils/auth';

const SignupForm = () => {
    const { registerUser } = useRegisterUser();
    const [formState, setFormState] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { username, email, password } = formState;
    
        try {
            const data = await registerUser({ username, email, password });
            Auth.login(data._id); // Use the _id returned from the registration mutation
        } catch (err) {
            setErrorMessage('Failed to sign up. Please try again.');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            {errorMessage && <p className='text-danger'>{errorMessage}</p>}
            <Form.Group controlId='formBasicUsername'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type='text'
                    name='username'
                    value={formState.username}
                    onChange={handleChange}
                    placeholder='Username'
                />
            </Form.Group>

            <Form.Group controlId='formBasicEmail'>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type='email'
                    name='email'
                    value={formState.email}
                    onChange={handleChange}
                    placeholder='Enter email'
                />
            </Form.Group>

            <Form.Group controlId='formBasicPassword'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    name='password'
                    value={formState.password}
                    onChange={handleChange}
                    placeholder='Password'
                />
            </Form.Group>

            <Button variant='primary' type='submit'>
                Sign Up
            </Button>
        </Form>
    );
};

export default SignupForm;

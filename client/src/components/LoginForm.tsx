import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useLoginUser } from '../utils/api'; // Import the hook for login
import Auth from '../utils/auth';

const LoginForm = () => {
  const { loginUser } = useLoginUser();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, password } = formState;

    try {
      const { login } = await loginUser(email, password); // Adjust according to your login mutation structure
      Auth.login(login.token); // Use the token returned from the login mutation
    } catch (err) {
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {errorMessage && <p className='text-danger'>{errorMessage}</p>}
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
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;

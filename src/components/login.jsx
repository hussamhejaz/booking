import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import logo from '../images/logo.svg'; // Import your login image

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect to dashboard upon successful sign-in
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <div className="text-center mb-4">
                        <img src={logo} alt="Login" style={{ width: '100px' }} />
                    </div>
                    <div className="p-4 border rounded">
                        <h2 className="mb-4 text-center">Login</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Login
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;

import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

const RegisterForm = ({ switchToLogin }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/register", {
                name,
                email,
                password,
            });
            alert("Registration successful! You can now log in.");
            switchToLogin();
        } catch (error) {
            alert(error.response?.data?.error || "An error occurred during registration.");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
            <p className="mt-3">
                Already registered?{" "}
                <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={switchToLogin}
                >
          Login here
        </span>
            </p>
        </div>
    );
};

export default RegisterForm;

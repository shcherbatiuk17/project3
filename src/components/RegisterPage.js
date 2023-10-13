import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import '../styles/registerpage.css';

const ADD_USER = gql`
  mutation AddUser($name: String!, $email: String!, $password: String!) {
    addUser(name: $name, email: $email, password: $password) {
      token
      user {
        _id
        name
        email
      }
    }
  }
`;

function Register() {
  const [addUser, { loading }] = useMutation(ADD_USER);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      await addUser({
        variables: { name, email, password }
      });
      setMessage("Registered successfully!");
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setMessage("Error registering: " + err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input type="text" name="name" placeholder="Name" />
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Sign Up</button>
      </form>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;

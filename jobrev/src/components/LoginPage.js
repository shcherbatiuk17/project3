import React from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        name
        email
      }
    }
  }
`;

function Login() {
  const [login, { error }] = useMutation(LOGIN_USER);

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const { data } = await login({
        variables: { email, password }
      });

      if (data.login.token) {
        localStorage.setItem('token', data.login.token);
        console.log("Logged in successfully!");
      }
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>Error logging in. Please try again.</p>}
    </div>
  );
}

export default Login;

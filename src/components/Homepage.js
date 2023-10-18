import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
// import Image from '../assets/img.jpg';
import '../styles/homepage.css';

const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

function Homepage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginUser, { loading, error }] = useMutation(LOGIN_USER);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const { data } = await loginUser({
                variables: { email, password }
            });
            
            localStorage.setItem('token', data.login.token);
            navigate('/companies');
        } catch (err) {
            console.error("Error logging in:", err);
        }
    };

    return (
        <div className="homepage-container">
            
            {/* Header */}
            <header className="homepage-header">
                    {/* <h1>Job Reviewerz</h1> */}
                    
            </header>
            
            {/* Description and Image */}
            {/* <section className="description-image-section">
                {/* <img src={Image} alt="Workers on strike" className="description-image"/> */}
                {/* <p className="description-text">Short description here.</p>
            </section> */} 
            
            {/* Login */}
            <section className="login-section">
                <input 
                    type="email" 
                    placeholder="Email" 
                    className="login-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    className="login-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button className="login-button" onClick={handleLogin}>Login</button>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}
            </section>
            
            {/* Register */}
            <div className="container">
            <p>Welcome to Job Reviewerz! Our platform is your one-stop destination for finding your dream job. Discover top companies, read insightful reviews from current and former employees, and explore their latest job openings. Whether you're a seasoned professional or just starting your career, Job Reviewerz is here to help you make informed decisions and connect with employers looking for talent like you. Join us today and take the next step in your career journey.</p> 

            <h1>Job Reviewerz</h1>  
            

            </div>            
                <section className="register-section">
                <Link to="/register" 
                className="register-button">Register</Link>
                  

                           
            </section>
            {/* <h1>Job Reviewerz</h1> */}      
                
                             
                   
                 
                {/* <h1>Job Reviewerz</h1>          */}
        </div>
    );
}

export default Homepage;

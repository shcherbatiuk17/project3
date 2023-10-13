import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import {gql} from '@apollo/client';
import '../styles/addcompanypage.css';
import { useNavigate } from 'react-router-dom';

export const ADD_COMPANY = gql`
  mutation AddCompany($name: String!, $description: String!) {
    addCompany(name: $name, description: $description) {
      _id
      name
      description
    }
  }
`;

const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      _id
      name
      rating
    }
  }
`;

const AddCompanyPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [addCompany] = useMutation(ADD_COMPANY, {
    refetchQueries: [{ query: GET_COMPANIES }]
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addCompany({
        variables: { name: formData.name, description: formData.description }
      });
      alert('Company added successfully!');
      
      setFormData({ name: '', description: '' });
      navigate('/companies');
    } catch (error) {
      alert('Error adding company!');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Add New Company</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Company Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            id="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Company</button>
      </form>
    </div>
  );
};

export default AddCompanyPage;

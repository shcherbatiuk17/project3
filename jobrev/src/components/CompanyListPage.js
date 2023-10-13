import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import '../styles/companylistpage.css'

const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      _id
      name
      rating
    }
  }
`;

function CompanyListPage() {
  const { loading, error, data } = useQuery(GET_COMPANIES);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = data?.companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="company-list-container">
      <div className="header">
        <h2>Company Reviews</h2>
        <Link to="/profile" className="profile-btn">Profile</Link>
      </div>

      <input 
        type="text" 
        placeholder="Search for a company..." 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)} 
      />

      <div className="companies-container">
        {loading && <p>Loading companies...</p>}
        {error && <p>Error loading companies: {error.message}</p>}
        {filteredCompanies.map(company => (
          <Link key={company._id} to={`/company/${company._id}`} className="company-card">
            <span>{company.name}</span>
            <span>-   Rating: {Math.round(company.rating * 100)/100}⭐'s</span>
          </Link>
        ))}
      </div>

      <Link to="/" className="company-btn">Logout</Link>
      <Link to="/add-company" className="company-btn">Add Company</Link>
    </div>
  );
}

export default CompanyListPage;

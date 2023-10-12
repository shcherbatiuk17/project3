import React from 'react';

const CompanyList = ({ companies }) => {
  return (
    <div className="company-list-container">
      <h2>Companies</h2>
      <ul className="companies">
        {companies.map((company) => (
          <li key={company.id}>
            <h3>{company.name}</h3>
            <p>{company.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyList;

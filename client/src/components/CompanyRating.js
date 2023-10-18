// CompanyRating.js
import React from 'react';
import '../styles/CompanyRating.css'; 

const CompanyRating = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;

  return (
    <div className="company-rating">
      {Array(filledStars).fill(
        <i key={filledStars} className="fas fa-star"></i>
      )}
      {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
    </div>
  );
};

export default CompanyRating;


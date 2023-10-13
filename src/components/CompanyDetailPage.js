import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/companydetailpage.css';

const GET_COMPANY_DETAILS = gql`
  query GetCompanyDetails($companyId: ID!) {
    company(companyId: $companyId) {
      _id
      name
      rating
      description
      reviews {
        reviewText
        rating
      }
    }
  }
`;

const ADD_REVIEW = gql`
  mutation AddReview($companyId: ID!, $reviewText: String!, $rating: Int!) {
    addReview(companyId: $companyId, reviewText: $reviewText, rating: $rating) {
      _id
      reviewText
      rating
    }
  }
`;

function CompanyDetailPage() {
  const { company } = useParams();
  const { loading, error, data } = useQuery(GET_COMPANY_DETAILS, {
    variables: { company }
  });
  
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [addReview] = useMutation(ADD_REVIEW, {
    refetchQueries: [{ query: GET_COMPANY_DETAILS, variables: { company } }],
    awaitRefetchQueries: true
  
  });

  const navigate = useNavigate();
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await addReview({
        variables: { company, reviewText: reviewText, rating: parseInt(reviewRating) }
      });
      alert('Review added successfully!');
      setReviewText('');
      setReviewRating(5);
      navigate ('/companies')
    } catch (err) {
      console.error('Failed to add review:', err.message);
      alert('Error adding review!');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { name, description, reviews } = data.company;

  return (
    <div className="company-detail-container">
      <h2>{name} Reviews</h2>
      {/* <p>Rating: {rating} ⭐'s</p >*/}
      <p>Description: {description}</p>
      
      <div className="reviews-section">
        {reviews.map((review, index) => (
          <div key={index} className="review">
            <p>{review.reviewText}</p>
            <p>Rating: {review.rating} ⭐'s</p>
          </div>
        ))}
      </div>

      <div className="add-review-section">
        <h3>Add a Review</h3>
        <form onSubmit={handleSubmitReview}>
          <textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            required
          />
          <select value={reviewRating} onChange={e => setReviewRating(e.target.value)}>
            {[5, 4, 3, 2, 1].map(num => (
              <option key={num} value={num}>{num} ⭐</option>
            ))}
          </select>
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
}


export default CompanyDetailPage;

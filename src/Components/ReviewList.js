import React from 'react';

const ReviewList = ({ reviews }) => {
  return (
    <div className="review-list-container">
      <h2>Reviews</h2>
      <ul className="reviews">
        {reviews.map((review) => (
          <li key={review.id}>
            <h3>{review.title}</h3>
            <p>{review.content}</p>
            <p>Rating: {review.rating}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;

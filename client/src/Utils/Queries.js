import { gql } from '@apollo/client';

// Query to fetch a review by its ID
export const GET_REVIEW_BY_ID = gql`
  query GetReviewById($reviewId: ID!) {
    review(id: $reviewId) {
      id
      rating
      comment
    }
  }
`;

// Query to fetch all reviews for a specific company
export const GET_REVIEWS_FOR_COMPANY = gql`
  query GetReviewsForCompany($companyId: ID!) {
    companyReviews(companyId: $companyId) {
      id
      rating
      comment
    }
  }
`;

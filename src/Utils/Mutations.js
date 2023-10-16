import { gql } from '@apollo/client';
export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        username
      }
    }
  }
`;

export const ADD_COMPANY = gql`
  mutation AddCompany($input: CompanyInput!) {
    addCompany(input: $input) {
      company {
        id
        name
      }
    }
  }
`;


export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        name
        email
      }
    }
  }
`;

export const ADD_REVIEW_TO_COMPANY = gql`
  mutation AddReviewToCompany($companyId: ID!, $reviewInput: ReviewInput!) {
    addReviewToCompany(companyId: $companyId, reviewInput: $reviewInput) {
      id  
      rating
      comment
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: ID!) {
    deleteReview(reviewId: $reviewId) {
      id  
    }
  }
`;
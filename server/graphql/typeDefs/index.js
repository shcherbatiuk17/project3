const { gql } = require('apollo-server-express');

const typeDefs = gql`

# User

type User {
  _id: ID!
  name: String!
  email: String!
  password: String! 
  companies: [Company]
  reviews: [Review]
}

type Auth {
  token: String!
  user: User!
}

type Query {
  me: User
  users: [User]
  user(userId: ID!): User
  companies: [Company]
  company(companyId: ID!): Company
  reviews(companyId: ID!): [Review]
}

type Mutation {
  login(email: String!, password: String!): Auth
  addUser(name: String!, email: String!, password: String!): Auth
}

# Company

type Company {
  _id: ID!
  name: String!
  description: String!
  user: User!
  reviews: [Review]
  rating: Float
}

extend type Mutation {
  addCompany(name: String!, description: String!): Company
  updateCompany(companyId: ID!, name: String, description: String): Company
  deleteCompany(companyId: ID!): String
}

# Review

type Review {
  _id: ID!
  reviewText: String!
  rating: Int!
  createdAt: String
  user: User!
  company: Company
}

extend type Mutation {
  addReview(companyId: ID!, reviewText: String!, rating: Int!): Review
  updateReview(reviewId: ID!, reviewText: String, rating: Int): Review
  deleteReview(reviewId: ID!): String
}

`;

module.exports = typeDefs;

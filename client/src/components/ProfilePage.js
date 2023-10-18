import React from 'react';
import { useQuery, gql } from '@apollo/client';
import jwtDecode from 'jwt-decode';
import '../styles/profilepage.css';

const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    user(userId: $userId) {
      name
      email
      companies {
        _id
        name
        description
      }
      reviews {
        _id
        reviewText
        rating
        company {
          name
        }
      }
    }
  }
`;


function Profile() {
  const token = localStorage.getItem('token');

  const decodedToken = jwtDecode(token);
  const userId = decodedToken._id;


  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || !data.user) return <p>No user data found</p>;

  const { name, email, companies, reviews } = data.user;
  console.log('User Data:', data.user);


  return (
    <div className="profile-container">
      <h2>{name}'s Profile</h2>
      <p>Email: {email}</p>

      <section>
        <h3>Companies Posted</h3>
        {companies && companies.map((company) => (
          <div key={company._id}>
            <h4>{company.name}</h4>
            <p>{company.description}</p>
            {/* Add Edit and Delete buttons for company */}
          </div>
        ))}
      </section>

      <section>
        <h3>Reviews Posted</h3>
        {reviews && reviews.map((review) => (
          <div key={review._id}>
            <p>
              {review.reviewText} - {review.rating} ⭐ on {review.company ? review.company.name : 'Unknown Company'}
            </p>
            {/* Add Edit and Delete buttons for review */}
          </div>
        ))}
      </section>
    </div>
  );
}
export default Profile;
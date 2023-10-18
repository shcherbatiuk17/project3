import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
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

const DELETE_COMPANY = gql`
  mutation DeleteCompany($companyId: ID!) {
    deleteCompany(companyId: $companyId) 
  }
`;

const EDIT_COMPANY = gql`
  mutation EditCompany($companyId: ID!, $name: String, $description: String) {
    editCompany(companyId: $companyId, name: $name, description: $description) {
     _id
      description
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

  const [deleteCompany] = useMutation(DELETE_COMPANY);
  const [editCompany] = useMutation(EDIT_COMPANY);

  function handleEditCompany(company) {
    const newDescription = window.prompt("Enter new company description:", company.description);
  
    if (newDescription && newDescription !== company.description) {
      editCompany({
        variables: {
          companyId: company._id,
          description: newDescription
        },
        update: (cache, { data: { editCompany } }) => {
          const existingProfile = cache.readQuery({
            query: GET_USER_PROFILE,
            variables: { userId },
          });
  
          const updatedCompanies = existingProfile.user.companies.map(c =>
            c._id === company._id ? { ...c, description: editCompany.description } : c
          );
  
          cache.writeQuery({
            query: GET_USER_PROFILE,
            variables: { userId },
            data: {
              ...existingProfile,
              user: {
                ...existingProfile.user,
                companies: updatedCompanies,
              },
            },
          });
        }
      }).catch((err) => {
        console.error("Error editing the company:", err);
        alert("Error editing the company. Try again later.");
      });
    }
  }
  

  function handleDeleteCompany(companyId) {
    if (window.confirm("Are you sure you want to delete this company?")) {
      deleteCompany({
        variables: { companyId },
        update: (cache) => {
          const existingProfile = cache.readQuery({
            query: GET_USER_PROFILE,
            variables: { userId },
          });

          const newCompanies = existingProfile.user.companies.filter(
            (c) => c._id !== companyId
          );

          cache.writeQuery({
            query: GET_USER_PROFILE,
            variables: { userId },
            data: {
              ...existingProfile,
              user: {
                ...existingProfile.user,
                companies: newCompanies,
              },
            },
          });
        },
      }).catch((err) => {
        console.error("Error deleting the company:", err);
        alert("Error deleting the company. Try again later.");
      });
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.user) return <p>No user data found</p>;

  const { name, email, companies, reviews } = data.user;

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
            <button onClick={() => handleEditCompany(company)}>Edit</button>
            <button onClick={() => handleDeleteCompany(company._id)}>Delete</button>
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
            {/* Edit and delete for reviews? */}
          </div>
        ))}
      </section>
    </div>
  );
}

export default Profile;

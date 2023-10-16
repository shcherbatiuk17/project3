// auth.js

// Function to save a user's authentication token to local storage
export const login = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Function to remove a user's authentication token from local storage
  export const logout = () => {
    localStorage.removeItem('token');
  };
  
  // Function to retrieve a user's authentication token from local storage
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
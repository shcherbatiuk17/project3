import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Home from './components/Homepage';
import Register from './components/RegisterPage';
import Login from './components/LoginPage';
import Companies from './components/CompanyListPage';
import CompanyDetails from './components/CompanyDetailPage';
import AddCompany from './components/AddCompanyPage';
import Profile from './components/ProfilePage';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/company/:companyId" element={<CompanyDetails />} />
            <Route path="/add-company" element={<AddCompany />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;

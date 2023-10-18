require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const jwt = require('jsonwebtoken');
const resolvers = require('./graphql/resolvers');
const SECRET_KEY = process.env.JWT_SECRET;
const app = express();
const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test');

const getUserFromToken = (req) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return null;
  
  try {
    return jwt.verify(token, SECRET_KEY );
  } catch (err) {
    return null;
  }
};

mongoose.connect(process.env.MONGODB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = getUserFromToken(req);
    
    return { user };
  }
});

(async () => {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  });
})();

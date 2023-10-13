const { AuthenticationError } = require('apollo-server-express');
const User = require('../../models/User');
const Company = require('../../models/Company');
const Review = require('../../models/Review');
const { signToken } = require('../../utils/auth');

const resolvers = {
    Query: {
        // Fetch all users
        users: async () => {
            return User.find({});
        },
        // Fetch single user by ID
        user: async (_, { userId }) => {
            const user = await User.findById(userId)
                        .populate('companies')
                        .populate({
                            path: 'reviews',
                            populate: {
                                path: 'company',
                                model: 'Company'
                            }
                        });
            console.log(user);  // Log the user data retrieved from DB
            return user;
        },
        // Fetch all companies
        companies: async () => {
            const companies = await Company.find({}).populate('reviews');

            // Compute average ratings for each company
            companies.forEach(company => {
                if (company.reviews.length) {
                    let totalRating = 0;
                    company.reviews.forEach(review => {
                        totalRating += review.rating;
                    });
                    company.rating = parseFloat((totalRating / company.reviews.length).toFixed(2));
                } else {
                    company.rating = 0;
                }
            });

            return companies;
        },

        // Fetch single company by ID and populate associated reviews
        company: async (_, { companyId }) => {
            return Company.findById(companyId).populate('reviews').populate('user');
        }
    },

    Mutation: {
        // Register new user and return signed JWT
        addUser: async (_, { name, email, password }) => {
            const user = await User.create({ name, email, password });
            const token = signToken(user);
            return { token, user };
        },
        // Authenticate user given email and password
        // If good, then return signed JWT
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password');
            }

            const token = signToken(user);
            return { token, user };
        },
        // Create and return new company
        addCompany: async (_, { name, description }, context) => {
            if (context.user) {
                const company = await Company.create({ name, description, user: context.user._id });
        
                // Update user's companies array
                await User.findByIdAndUpdate(context.user._id, { $push: { companies: company._id } });
        
                return company;
            }
            throw new AuthenticationError('You need to be logged in to add a company!');
        },
        

        // Create new review for a company by ID
        // Requires authenticated user
        addReview: async (_, { companyId, reviewText, rating }, context) => {
            if (context.user) {
                const review = await Review.create({
                    reviewText,
                    rating,
                    company: companyId,
                    user: context.user._id
                });
        
                await Company.findByIdAndUpdate(
                    companyId,
                    { $push: { reviews: review._id } },
                    { new: true }
                );
        
                // Update user's reviews array
                await User.findByIdAndUpdate(context.user._id, { $push: { reviews: review._id } });
        
                return review;
            }
            throw new AuthenticationError('You need to be logged in to post a review!');
        },
        
        updateCompany: async (_, { company, name, description }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in to edit a company!');
            }

            return Company.findByIdAndUpdate(
                company,
                { $set: { name: name, description: description } },
                { new: true }
            );
        },

        deleteCompany: async (_, { company }, context) => {
            if (!context.user) {
              throw new AuthenticationError('You need to be logged in to delete a company!');
            }
        
            await Review.deleteMany({ company: company });
            await Company.findByIdAndDelete(company);
            
            return "Company and associated reviews deleted successfully!";
          },
        
          updateReview: async (_, { reviewId, reviewText, rating }, context) => {
            if (!context.user) {
              throw new AuthenticationError('You need to be logged in to edit a review!');
            }
        
            return Review.findByIdAndUpdate(
              reviewId,
              { $set: { reviewText: reviewText, rating: rating } },
              { new: true }
            );
          },
        
          deleteReview: async (_, { reviewId }, context) => {
            if (!context.user) {
              throw new AuthenticationError('You need to be logged in to delete a review!');
            }
        
            await Review.findByIdAndDelete(reviewId);
            
            return "Review deleted successfully!";
          }
        }
};

module.exports = resolvers;

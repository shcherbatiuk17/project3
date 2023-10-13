const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');
const Review = require('./models/Review');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const saltRounds = 10;

async function clearDatabase() {
    try {
        await mongoose.connection.dropCollection('users');
    } catch (error) {
        console.log('Users collection not found.');
    }

    try {
        await mongoose.connection.dropCollection('companies');
    } catch (error) {
        console.log('Companies collection not found.');
    }

    try {
        await mongoose.connection.dropCollection('reviews');
    } catch (error) {
        console.log('Reviews collection not found.');
    }
}

async function seedDatabase() {
    await clearDatabase();

    // User data
    const usersData = [
        { name: 'Alice', email: 'alice@email.com', password: 'password123' },
        { name: 'Bob', email: 'bob@email.com', password: 'password123' },
    ];

    // Hash passwords
    const usersWithHashedPasswords = usersData.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, saltRounds)
    }));

    const insertedUsers = await User.insertMany(usersWithHashedPasswords);

    // Company data
    const companiesData = [
        { name: 'MegaCorp', description: 'Not nice.', user: insertedUsers[0]._id },
        { name: 'Small Business', description: 'Nice.', user: insertedUsers[1]._id },
    ];

    const insertedCompanies = await Company.insertMany(companiesData);

    // Review data
    const reviewsData = [
        { reviewText: 'Did not vibe.', rating: 2, company: insertedCompanies[0]._id, user: insertedUsers[0]._id },
        { reviewText: 'Vibed.', rating: 5, company: insertedCompanies[1]._id, user: insertedUsers[1]._id },
    ];

    await Review.insertMany(reviewsData);
}

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await seedDatabase();

        console.log('Database seeded!');
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
}

main();

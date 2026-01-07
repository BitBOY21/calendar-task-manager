const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedData = require('./src/utils/seedData');

dotenv.config();

const runSeeder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');
        
        await seedData();
        
        console.log('Seeding Completed!');
        process.exit();
    } catch (error) {
        console.error('Seeding Failed:', error);
        process.exit(1);
    }
};

runSeeder();
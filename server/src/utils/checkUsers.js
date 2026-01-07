const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Task = require('../models/Task');

// Load env vars
dotenv.config({ path: '../../.env' });

const checkData = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mastertasker';
        console.log(`🔌 Connecting to: ${uri}`);
        
        const conn = await mongoose.connect(uri);
        console.log(`✅ Connected to DB: ${conn.connection.name}`);

        const users = await User.find({});
        const tasks = await Task.find({});
        
        console.log('\n--- 📊 Data Report ---');
        console.log(`Users Count: ${users.length}`);
        users.forEach(u => console.log(` - ${u.name} (${u.email})`));
        
        console.log(`\nTasks Count: ${tasks.length}`);
        if (tasks.length > 0) {
            console.log(` - First task: ${tasks[0].title}`);
        }
        console.log('----------------------\n');

        process.exit();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkData();
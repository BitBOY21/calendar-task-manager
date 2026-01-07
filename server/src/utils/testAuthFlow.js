const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars - Try multiple paths to be safe
const envPath = path.resolve(__dirname, '../../.env'); // If running from src/utils
const rootEnvPath = path.resolve(process.cwd(), '.env'); // If running from server root

dotenv.config({ path: rootEnvPath }); 

const User = require('../models/User');
const Task = require('../models/Task');
const authService = require('../services/authService');
const taskService = require('../services/taskService');

const runTest = async () => {
    try {
        // Fallback if env not loaded
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mastertasker';
        // Mock secret if missing (for test only)
        if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'test_secret_123';

        await mongoose.connect(uri);
        console.log('🧪 Starting Auth & Isolation Test...\n');

        // 1. Cleanup (Delete test users if exist)
        await User.deleteMany({ email: { $in: ['alice@test.com', 'bob@test.com'] } });
        
        // 2. Register User A (Alice)
        console.log('👤 Registering Alice...');
        const alice = await authService.register({ name: 'Alice', email: 'alice@test.com', password: '123' });
        console.log(`   ✅ Alice created (ID: ${alice._id})`);

        // 3. Register User B (Bob)
        console.log('👤 Registering Bob...');
        const bob = await authService.register({ name: 'Bob', email: 'bob@test.com', password: '123' });
        console.log(`   ✅ Bob created (ID: ${bob._id})`);

        // 4. Alice creates a task
        console.log('\n📝 Alice creates a task: "Secret Alice Task"');
        await taskService.createTask(alice._id, { title: 'Secret Alice Task' });

        // 5. Bob tries to see tasks
        console.log('🕵️ Bob checks his tasks...');
        const bobTasks = await taskService.getAllTasks(bob._id);
        console.log(`   Bob sees: ${bobTasks.length} tasks.`);
        
        if (bobTasks.length === 0) {
            console.log('   ✅ SUCCESS: Bob cannot see Alice\'s task.');
        } else {
            console.log('   ❌ FAILURE: Bob sees tasks he shouldn\'t!');
        }

        // 6. Alice checks her tasks
        console.log('👩 Alice checks her tasks...');
        const aliceTasks = await taskService.getAllTasks(alice._id);
        console.log(`   Alice sees: ${aliceTasks.length} tasks.`);

        if (aliceTasks.length === 1 && aliceTasks[0].title === 'Secret Alice Task') {
            console.log('   ✅ SUCCESS: Alice sees her task.');
        } else {
            console.log('   ❌ FAILURE: Alice cannot see her task.');
        }

        // Cleanup
        await User.deleteMany({ email: { $in: ['alice@test.com', 'bob@test.com'] } });
        await Task.deleteMany({ user: { $in: [alice._id, bob._id] } });
        console.log('\n🧹 Cleanup done.');

        process.exit();
    } catch (error) {
        console.error('❌ Test Failed:', error);
        process.exit(1);
    }
};

runTest();
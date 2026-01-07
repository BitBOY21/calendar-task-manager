const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const { calculateUrgency } = require('./taskUtils');

const seedData = async () => {
    console.log('🌱 Seeding Demo User Data...');

    // 1. Create Demo User
    const email = 'demo@example.com';
    let user = await User.findOne({ email });

    if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);
        user = await User.create({
            name: 'Demo User',
            email,
            password: hashedPassword
        });
        console.log('👤 Created user: demo@example.com / 123456');
    } else {
        console.log('👤 Found user: demo@example.com');
    }

    // 2. Clear existing tasks for this user
    await Task.deleteMany({ user: user._id });

    const tasks = [];
    const today = new Date();
    
    // Helper functions
    const addDays = (date, days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    };

    const setTime = (date, hours, minutes) => {
        const d = new Date(date);
        d.setHours(hours, minutes, 0, 0);
        return d;
    };

    // --- 1. Today's Tasks (The "Focus" List) ---
    tasks.push(
        {
            title: "Morning Standup Meeting",
            priority: "High",
            tags: ["Work 💼", "Urgent 🔥"],
            dueDate: setTime(today, 9, 0),
            endDate: setTime(today, 9, 30),
            isCompleted: true, // Already done
            description: "Daily sync with the dev team."
        },
        {
            title: "Review Project Proposal",
            priority: "High",
            tags: ["Work 💼"],
            dueDate: setTime(today, 11, 0),
            endDate: setTime(today, 12, 30),
            isCompleted: false, // Urgent & Pending
            subtasks: [
                { text: "Read executive summary", isCompleted: true },
                { text: "Add comments", isCompleted: false },
                { text: "Send feedback email", isCompleted: false }
            ]
        },
        {
            title: "Lunch with Sarah",
            priority: "Medium",
            tags: ["Personal 🏠", "Social"],
            dueDate: setTime(today, 13, 0),
            endDate: setTime(today, 14, 0),
            isCompleted: true,
            location: "Italian Bistro"
        },
        {
            title: "Finish React Component",
            priority: "Medium",
            tags: ["Work 💼", "Study 📚"],
            dueDate: setTime(today, 15, 0),
            endDate: setTime(today, 17, 0),
            isCompleted: false
        },
        {
            title: "Gym Workout",
            priority: "Low",
            tags: ["Health 💪"],
            dueDate: setTime(today, 18, 30),
            endDate: setTime(today, 20, 0),
            isCompleted: false
        }
    );

    // --- 2. Upcoming Tasks (This Week) ---
    tasks.push(
        {
            title: "Grocery Shopping",
            priority: "Medium",
            tags: ["Shopping 🛒", "Errands 🏃"],
            dueDate: setTime(addDays(today, 1), 17, 0),
            isCompleted: false
        },
        {
            title: "Dentist Appointment",
            priority: "High",
            tags: ["Health 💪", "Urgent 🔥"],
            dueDate: setTime(addDays(today, 2), 10, 0),
            location: "City Dental Clinic",
            isCompleted: false
        },
        {
            title: "Submit Tax Report",
            priority: "High",
            tags: ["Finance 💰"],
            dueDate: setTime(addDays(today, 3), 9, 0),
            isCompleted: false
        },
        {
            title: "Weekend Trip Planning",
            priority: "Low",
            tags: ["Family 👨‍👩‍👧‍👦", "Personal 🏠"],
            dueDate: setTime(addDays(today, 4), 20, 0),
            isCompleted: false
        }
    );

    // --- 3. Past Tasks (History & Stats) ---
    // Generate 15 random past tasks
    for (let i = 1; i <= 15; i++) {
        const isCompleted = Math.random() > 0.2; // 80% completion rate
        const priority = Math.random() > 0.7 ? "High" : (Math.random() > 0.4 ? "Medium" : "Low");
        
        tasks.push({
            title: `Past Task ${i}`,
            priority: priority,
            tags: ["Work 💼", "Personal 🏠"],
            dueDate: setTime(addDays(today, -i), 10, 0),
            isCompleted: isCompleted,
            description: "Auto-generated history task."
        });
    }

    // Add user ID and calculate urgency for all
    const finalTasks = tasks.map(t => ({
        ...t,
        user: user._id,
        urgencyScore: calculateUrgency(t.dueDate, t.priority)
    }));

    await Task.insertMany(finalTasks);
    console.log(`✅ Seeded ${finalTasks.length} tasks successfully!`);
};

module.exports = seedData;
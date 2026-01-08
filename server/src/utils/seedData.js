const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const { calculateUrgency } = require('./taskUtils');
const crypto = require('crypto');

const seedData = async () => {
    console.log('🌱 Seeding Mike\'s life (30, Single, Professional)...');

    const email = 'mike@mastertasker.com';
    let user = await User.findOne({ email });

    if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('mike123', salt);
        user = await User.create({
            name: 'Mike',
            email,
            password: hashedPassword
        });
    }

    await Task.deleteMany({ user: user._id });

    const tasks = [];
    const today = new Date();
    
    const TAGS = {
        WORK: "Work 💼",
        PERSONAL: "Personal 🏠",
        URGENT: "Urgent 🔥",
        HEALTH: "Health 💪",
        STUDY: "Study 📚",
        FINANCE: "Finance 💰",
        SHOPPING: "Shopping 🛒",
        FAMILY: "Family 👨‍👩‍👧‍👦",
        ERRANDS: "Errands 🏃",
        SOCIAL: "Social 🍻"
    };

    // Helper to create dates relative to today
    const addDays = (days, h = 9, m = 0) => {
        const date = new Date(today);
        date.setDate(date.getDate() + days);
        date.setHours(h, m, 0, 0);
        return date;
    };

    // --- 1. Recurring Tasks ---
    const recurrenceId1 = crypto.randomUUID();
    for (let i = -10; i < 30; i++) {
        tasks.push({
            user: user._id,
            title: "Morning Espresso & News ☕",
            priority: "Low",
            tags: [TAGS.PERSONAL],
            dueDate: addDays(i, 7, 30),
            isAllDay: false,
            recurrence: 'daily',
            recurrenceId: recurrenceId1,
            isCompleted: i < 0
        });
    }

    const recurrenceId2 = crypto.randomUUID();
    for (let i = 0; i < 8; i++) {
        tasks.push({
            user: user._id,
            title: "Weekly Sync with Product Team 🚀",
            priority: "High",
            tags: [TAGS.WORK],
            dueDate: addDays(i * 7, 10, 0),
            endDate: addDays(i * 7, 11, 0),
            location: "Conference Room B / Zoom",
            recurrence: 'weekly',
            recurrenceId: recurrenceId2,
            isCompleted: false
        });
    }

    const recurrenceId3 = crypto.randomUUID();
    for (let i = -1; i < 5; i++) {
        tasks.push({
            user: user._id,
            title: "Sunday Meal Prep 🥗",
            priority: "Medium",
            tags: [TAGS.HEALTH, TAGS.PERSONAL],
            dueDate: addDays(i * 7 + (7 - today.getDay()), 16, 0),
            recurrence: 'weekly',
            recurrenceId: recurrenceId3,
            isCompleted: i < 0,
            description: "Prepare lunches for the work week to save time and eat healthy.",
            subtasks: [
                { text: "Grocery shopping", isCompleted: i < 0 },
                { text: "Cook chicken and grains", isCompleted: i < 0 },
                { text: "Portion into containers", isCompleted: i < 0 }
            ]
        });
    }

    // --- 2. Multi-Day Projects ---
    tasks.push({
        user: user._id,
        title: "Frontend Architecture Overhaul",
        priority: "High",
        tags: [TAGS.WORK, TAGS.URGENT],
        dueDate: addDays(-2, 9, 0),
        endDate: addDays(3, 18, 0),
        isCompleted: false,
        description: "Refactoring the core components to use the new design system.",
        subtasks: [
            { text: "Audit existing components", isCompleted: true },
            { text: "Implement new ThemeProvider", isCompleted: true },
            { text: "Migrate DashboardPage", isCompleted: false },
            { text: "Migrate AnalyticsPage", isCompleted: false }
        ]
    });

    tasks.push({
        user: user._id,
        title: "Weekend Trip to the Coast 🌊",
        priority: "Medium",
        tags: [TAGS.PERSONAL, TAGS.SOCIAL],
        dueDate: addDays(4, 14, 0),
        endDate: addDays(6, 20, 0),
        isAllDay: true,
        description: "Solo trip to clear my head and get some sun.",
        location: "Coastal Resort & Spa",
        subtasks: [
            { text: "Book hotel", isCompleted: true },
            { text: "Pack bag", isCompleted: false },
            { text: "Check car tire pressure", isCompleted: false }
        ]
    });

    // --- 3. All Day Events ---
    tasks.push({
        user: user._id,
        title: "Mom's Birthday 🎂",
        priority: "High",
        tags: [TAGS.FAMILY],
        dueDate: addDays(2),
        isAllDay: true,
        description: "Don't forget to call and send flowers!",
        location: "Family Home"
    });

    tasks.push({
        user: user._id,
        title: "National Tech Conference 💻",
        priority: "Medium",
        tags: [TAGS.WORK, TAGS.STUDY],
        dueDate: addDays(10),
        endDate: addDays(12),
        isAllDay: true,
        description: "Annual gathering of developers and architects.",
        location: "Convention Center, Downtown"
    });

    // --- 4. Single Tasks (Scattered & Realistic) ---
    tasks.push(
        {
            user: user._id,
            title: "Gym: Heavy Lifting 🏋️‍♂️",
            priority: "Medium",
            tags: [TAGS.HEALTH],
            dueDate: addDays(0, 18, 30),
            location: "Iron Paradise Gym",
            isCompleted: false
        },
        {
            user: user._id,
            title: "Pay Rent & Utilities 💸",
            priority: "High",
            tags: [TAGS.FINANCE],
            dueDate: addDays(-1, 12, 0),
            isCompleted: true
        },
        {
            user: user._id,
            title: "Buy New Running Shoes",
            priority: "Low",
            tags: [TAGS.SHOPPING, TAGS.HEALTH],
            dueDate: addDays(1, 16, 0),
            location: "Nike Flagship Store",
            subtasks: [
                { text: "Check reviews online", isCompleted: true },
                { text: "Try on Pegasus 40", isCompleted: false },
                { text: "Compare with Brooks Ghost", isCompleted: false }
            ]
        },
        {
            user: user._id,
            title: "Review PR #452: Auth Logic",
            priority: "Medium",
            tags: [TAGS.WORK],
            dueDate: addDays(0, 14, 0),
            description: "Critical security update for the login flow.",
            isCompleted: false
        },
        {
            user: user._id,
            title: "Drinks with Sarah 🍸",
            priority: "Medium",
            tags: [TAGS.SOCIAL],
            dueDate: addDays(1, 20, 0),
            location: "The Blind Pig Speakeasy",
            description: "Catch up after her promotion."
        },
        {
            user: user._id,
            title: "Car Oil Change & Service",
            priority: "Medium",
            tags: [TAGS.ERRANDS],
            dueDate: addDays(5, 8, 30),
            location: "AutoCare Center",
            subtasks: [
                { text: "Drop off car", isCompleted: false },
                { text: "Pick up by 5 PM", isCompleted: false }
            ]
        },
        {
            user: user._id,
            title: "Dentist Appointment 🦷",
            priority: "High",
            tags: [TAGS.HEALTH],
            dueDate: addDays(3, 11, 0),
            location: "Bright Smile Dental",
            description: "Routine cleaning and checkup."
        },
        {
            user: user._id,
            title: "Laundry & Apartment Deep Clean",
            priority: "Low",
            tags: [TAGS.PERSONAL, TAGS.ERRANDS],
            dueDate: addDays(-2, 10, 0),
            isCompleted: true,
            subtasks: [
                { text: "Wash bedding", isCompleted: true },
                { text: "Vacuum living room", isCompleted: true },
                { text: "Clean bathroom", isCompleted: true }
            ]
        },
        {
            user: user._id,
            title: "1-on-1 with Manager",
            priority: "High",
            tags: [TAGS.WORK],
            dueDate: addDays(0, 15, 30),
            location: "Manager's Office / Slack Huddle",
            description: "Discussing career growth and Q3 goals."
        }
    );

    // --- 5. AI Breakdown Example ---
    tasks.push({
        user: user._id,
        title: "Plan 30th Birthday Party 🥳",
        priority: "High",
        tags: [TAGS.PERSONAL, TAGS.FAMILY, TAGS.SOCIAL],
        dueDate: addDays(15, 20, 0),
        description: "Big milestone coming up! Need to make it special.",
        location: "Skyline Rooftop Lounge",
        subtasks: [
            { text: "Finalize guest list", isCompleted: false },
            { text: "Book rooftop venue", isCompleted: true },
            { text: "Order catering (Tacos & Margaritas!)", isCompleted: false },
            { text: "Create Spotify playlist", isCompleted: false },
            { text: "Send out digital invites", isCompleted: false }
        ]
    });

    // Calculate urgency and save
    const finalTasks = tasks.map(task => ({
        ...task,
        urgencyScore: calculateUrgency(task.dueDate, task.priority)
    }));

    await Task.insertMany(finalTasks);
    console.log(`✅ Mike's life seeded with extra realism! Email: mike@mastertasker.com, Pass: mike123`);
};

module.exports = seedData;
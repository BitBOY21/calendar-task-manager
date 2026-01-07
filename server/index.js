const app = require('./src/app');
// const seedData = require('./src/utils/seedData'); // Disabled auto-seeding

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    
    // Auto-seeding disabled to persist user data
    // try {
    //     await seedData();
    // } catch (error) {
    //     console.error('Seeding failed:', error);
    // }
});
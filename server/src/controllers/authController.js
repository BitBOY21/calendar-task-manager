const authService = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');

const registerUser = asyncHandler(async (req, res) => {
    console.log('🔶 Server: Register Request Received', req.body);
    const { name, email, password } = req.body;
    try {
        const user = await authService.register({ name, email, password });
        console.log('🔷 Server: User Registered Successfully', user._id);
        res.status(201).json(user);
    } catch (error) {
        res.status(400); // Bad Request
        throw error;
    }
});

const loginUser = asyncHandler(async (req, res) => {
    console.log('🔶 Server: Login Request Received', req.body);
    const { email, password } = req.body;
    try {
        const user = await authService.login(email, password);
        console.log('🔷 Server: User Logged In Successfully', user._id);
        res.json(user);
    } catch (error) {
        res.status(401); // Unauthorized
        throw error;
    }
});

module.exports = {
    registerUser,
    loginUser
};
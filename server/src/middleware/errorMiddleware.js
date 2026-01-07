const errorHandler = (err, req, res, next) => {
    // If status code is 200 (default), change it to 500 (Server Error)
    // Otherwise, keep the existing status code (e.g., 400, 401, 404)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode);

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    errorHandler,
};
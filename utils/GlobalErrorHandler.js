export const GlobalErrorMiddleware = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Invalid or expired token";
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID";
    } else if (err.code === 11000) {
        // Unique index violation (e.g. two concurrent signups with the same email)
        const field = Object.keys(err.keyValue || {})[0] || "Field";
        statusCode = 409;
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

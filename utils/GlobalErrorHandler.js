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
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

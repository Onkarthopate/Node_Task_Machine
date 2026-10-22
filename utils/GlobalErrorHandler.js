export const GlobalErrorMiddleware = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode =
        err.statusCode ||
        err.status ||
        500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

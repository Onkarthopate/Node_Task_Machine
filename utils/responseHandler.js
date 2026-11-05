export const SuccessResponce = (res, statusCode, message, data = null, extra = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...extra,
        data
    })
}
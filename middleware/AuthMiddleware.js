import ErrorHandler from "../utils/ErrorHandler.js";


export const AuthTokenMiddleware = ErrorHandler(async (req, res, next) => {
    // const authToken = req.headers.authorization;
    const authToken = req.headers.authorization;
    // console.log(authToken);

    if (!authToken || !authToken.includes('Bearer')) {
        return res.status(401).json({
            success: false,
            message: "Unauthrized Access "
        })
    }

    const token = authToken.split(" ")[1];
    console.log(token);

    req.token = token;
     next();


})
import User from "../models/UserAuth.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

export const AuthTokenMiddleware = ErrorHandler(async (req, res, next) => {
    // const authToken = req.headers.authorization;
    const authToken = req.headers.authorization;
    // console.log(authToken);

    if (!authToken || !authToken.includes('Bearer')) {
        return res.status(401).json({
            success: false,
            message: "Access denied , You are not allowed for this operation."
        })
    }

    const token = authToken.split(" ")[1];

    // console.log(token);

    const decodeToken = jwt.verify(
        token,
        process.env.JWT_SECRET,
    )

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new CustomError("User not found", 401);
    }

    if (
        !user.activeSessionId ||
        user.activeSessionId !== decoded.sessionId
    ) {
        throw new CustomError(
            "You are logged in on another device",
            401
        );
    }

    req.user = {
        id: user._id,
        role: user.role,
        sessionId: decoded.sessionId
    };
    console.log(req.user);

    // req.token = token;
    next();
})
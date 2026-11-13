import User from "../models/UserAuth.js";
import CustomError from "../utils/CustomError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

export const AuthTokenMiddleware = ErrorHandler(async (req, res, next) => {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith("Bearer ")) {
        throw new CustomError("Access denied, you are not allowed for this operation.", 401);
    }

    const token = authToken.split(" ")[1];

    if (!token) {
        throw new CustomError("Access denied, token missing.", 401);
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
    );

    const user = await User.findById(decoded.id).lean();

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

    next();
});
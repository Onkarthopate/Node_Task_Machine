import { SuccessResponce } from "../utils/responseHandler.js";
import * as authService from "../services/authService.js";

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const createUser = await authService.registerUserService(
        username, email, password
    );

    return SuccessResponce(
        res,
        201,
        "User registered successfully",
        createUser
    );
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const { user, token } = await authService.loginService(
        email, password
    );

    return SuccessResponce(
        res, 200, "Login Successfully", { token, user }
    );
};

export const forgetPassword = async (req, res) => {
    const { email } = req.body;

    await authService.forgetPasswordService(
        email
    );

    return SuccessResponce(
        res,
        200,
        "OTP sent successfully to your email",
        null
    );
};

export const resetPassword = async (req, res) => {
    const { email, otp, newPass, confirmPass } = req.body;

    await authService.resetPasswordService(
        email,
        otp,
        newPass,
        confirmPass
    );

    return SuccessResponce(
        res,
        200,
        "Password reset successfully",
        null
    );
};





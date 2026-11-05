import ErrorHandler from "../utils/ErrorHandler.js";
import { SuccessResponce } from "../utils/responseHandler.js";
import * as authService from "../services/authService.js";

export const registerUser = ErrorHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const createUser = await authService.registerUserService(
        username, email, password
    )

    return SuccessResponce(
        res,
        200,
        "User register successfully",
        createUser
    )
});

export const loginUser = ErrorHandler(async (req, res) => {
    const { email, password } = req.body;

    const { user, token } = await authService.loginService(
        email, password
    )

    return SuccessResponce(
        res, 200, "Login Successfully", { token, user }
    );
})

export const forgetPassword = ErrorHandler(async (req, res) => {
    const { email } = req.body;

    await authService.forgetPasswordService(
        email
    );

    return res.status(200).json({
        success: true,
        message: "OTP sent successfully to your email",
    });
});


export const resetPassword = ErrorHandler(async (req, res) => {

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
});





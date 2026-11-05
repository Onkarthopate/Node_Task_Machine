import { body, param, query } from "express-validator";

import {
    usernameValidator,
    emailValidator,
    passwordValidator
} from "./commonValidator.js";

// REGISTER RECRUITER AND ADMIN VALIDAES
export const registerValidator = [
    usernameValidator,
    emailValidator,
    passwordValidator
];

export const loginValidator = [
    emailValidator,
    passwordValidator
];


// REMOVE USER
export const removeUserValidator = [
    param("id")
        .notEmpty()
        .withMessage("User ID is required")
        .bail()
        .isMongoId()
        .withMessage("Invalid user ID")
];

// UPDATE USER
export const updateUserValidator = [

    param("id")
        .notEmpty()
        .withMessage("User ID is required")
        .bail()
        .isMongoId()
        .withMessage("Invalid user ID"),

    query("role")
        .notEmpty()
        .withMessage("Role is required")
        .bail()
        .isIn(["CANDIDATE", "RECRUITER"])
        .withMessage("Invalid role"),

    usernameValidator,

    emailValidator
];

// reset pass
export const resetPasswordValidator = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("otp")
        .notEmpty()
        .withMessage("OTP is required")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be exactly 6 digits")
        .isNumeric()
        .withMessage("OTP must contain only numbers"),

    body("newPass")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain one number")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain one special character"),

    body("confirmPass")
        .notEmpty()
        .withMessage("Confirm password is required")
        .custom((value, { req }) => {
            if (value !== req.body.newPass) {
                throw new Error("Passwords do not match");
            }
            return true;
        })
];

export const createJobValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be between 3 and 100 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 10, max: 2000 })
        .withMessage("Description must be between 10 and 2000 characters"),

    body("jobRole")
        .trim()
        .notEmpty()
        .withMessage("Job role is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Job role must be between 2 and 100 characters")

];
import { body, query } from "express-validator";

export const usernameValidator = body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required");

export const emailValidator = body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail();

export const passwordValidator = body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
    .withMessage(
        "Password must contain uppercase, lowercase, number and special character"
    );

export const roleValidator = 
    query("role")
        .notEmpty()
        .withMessage("Role is required")
        .bail()
        .isIn(["CANDIDATE", "RECRUITER"])
        .withMessage("Invalid role");


export const idValidator = body("id")
        .notEmpty()
        .withMessage("id is required")
        .bail()

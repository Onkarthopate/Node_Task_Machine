import { body, param, query } from "express-validator";
import { MANAGEABLE_ROLES } from "../constants/roles.js";
import mongoose from "mongoose";

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
        .isIn(MANAGEABLE_ROLES)
        .withMessage("Invalid role");


export const paramIdValidator = param("id")
    .notEmpty()
    .withMessage("Id is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID");

export const queryIdValidator = query("id")
    .notEmpty()
    .withMessage("Id is required")
    .bail()
    .custom((value) => {
        const ids = Array.isArray(value) ? value : [value];

        if (!ids.every(id => mongoose.isValidObjectId(id))) {
            throw new Error("Invalid candidate ID");
        }

        return true;
    });
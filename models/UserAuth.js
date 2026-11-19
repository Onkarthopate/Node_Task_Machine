import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ROLES, ALL_ROLES } from "../constants/roles.js";

const UserAuthModel = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        minlength: 2,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        select: false,
        required: [true, "password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
        type: String,
        enum: {
            values: ALL_ROLES,
            message: "{VALUE} is not a valid role"
        },
        required: true,
        uppercase: true,
        default: ROLES.CANDIDATE,
        trim: true,
    },
    activeSessionId: {
        type: String,
        default: null
    },
}, {
    timestamps: true,
},
);

UserAuthModel.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("UserTable", UserAuthModel);
export default User;
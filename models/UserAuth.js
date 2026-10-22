import mongooose from "mongoose";

const UserAuthModel = mongooose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        minlength: 2,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        minlength: 11,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        select:false,
        required: [true, "password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
        type: String,
        enum: ["CANDIDATE", "RECRUITER", "ADMIN"],
        default: "CANDIDATE",
    },
}, {
    timestamps: true,
},
)

const User = mongooose.model("UserTable", UserAuthModel);
export default User;
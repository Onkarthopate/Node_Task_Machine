import mongooose from "mongoose";
import bcrypt from "bcrypt";

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
        select: false,
        required: [true, "password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
        type: String,
        //enum: ["CANDIDATE", "RECRUITER", "ADMIN"],
        required: true,
        uppercase: true,
        default: "CANDIDATE",
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

const User = mongooose.model("UserTable", UserAuthModel);
export default User;
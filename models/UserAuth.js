import mongooose from "mongoose";

const UserAuthModel = mongooose.Schema({
    username: {
        type: String,
        require: [true, "username is required"],
        minlength: 2,
    },
    email: {
        type: String,
        require: [true, "email is required"],
        minlength: 11,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        select:false,
        require: [true, "password is requied"],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
        type: String,
        enum: ["candidate", "recruiter", "admin"],
        default: "candidate",
    },
}, {
    timeStamp: true,
},
)

const User = mongooose.model("UserTable", UserAuthModel);
export default User;
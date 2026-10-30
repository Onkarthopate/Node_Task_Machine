import jwt from "jsonwebtoken";

export const genrateJWT = (id , role)=>{
    return  jwt.sign(
        { id, role},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY_TIME }
    )
}
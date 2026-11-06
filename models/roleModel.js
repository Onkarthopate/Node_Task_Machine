import mongoose from "mongoose";

const RoleModel = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    permissions: [{
        type: String
    }]

}, {
    timestamps: true
});

const RoleTable = mongoose.model("RoleTable", RoleModel);

export default RoleTable;
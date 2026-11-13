import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema(
    {
        baseUrl: {
            type: String,
            required: true,
            trim: true,
        },
        path: {
            type: String,
            required: true,
            trim: true,
        },
        method: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },
        name: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

PermissionSchema.index({ baseUrl: 1, path: 1, method: 1 }, { unique: true });

const Permission = mongoose.model("Permission", PermissionSchema);

export default Permission;

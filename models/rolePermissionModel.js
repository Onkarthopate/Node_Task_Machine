import mongoose from "mongoose";

const RolePermissionSchema = new mongoose.Schema(
    {
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RoleTable",
            required: true,
        },
        permissionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Permission",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

RolePermissionSchema.index({ roleId: 1, permissionId: 1 }, { unique: true });

const RolePermission = mongoose.model("RolePermission", RolePermissionSchema);

export default RolePermission;

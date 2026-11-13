import RoleTable from "../models/roleModel.js";
import Permission from "../models/permissionModel.js";
import RolePermission from "../models/rolePermissionModel.js";

const roles = [
    {
        name: "ADMIN",
        permissions: [
            "job:create",
            "job:read",
            "job:update",
            "job:delete",
            "application:read_apply_by_candidate",
            "user:manage",
            "create-recruiter",
            "user:export",
            "job:export",
        ]
    },
    {
        name: "RECRUITER",
        permissions: [
            "job:create",
            "my-created-job:read",
            "job:update",
            "application:my-created-job"
        ]
    },
    {
        name: "CANDIDATE",
        permissions: [
            "job:read",
            "application:create",
            "application:read_own",
        ]
    }
];

const routePermissions = [
    // Auth routes (/api/auth)
    { baseUrl: "/api/auth", path: "/users", method: "GET", name: "user:manage" },
    { baseUrl: "/api/auth", path: "/users/:id", method: "DELETE", name: "user:manage" },
    { baseUrl: "/api/auth", path: "/users/:id", method: "PUT", name: "user:manage" },
    { baseUrl: "/api/auth", path: "/registerRecruiter", method: "POST", name: "create-recruiter" },

    // Job routes (/api/jobs)
    { baseUrl: "/api/jobs", path: "/", method: "GET", name: "job:read" },
    { baseUrl: "/api/jobs", path: "/recruiter", method: "GET", name: "my-created-job:read" },
    { baseUrl: "/api/jobs", path: "/:id", method: "DELETE", name: "job:delete" },
    { baseUrl: "/api/jobs", path: "/", method: "POST", name: "job:create" },
    { baseUrl: "/api/jobs", path: "/:id/apply", method: "POST", name: "application:create" },
    { baseUrl: "/api/jobs", path: "/applied", method: "GET", name: "application:read_own" },
    { baseUrl: "/api/jobs", path: "/candidate", method: "GET", name: "application:read_apply_by_candidate" },
    { baseUrl: "/api/jobs", path: "/recruiter/applications", method: "GET", name: "application:my-created-job" },

    // Export routes (/api/export)
    { baseUrl: "/api/export", path: "/export", method: "GET", name: "user:export" },
    { baseUrl: "/api/export", path: "/applied-jobs", method: "GET", name: "job:export" },
];

export const seedRoles = async () => {
    const roleDocs = await Promise.all(
        roles.map((role) =>
            RoleTable.findOneAndUpdate(
                { name: role.name },
                { $set: { permissions: role.permissions } },
                { upsert: true, new: true }
            )
        )
    );

    const permissionDocs = await Promise.all(
        routePermissions.map((perm) =>
            Permission.findOneAndUpdate(
                { baseUrl: perm.baseUrl, path: perm.path, method: perm.method },
                { $set: { name: perm.name } },
                { upsert: true, new: true }
            )
        )
    );

    const roleMap = new Map(roleDocs.map((r) => [r.name, r]));

    const rolePermissionOps = [];
    for (const roleDef of roles) {
        const roleDoc = roleMap.get(roleDef.name);
        if (!roleDoc) continue;

        for (const permDoc of permissionDocs) {
            if (roleDef.permissions.includes(permDoc.name)) {
                rolePermissionOps.push({
                    updateOne: {
                        filter: { roleId: roleDoc._id, permissionId: permDoc._id },
                        update: { $setOnInsert: { roleId: roleDoc._id, permissionId: permDoc._id } },
                        upsert: true,
                    },
                });
            }
        }
    }

    if (rolePermissionOps.length > 0) {
        await RolePermission.bulkWrite(rolePermissionOps);
    }

    console.log("Roles and route permissions seeded successfully");
};
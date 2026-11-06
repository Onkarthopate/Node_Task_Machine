import RoleTable from "../models/roleModel.js";

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

export const seedRoles = async () => {

    await Promise.all(roles.map((role) =>
        RoleTable.updateOne(
            { name: role.name },
            { $set: { permissions: role.permissions } },
            { upsert: true }
        )
    ));

    console.log("Roles seeded successfully");
};
// Single source of truth for role names. Always import from here instead of
// typing role strings directly, so a typo becomes an import error, not a silent bug.
export const ROLES = Object.freeze({
    ADMIN: "ADMIN",
    RECRUITER: "RECRUITER",
    CANDIDATE: "CANDIDATE",
});

export const ALL_ROLES = Object.freeze(Object.values(ROLES));

// Roles an admin is allowed to list / update via the user-management endpoints.
export const MANAGEABLE_ROLES = Object.freeze([ROLES.CANDIDATE, ROLES.RECRUITER]);

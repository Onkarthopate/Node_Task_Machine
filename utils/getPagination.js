export const getPagination = (query) => {

    const limit = Math.min(
        Math.max(Number.parseInt(query.limit, 10) || 10, 1),
        100
    );

    const offset = Math.max(
        Number.parseInt(query.offset, 10) || 0,
        0
    );

    return {
        limit,
        offset
    };
};
export const filterConditions = (
    searchTerm: string | undefined,
    fileds: string[],
    filtersData: { [s: string]: unknown } | ArrayLike<unknown>
) => {
    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            $or: fileds.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }

    // Filters needs $and to fullfill all the conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    return andConditions.length > 0 ? { $and: andConditions } : {};
};

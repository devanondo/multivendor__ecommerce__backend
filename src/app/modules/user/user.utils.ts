// Generate the customer|vendor|admin custom id `userid`

import { User } from './user.model';

const findLastUserId = async (role: string): Promise<string | undefined> => {
    const lastUser = await User.findOne({ role: role }, { userid: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();

    return lastUser?.userid ? lastUser.userid.substring(7) : undefined;
};

// CUS0Y23000001
export const generateUserId = async (
    role: string,
    prefix: string
): Promise<string> => {
    const currentYear = new Date().getFullYear();
    const year = currentYear.toString().substring(2);

    const currentId =
        (await findLastUserId(role)) || (0).toString().padStart(6, '0');

    let incrementedId = (parseInt(currentId) + 1).toString().padStart(6, '0');

    incrementedId = `${prefix}0Y${year}${incrementedId}`;
    return incrementedId;
};

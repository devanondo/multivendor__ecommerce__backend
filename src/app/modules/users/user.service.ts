import { IUser } from './user.interface'
import { User } from './user.model'

const createUser = async (user: IUser): Promise<IUser | null> => {
    const newUser = await User.create(user)

    return newUser
}

export default {
    createUser,
}

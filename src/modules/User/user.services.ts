// here we define the business logic of the user module
// we can use the user model to interact with the database and perform operations like create, update, delete, etc.

import { Role, User, UserModel } from "../../database/models/user.models";
import { NotFoundError, UnauthorizedError } from "../../utils/errors";
import { UserItem } from "../../database/models/user.models";
import { Password } from "../../utils/password";
import { generateToken } from "../../utils/token";

// 1. The user can register an account with their email and password
export const registerUser = async (
    username: string,
    password: string,
    role: Role,
): Promise<User> => {
    const hashedPassword = await Password.hash(password);
    const userTmp: UserItem = {
        username,
        password: hashedPassword,
        role,
    };
    const user = await UserModel.createUser(userTmp);
    return user;
};

// 2. The user can login to their account
export const loginUser = async (
    username: string,
    password: string,
): Promise<string> => {
    const user = await UserModel.getUserByUsername(username);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    const isValidPassword = Password.compare(password, user.password);
    if (!isValidPassword) {
        throw new UnauthorizedError("Invalid password");
    }

    const token = generateToken(user);
    return token;
};

// 3. The logged in user can deposit money into their account (account record) associated with their user record

// 4. The logged in user can buy a product with the money in their account (account record)

// 5. The logged in user can reset their deposit = 0 [for testing purposes]

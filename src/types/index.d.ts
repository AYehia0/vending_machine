import { User } from "../database/models/user.models";

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}

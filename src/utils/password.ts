import bcrypt from "bcrypt";

export class Password {
    static hash(password: string): string {
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALTNESS || "10"));
        return bcrypt.hashSync(password, salt);
    }

    static compare(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }
}

import prismaClient from "../../prisma";
import { compare } from 'bcryptjs';
import { sign } from "jsonwebtoken";

interface AuthUserRequest {
    email: string;
    password: string;
}

class AuthUserService {

    async execute({ email, password }: AuthUserRequest) {

        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if(!user) {
            throw new Error("Email/password incorrect");
        }

        const passwordMatch = await compare(password, user?.password)

        if(!passwordMatch) {
            throw new Error("Email/password incorrect");
        }

        // Generate a TOKEN JWT
        const token = sign(
            {
                name: user.name,
                email: user.email,
            },
            process.env.JWT_SECRET, // need to disable strict mode on tsconfig.json
            {
                subject: user.id,
                expiresIn: '30d',
            }
        )

        return {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            token: token,
        }
    }

}

export { AuthUserService }
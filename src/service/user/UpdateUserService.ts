import prismaClient from "../../prisma";

interface UserRequest {
    user_id: string;
    name: string;
}

class UpdateUserService {
    async execute({ user_id, name }: UserRequest) {

        try {
            const userAlreadyExists = await prismaClient.user.findFirst({
                where: {
                    id: user_id,
                }
            })

            if(!userAlreadyExists) {
                throw new Error("User not exists!");
            }

            const userUpdated = await prismaClient.user.update({
                where: {
                    id: user_id
                },
                data: {
                    name
                },
                select: {
                    name: true,
                    email: true,
                }
            })

            return userUpdated;
            
        } catch(err) {

        }
    }
}

export { UpdateUserService }
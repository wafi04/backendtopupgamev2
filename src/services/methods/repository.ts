import { CreateMethod } from "@/common/interfaces/methods";
import prisma from "@/lib/prisma";

export class  MethodsRepository {
    private prisma;
    
    constructor(prismaClient = prisma) {
        this.prisma = prismaClient;
    }

    async  Create(req : CreateMethod){

    }
}
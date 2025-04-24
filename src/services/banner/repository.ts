import { PrismaErrorHandler } from "@/common/constants/erorr-prisma";
import { CreateBanner, DeleteBanner, UpdateBanner } from "@/common/interfaces/banner";
import prisma from "@/lib/prisma";

export class BannerRepository {
    private prisma;
    private prismaErrorHandler: PrismaErrorHandler;
    
    constructor(prismaClient = prisma) {
        this.prisma = prisma
        this.prismaErrorHandler = new PrismaErrorHandler({
          NOT_FOUND: {
         status: 404,
         message: "Banner not found not found"
       }
        })
    }

   private handlePrismaError(error: unknown): never {
     return this.prismaErrorHandler.handle(error);
   }

    async Create(req : CreateBanner) {
        try {
            const createData = await prisma.banner.create({
                data: {
                    urlImage: req.urlImage,
                    description: req.description,
                    title : req.title
                }
            })
            return createData
        } catch (error) {
           this.handlePrismaError(error)
        }
    }

    async GetAllBanner() {
       try {
           return await prisma.banner.findMany()
       } catch (error) {
           this.handlePrismaError(error)
       }
    } 
    
    async Update(id : number,req : UpdateBanner) {
        try {
            return await prisma.banner.update({
                where: {
                    id 
                },
                data: {
                    ...req
                }
            })
        } catch (error) {
            this.handlePrismaError(error)
        }
    }


    async Delete(req : DeleteBanner) {
        try {
            return await prisma.banner.delete({
                where: {
                    id : req.id
                }
            })
        } catch (error) {
            this.handlePrismaError(error)
        }
    }
}
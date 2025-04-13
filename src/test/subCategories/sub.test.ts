import { SubCategoryRepositories } from "@/services/categories/repository/subCategory";
import { PrismaClient } from "@prisma/client";
import { CreateSubCategories, FilterSubcategory } from "@/common/interfaces/categories";
import { describe, expect, it, beforeAll, afterAll, jest } from "@jest/globals";

jest.mock("@prisma/client", () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        subCategory: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn()
        },
        $disconnect: jest.fn()
    }))
}));

describe("SubCategory Repository", () => {
    let subCategoryRepo: SubCategoryRepositories;
    let prisma: PrismaClient;

    beforeAll(() => {
        prisma = new PrismaClient();
        subCategoryRepo = new SubCategoryRepositories(prisma);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("Create SubCategory", () => {
        it("should create a new subcategory", async () => {
            const subCategoryData: CreateSubCategories = {
                name: "Test SubCategory",
                code: "TEST001",
                categoryId: 1,
                active: true,
            };

            const mockResult = { 
                id: 2, 
                ...subCategoryData,
                createdAt: new Date(), 
                updatedAt: new Date() 
            };

            (prisma.subCategory.create as any).mockResolvedValue(mockResult);

            const result = await subCategoryRepo.Create(subCategoryData);
            expect(result).toEqual(mockResult);
        });
    });

    describe("Find SubCategory", () => {
        it("should return paginated subcategories", async () => {
            const filter: FilterSubcategory = {
                page: 1,
                limit: 10,
                active: true
            };

            const mockData = [{ id: 1, name: "Test" }];
            const mockCount = 1;

            (prisma.subCategory.findMany as any).mockResolvedValue(mockData);
            (prisma.subCategory.count as any).mockResolvedValue(mockCount);

            const result = await subCategoryRepo.FindSubCategory(filter);
            expect(result.data).toEqual(mockData);
            expect(result.meta.total).toBe(mockCount);
        });
    });

    describe("Update SubCategory", () => {
        it("should update subcategory", async () => {
            const updateData = {
                name: "Updated SubCategory",
                active: false
            };

            const mockResult = { id: 1, ...updateData };
            (prisma.subCategory.update as any).mockResolvedValue(mockResult);

            const result = await subCategoryRepo.Update(updateData, 1);
            expect(result).toEqual(mockResult);
        });
    });

    describe("Delete SubCategory", () => {
        it("should delete subcategory", async () => {
            const mockResult = { id: 1 };
            (prisma.subCategory.delete as any).mockResolvedValue(mockResult);

            const result = await subCategoryRepo.Delete({ id: 1 });
            expect(result).toEqual(mockResult);
        });
    });
});

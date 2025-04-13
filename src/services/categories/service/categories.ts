import { CreateCategory, CreateSubCategories, DeleteCategory, DeleteSubcategory, FilterCategory, FilterSubcategory, UpdateCategory, UpdateSubCategory } from "@/common/interfaces/categories";
import { CategoriesRepository } from "../repository/categories";
import { SubCategoryRepositories } from "../repository/subCategory";

export class CategoriesService {
    constructor(private categoriesRepo  : CategoriesRepository){}

    async Create(create : CreateCategory){
        return this.categoriesRepo.Create(create)
    }

    async Update(update : UpdateCategory,id : number){
        return this.categoriesRepo.UpdateCategory(update,id)
    }

    async Remove (req: DeleteCategory){
        return this.categoriesRepo.DeleteCategories(req)
    }

    async FilterCategory(req : FilterCategory){
        return this.categoriesRepo.FilterCategory(req)
    }

    async FindCategories(kode : string){
        return this.categoriesRepo.FindCategoryByCode(kode)
    }
}

export class SubCategoryService {
    constructor(private subcategoriesRepo  : SubCategoryRepositories){}

    async Create(create : CreateSubCategories){
        return this.subcategoriesRepo.Create(create)
    }

    async Update(update : UpdateSubCategory,id : number){
        return this.subcategoriesRepo.Update(update,id)
    }

    async Delete (req: DeleteSubcategory){
        return this.subcategoriesRepo.Delete(req)
    }

    async FilterCategory(req : FilterSubcategory){
        return this.subcategoriesRepo.FindSubCategory(req)
    }
}
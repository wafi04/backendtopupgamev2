import { CreateProduct, FilterProduct, FilterProductByCategory, UpdateProduct } from "@/common/interfaces/product";
import { ProductRepository } from "./repository";

export class ProductService {
    private repository;
    constructor(repository = new ProductRepository()) {
        this.repository = repository;
    }
   
    async update(req: UpdateProduct, id: number) {
        return await this.repository.updateLayanan(req, id);
    }
    async delete(id: number) {
        return await this.repository.DeleteLayanan(id);
    }
    async findById(id: number) {
        return await this.repository.FindById(id);
    }
    async findProductByCategory(filter : FilterProductByCategory) {
        return this.repository.findProductByCategoryCode(filter)
    }
    async findAll(req: FilterProduct) {
        return await this.repository.FindAll(req);
    }
}
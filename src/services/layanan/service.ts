import { CreateProduct, UpdateProduct } from "@/common/interfaces/product";
import { ProductRepository } from "./repository";

export class ProductService {
    private repository;
    constructor(repository = new ProductRepository()) {
        this.repository = repository;
    }
    async create(req: CreateProduct) {
        return await this.repository.Create(req);
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
    async findAll(req: any) {
        return await this.repository.FindAll(req);
    }
}
import { CreateProduct, UpdateProduct } from "@/common/interfaces/product";
import { LayananRepository } from "./repository";

export class LayananService {
    private repository;
    constructor(repository = new LayananRepository()) {
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
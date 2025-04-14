import { CreateMethod, DeleteMethods, FilterMethod, UpdateMethods } from "@/common/interfaces/methods";
import { MethodsRepository } from "./repository";

export class MethodsService  {
    constructor(private  MethodRepository  :MethodsRepository){}

    async Create(req : CreateMethod){
        return this.MethodRepository.Create(req)
    }

    async Update(req : UpdateMethods,id : number){
        return this.MethodRepository.update(req,id)
    }

    async FindAll(req : FilterMethod){
        return this.MethodRepository.FindAll(req)
    }
    
    async FindCode(code : string){
        return this.MethodRepository.GetMethod(code)
    }

    async Delete(req : DeleteMethods){
        return this.MethodRepository.Delete(req)
    }
}
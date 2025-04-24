import { CreateBanner, UpdateBanner } from "@/common/interfaces/banner";
import { BannerRepository } from "./repository";

export class BannerService {
    constructor( 
        private bannerRepo =  new BannerRepository()
    ) {
        
    }

    async create(req : CreateBanner) {
        return this.bannerRepo.Create(req)
    }

    async Update(req : UpdateBanner,id : number) {
        return this.bannerRepo.Update(id,req)
    }

    async Delete(id : number) {
        return this.bannerRepo.Delete({
            id
        })
    }

    async GetAll() {
        return this.bannerRepo.GetAllBanner()
    }
}
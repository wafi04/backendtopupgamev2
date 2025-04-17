import { CategoriesData, SubCategoryData } from "./categories"
export type  ACTIVATE =  "ACTIVE"  | "NONACTIVE"
export type CreateLayanan = {
    layanan : string
    kategoriId  :  number
    detailsId   : string
    subCategoryId  : number
    harga : number
    hargaReseller : number
    hargaPlatinum : number
    hargaGold : number
    hargaFlashSale : number
    profit : number
    profitReseller : number
    profitPlatinum : number
    profitGold : number
    isProfitPercentage  : boolean  | undefined
    isResellerProfitPercentage  : boolean | undefined
    isPlatinumProfitPercentage : boolean | undefined
    isGoldProfitPercentage: boolean | undefined
    isFlashSale : boolean
    judulFlashSale? :  string
    bannerFlashSale? : string
    expiredFlashSale? : string
    catatan : string
    status : boolean
    provider : string
    providerId : string
    productLogo : string
}
export interface LayananData extends CreateLayanan{
    createdAt  : string
    updatedAt : string
    category : CategoriesData
    subCategory  : SubCategoryData
}
export type  UpdateLayanan = Partial<CreateLayanan>
export type  FilterLayanan =  {
    search? : string
    flashSale? : ACTIVATE
    page? : number
    perPage? : number
    status? :  ACTIVATE
    kategoryId? : number
    expensivetocheap? : boolean
    cheaptoexpensive? : boolean
}
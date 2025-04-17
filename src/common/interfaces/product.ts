import { CategoriesData, SubCategoryData } from "./categories"

export type ACTIVATE = "ACTIVE" | "NONACTIVE"

export type CreateProduct = {
    name: string
    categoryId: number
    subCategoryId?: number | null
    providerId: string
    provider: string
    price:  number | string
    regularPrice?:  number | string | null
    resellerPrice?:  number | string | null
    memberPrice?:  number | string | null
    isFlashSale?: boolean
    flashSalePrice?:  number | string | null
    flashSaleUntil?: Date | string | null
    note?: string | null
    status?: boolean
    productImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profit:  number | string
    profitReseller:  number | string
    profitPlatinum:  number | string
    profitGold:  number | string
    isProfitPercentage?: boolean
    isResellerProfitPercentage?: boolean
    isPlatinumProfitPercentage?: boolean
    isGoldProfitPercentage?: boolean
    titleFlashSale?: string | null
    bannerFlashSale?: string | null
    productLogo?: string | null
}

export interface ProductData extends CreateProduct {
    id: number
    createdAt: string
    updatedAt: string
    category: CategoriesData
    subCategory?: SubCategoryData | null
}

export type UpdateProduct = Partial<CreateProduct>

export type FilterProduct = {
    search?: string
    isFlashSale?: ACTIVATE
    page?: number
    perPage?: number
    status?: ACTIVATE
    categoryId?: number  // Changed from kategoryId to match schema
    sortPriceDesc?: boolean  // Changed from expensivetocheap to be more clear
    sortPriceAsc?: boolean   // Changed from cheaptoexpensive to be more clear
}

import { CategoriesData, SubCategoryData } from "./categories"
import { ADMIN_ROLE, MEMBER_ROLE, PLATINUM_ROLE, RESELLER_ROLE } from "./user"

export type ACTIVATE = "ACTIVE" | "NONACTIVE"

export type CreateProduct = {
    name: string
    categoryId: number
    subCategoryId?: number | null
    providerId: string
    provider: string
    price:  number 
    regularPrice?:  number  | null
    resellerPrice?:  number  | null
    memberPrice?:  number  | null
    isFlashSale?: boolean
    flashSalePrice?:  number  | null
    flashSaleUntil?: Date  | null
    note?: string | null
    status?: boolean
    productImage?: string | null
    createdAt?: string | Date
    updatedAt?: Date  | string
    profit:  number 
    profitReseller:  number 
    profitPlatinum:  number 
    profitGold:  number 
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
    isFlashSale?: boolean
    page?: number
    perPage?: number
    status?: boolean
    categoryId?: number  // Changed from kategoryId to match schema
    sortPriceDesc?: boolean  // Changed from expensivetocheap to be more clear
    sortPriceAsc?: boolean   // Changed from cheaptoexpensive to be more clear
}

export type minMax = "min" | "max"

export interface FilterProductByCategory {
  code: string;
  price?: string
  subcategory?: string;
  role?:  string
}

import { CategoriesData, SubCategoryData } from "./categories"

export type ACTIVATE = "ACTIVE" | "NONACTIVE"

export type CreateProduct = {
    name: string
    categoryId: number  // Changed from kategoriId to match schema
    subCategoryId?: number | null  // Made optional to match schema
    providerId: string
    provider: string
    price: number  // Changed from harga to match schema
    regularPrice?: number | null  // Added to match schema
    resellerPrice?: number | null  // Changed from hargaReseller to match schema
    memberPrice?: number | null  // Changed from hargaPlatinum/hargaGold to match schema
    isFlashSale: boolean
    flashSalePrice?: number | null  // Changed from hargaFlashSale to match schema
    flashSaleUntil?: string | null  // Changed from expiredFlashSale to match schema
    note?: string | null  // Changed from catatan to match schema
    status: boolean
    productImage?: string | null  // Added to match schema
    productLogo?: string | null  // Added to match schema
    titleFlashSale?: string | null  // Changed from judulFlashSale to match schema
    bannerFlashSale?: string | null
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

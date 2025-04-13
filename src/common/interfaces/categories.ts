export interface CreateCategory {
    nama : string
    subNama : string
    brand : string
    kode : string
    serverId : number
    status : string
    thumbnail : string
    tipe : string
    petunjuk : string
    ketLayanan : string
    ketId : string
    placeholder1 : string
    placeholder2 : string
    bannerLayanan : string
}
export interface CategoriesData extends CreateCategory{
    createdAt  : string
    updatedAt  : string
}
export type UpdateCategory = Partial<CreateCategory>  
export type DeleteCategory =  {
    id : number
}
export type FilterCategory  = {
    search? : string
    type? : string
    page? : number
    limit? : number
    active? : string
    status? : string
}

// model SubCategory {
//     id           Int       @id @default(autoincrement()) @map("id")
//     categoryId   Int       @map("category_id")
//     code         String    @map("code")
//     name         String    @map("name")
//     active       Boolean   @map("active")
//     createdAt    DateTime? @default(now()) @map("created_at")
//     updatedAt    DateTime? @updatedAt @map("updated_at")
    
//     category     Categories @relation(fields: [categoryId], references: [id])
  
//     @@index([code, categoryId, active])
//     @@index([categoryId])
//     @@map("sub_categories")
//   }

export interface SubCategoryData  {
    id : number
    categoryId : number
    code : string
    name : string
    active : boolean
    createdAt :  string
    updatedAt : string
}
export interface CreateSubCategories {
    categoryId : number
    code : string
    name : string
    active : boolean
}
export type  UpdateSubCategory = Partial<CreateSubCategories>
export type  DeleteSubcategory = {
    id : number
}
export type FilterSubcategory = {
    categoryId? : number
    active? :  boolean
    search? : string
    page? : number
    limit? :  number
}
export interface CreateMethod {
    name : string
    images : string
    code : string
    keterangan : string
    tipe : string
    min : number
    isActive : boolean
    typeTax : string | null
    taxAdmin : number | null
    minExpired : number | null
    maxExpired : number | null
    max : number | null
}
export interface MethodsData extends CreateMethod {
    id :  number
    createdAt : string | null
    updatedAt : string | null
}

export type UpdateMethods = Partial<CreateMethod>
export type DeleteMethods = {
    id : number
}
export type FilterMethod = {
    isAll : string
    code? : string
    isActive? : boolean
    page? : number
    limit? : number
    type? : string
}


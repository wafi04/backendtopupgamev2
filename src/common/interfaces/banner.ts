export type CreateBanner = {
    urlImage: string
    description?: string
    title? : string
}


export type BannerData = CreateBanner & {
    id: number
    createdAt : string
}


export type UpdateBanner = Partial<CreateBanner>
export type DeleteBanner = {
    id : number
}
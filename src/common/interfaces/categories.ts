export interface CreateCategory {
  name: string;
  subName: string;
  brand: string;
  code: string;
  serverId: number;
  status: string;
  thumbnail: string;
  tipe: string;
  petunjuk: string;
  ketLayanan: string;
  ketId: string;
  placeholder1: string;
  placeholder2: string;
  logo: string;
}
export interface CategoriesData extends CreateCategory {
  id: number;
  createdAt: string;
  updatedAt: string;
}
export type UpdateCategory = Partial<CreateCategory>;
export type DeleteCategory = {
  id: number;
};
export type FilterCategory = {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
  active?: string;
  status?: string;
};

export interface SubCategoryData {
  id: number;
  categoryId: number;
  code: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubCategories {
  categoryId: number;
  code: string;
  name: string;
  active: boolean;
}

export type UpdateSubCategory = Partial<CreateSubCategories>;

export type DeleteSubcategory = {
  id: number;
};

export type FilterSubcategory = {
  categoryId?: number;
  active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

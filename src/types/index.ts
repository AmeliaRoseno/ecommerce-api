export type UserType = {
  name: string;
  email: string;
  password: string;
};

export type CategoryType = {
  name: string;
};

export type ProductType = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
};
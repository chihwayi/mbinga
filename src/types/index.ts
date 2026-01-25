export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  story: string;
  category: string;
  price: number;
  stock: number;
  notes: string[];
  ingredients: string[];
  image: string;
  accentColor: string;
  createdAt?: Date;
  updatedAt?: Date;
}

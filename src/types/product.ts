export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    active: boolean;
    path_image: string;
    ean: string
    created_at:string
}


export interface ProductCardProps {
    product: Product;
}

export interface ProductGridProps {
    products: Product[];
}
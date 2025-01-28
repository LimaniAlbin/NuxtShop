import { api } from '~/utils/apiHandler';

export interface Product {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
}

// Define the service methods individually
export const getAllProducts = (page: number, pageSize: number = 8) => {
    return api.get<Product[]>(`/api/products?page=${page}&limit=${pageSize}`);
}

export const getProductById = (id: string) => api.getById<Product>('/api/products', id);

export const createProduct = (payload: FormData) => {
    return api.post<Product>('/api/admin/products', payload);
};

export const updateProduct = ({ id, data }: { id: string, data: FormData }) => {
    if (!data) {
        return {
            success: false,
            message: 'No updates provided.',
        };
    }
    return api.put<Product>(`/api/admin/products/${id}`, data);
};

export const deleteProduct = (id: string) => api.delete<void>(`/api/admin/products/${id}`);


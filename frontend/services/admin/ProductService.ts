import { api } from '~/utils/apiHandler';

export interface Product {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
}

// Define the service methods individually
export const getAllProducts = (page: number, pageSize: number) => {
    return api.get<Product[]>(`/api/products?page=${page}&limit=${pageSize}`);
}

export const getProductById = (id: number) => api.getById<Product>('/api/products', id);

export const createProduct = (payload: FormData) => {
    return api.post<Product>('/api/admin/products', payload);
};

export const updateProduct = (id: number, payload: Partial<Product>) => {
    if (!payload) {
        return {
            success: false,
            message: 'No updates provided.',
        };
    }
    return api.put<Product>(`/api/admin/products/${id}`, payload);
};

export const deleteProduct = (id: number) => api.delete<void>(`/api/admin/products/${id}`);

export const uploadProductImage = (id: number, file: File) => api.upload<void>(`/api/products/${id}/upload-image`, file);

import { api } from '~/utils/apiHandler';

export interface Product {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
}

// Define the service methods individually
export const getAllBrands = (page: number, pageSize: number = 8) => {
    return api.get<Product[]>(`/api/brands?page=${page}&limit=${pageSize}`);
}

export const getBrandById = (id: string) => api.getById<Product>('/api/brands', id);

export const createBrand = (payload: FormData) => {
    return api.post<Product>('/api/admin/brands', payload);
};

export const updateBrand = ({ id, data }: { id: string, data: FormData }) => {
    if (!data) {
        return {
            success: false,
            message: 'No updates provided.',
        };
    }
    return api.put<Product>(`/api/admin/brands/${id}`, data);
};

export const deleteBrand = (id: string) => api.delete<void>(`/api/admin/brands/${id}`);


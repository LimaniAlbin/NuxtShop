import { api } from '~/utils/apiHandler';

export interface Brand {
    name: string;
    description: string;
    logo: string;
}

// Define the service methods individually
export const getAllBrands = () => {
    return api.get<Brand[]>(`/api/brands`);
}

export const getBrandById = (id: string) => api.getById<Brand>('/api/brands', id);

export const createBrand = (payload: FormData) => {
    return api.post<Brand>('/api/admin/brands', payload);
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


import { api } from '~/utils/apiHandler';

export interface Category {
    name: string;
    description: string;
}

// Define the service methods individually
export const getAllCategories = () => {
    return api.get<Category[]>(`/api/categories`);
}

export const getCategoryById = (id: string) => api.getById<Category>('/api/categories', id);

export const createCategory = (payload: JSON) => {
    return api.post<Category>('/api/admin/categories', payload);
};

export const updateCategory = ({ id, data }: { id: string, data: JSON }) => {
    if (!data) {
        return {
            success: false,
            message: 'No updates provided.',
        };
    }
    return api.put<Category>(`/api/admin/categories/${id}`, data);
};

export const deleteCategory = (id: string) => api.delete<void>(`/api/admin/categories/${id}`);


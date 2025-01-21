// ~/utils/apiHandler.ts

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
}

export const api = {
    async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        try {
            const response = await $fetch<T>(getFullUrl(url), {
                method: 'GET',
                params,
            });
            return { success: true, data: response };
        } catch (error: any) {
            return handleError<T>(error);
        }
    },

    async getById<T>(url: string, id: string | number): Promise<ApiResponse<T>> {
        try {
            const response = await $fetch<T>(`${getFullUrl(url)}/${id}`, {
                method: 'GET',
            });
            return { success: true, data: response };
        } catch (error: any) {
            return handleError<T>(error);
        }
    },

    async post<T>(url: string, body: Record<string, any>): Promise<ApiResponse<T>> {
        try {
            const response = await $fetch<T>(getFullUrl(url), {
                method: 'POST',
                body,
            });
            return { success: true, data: response };
        } catch (error: any) {
            return handleError<T>(error);
        }
    },

    async put<T>(url: string, body: Record<string, any>): Promise<ApiResponse<T>> {
        try {
            const response = await $fetch<T>(getFullUrl(url), {
                method: 'PUT',
                body,
            });
            return { success: true, data: response };
        } catch (error: any) {
            return handleError<T>(error);
        }
    },

    async delete<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        try {
            const response = await $fetch<T>(getFullUrl(url), {
                method: 'DELETE',
                params,
            });
            return { success: true, data: response };
        } catch (error: any) {
            return handleError<T>(error);
        }
    },

    async upload<T>(
        url: string,
        file: File,
        additionalData?: Record<string, any>
    ): Promise<ApiResponse<T>> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            if (additionalData) {
                Object.keys(additionalData).forEach((key) => {
                    formData.append(key, additionalData[key]);
                });
            }

            const response = await $fetch<T>(getFullUrl(url), {
                method: 'POST',
                body: formData,
            });
            return { success: true, data: response };
        } catch (error: any) {
            return handleError<T>(error);
        }
    },
};

function getFullUrl(endpoint: string): string {
    const config = useRuntimeConfig();
    return `${config.public.backendUrl}${endpoint}`;
}

function handleError<T>(error: any): ApiResponse<T> {
    return {
        success: false,
        message: error?.data?.message || error.message || 'An unknown error occurred.',
    };
}

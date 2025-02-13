import {useErrorStore, useMessagesStore} from "~/store/messagesStore";

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
}

export const api = {
    async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        return await request<T>('GET', url, params);
    },

    async getById<T>(url: string, id: string | number): Promise<ApiResponse<T>> {
        return await request<T>('GET', `${url}/${id}`);
    },

    async post<T>(url: string, body: Record<string, any>): Promise<ApiResponse<T>> {
        return await request<T>('POST', url, body);
    },

    async put<T>(url: string, body: Record<string, any>): Promise<ApiResponse<T>> {
        return await request<T>('PUT', url, body);
    },

    async delete<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        return await request<T>('DELETE', url, params);
    }
};

async function request<T>(method: string, url: string, bodyOrParams?: Record<string, any>): Promise<ApiResponse<T>> {
    const messagesStore = useMessagesStore(); // Use Pinia store

    try {
        const response = await $fetch<T>(getFullUrl(url), {
            method,
            ...(method === 'GET' || method === 'DELETE' ? { params: bodyOrParams } : { body: bodyOrParams }),
        });

        // Extract message from API response if available
        const message = (response as any)?.message || "Operation successful";

        // Show success messages only for Create (POST), Update (PUT), and Delete (DELETE)
        if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
            messagesStore.setMessage(message, 200, "success");
        }

        return { success: true, data: response, message };
    } catch (error: any) {
        return handleError<T>(error);
    }
}


function getFullUrl(endpoint: string): string {
    const config = useRuntimeConfig();
    return `${config.public.backendUrl}${endpoint}`;
}

function handleError<T>(error: any): ApiResponse<T> {
    const messagesStore = useMessagesStore(); // Use Pinia store

    const message = error?.data?.message || error.message || 'An unknown error occurred.';
    const status = error?.status || 500;

    messagesStore.setMessage(message, status, "error"); // Store error message

    return {
        success: false,
        message,
    };
}

import { defineStore } from 'pinia';
import { ref } from 'vue';

interface MessageState {
    message: string | null;
    statusCode: number | null;
    type: 'success' | 'error' | 'info' | null;
}

export const useMessagesStore = defineStore('messagesStore', () => {
    const messageState = ref<MessageState | null>(null);

    const setMessage = (message: string, statusCode: number, type: 'success' | 'error' | 'info') => {
        messageState.value = { message, statusCode, type };
    };

    const clearMessage = () => {
        messageState.value = null;
    };

    return {
        messageState,
        setMessage,
        clearMessage
    };
});

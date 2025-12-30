import { toast } from 'sonner';

export const showErrorToast = (message: string) => {
	if (!message || message.trim() === '') return;
	toast.error(message);
};

export const showSuccessToast = (message: string) => {
	if (!message || message.trim() === '') return;
	toast.success(message);
};

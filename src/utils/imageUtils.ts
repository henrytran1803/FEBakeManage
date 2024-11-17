// utils/imageUtils.ts

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getImageUrl = (url?: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    return `${BASE_URL}/${cleanUrl}`;
};
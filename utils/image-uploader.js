import { IMGBB_CONFIG } from '../config/imgbb-config.js';

export async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`${IMGBB_CONFIG.apiUrl}?key=${IMGBB_CONFIG.apiKey}`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            return data.data.url; // ছবির ডাইরেক্ট লিঙ্ক ফেরত দেবে
        } else {
            throw new Error('Image upload failed');
        }
    } catch (error) {
        console.error('ImgBB Error:', error);
        throw error;
    }
}
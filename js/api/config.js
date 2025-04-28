export const API_BASE_URL = 'http://localhost:8080';

// API 요청 시 공통으로 사용할 헤더
export const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

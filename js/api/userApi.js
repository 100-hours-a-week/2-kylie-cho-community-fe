import { API_BASE_URL, getHeaders } from './config.js';

// 회원가입
export async function register(userData) {

    const formData = new FormData();
    formData.append("email", userData.email);
    formData.append("nickname", userData.nickname);
    formData.append("password", userData.password);
    
    if (userData.profileImage) {
        formData.append("profileImage", userData.profileImage);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/register`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("❌ 회원가입 실패:", errorResponse);
            throw new Error(errorResponse.message || '회원가입에 실패했습니다.');
        }

        return await response.json();
    } catch (error) {
        console.error("⚠️ API 요청 오류:", error);
        throw error;
    }
}

// 프로필 이미지 업로드
export async function uploadProfileImage(formData) {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error('로그인이 필요합니다.');
        }

        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile-image`, {
            method: 'POST',
            headers: {
                'Authorization': getHeaders().Authorization
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('프로필 이미지 업로드에 실패했습니다.');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
} 

// 로그인
export async function login(credentials) {
    try {
        const loginData = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        const response = await fetch(`${API_BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error:", errorText);
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.id);
        return data;
    } catch (error) {
        throw error;
    }
}

// 회원정보 조회
export async function getUserInfo() {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error('로그인이 필요합니다.');
        }

        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            method: 'GET',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error(`회원정보 조회 실패: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ 회원정보 조회 오류:", error);
        throw error;
    }
}

// 회원정보 수정
export async function updateUserInfo(formData) {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error('로그인이 필요합니다.');
        }

        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            throw new Error('회원정보 수정에 실패했습니다.');
        }

        const userInfo = await response.json();

        // 프로필 이미지 URL이 상대 경로라면 서버 주소를 추가
        if (userInfo.profileImage && !userInfo.profileImage.startsWith('http')) {
            userInfo.profileImage = `${API_BASE_URL}/${userInfo.profileImage}`;
        }

        return userInfo;
    } catch (error) {
        throw error;
    }
}

// 비밀번호 변경
export async function updatePassword(oldPassword, newPassword) {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error('로그인이 필요합니다.');
        }

        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oldPassword, newPassword })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '비밀번호 변경에 실패했습니다.');
        }

        return await response.text();

    } catch (error) {
        console.error("⚠ 비밀번호 변경 오류:", error);
        throw error;
    }
}

// 회원 탈퇴
export async function deleteAccount() {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error('로그인이 필요합니다.');
        }

        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error('회원 탈퇴에 실패했습니다.');
        }

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    } catch (error) {
        throw error;
    }
}
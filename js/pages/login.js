import { showPage } from '../main.js';
import { register as registerApi, login as loginApi } from '../api/userApi.js';
import { API_BASE_URL } from '../api/config.js';

// 사용자 로그인 처리
export async function login(event) {
    if (event) {
        event.preventDefault();
    }

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('이메일과 비밀번호를 모두 입력해주세요.');
        return;
    }

    try {
        const response = await loginApi({ email, password });
        const profileIcon = document.querySelector('.profile-icon');
        
        if (profileIcon) {
            // 프로필 아이콘 표시
            profileIcon.style.display = 'block';
            
            // 프로필 이미지 URL 처리
            let profileImageUrl = response.profileImage;
            
            // 상대 경로인 경우 API_BASE_URL 추가
            if (profileImageUrl && !profileImageUrl.startsWith('http')) {
                profileImageUrl = `${API_BASE_URL}/${profileImageUrl}`;
            }

            // 프로필 이미지 설정 (기본 이미지 또는 사용자 업로드 이미지)
            if (profileImageUrl) {
                profileIcon.style.backgroundImage = `url(${profileImageUrl})`;
                profileIcon.style.backgroundSize = 'cover';
                profileIcon.style.backgroundPosition = 'center';
            }
        } else {
            console.error("❌ 프로필 아이콘 요소를 찾을 수 없습니다.");
        }
        
        showPage('post-list-page');
    } catch (error) {
        console.error("❌ 로그인 에러:", error);
        alert(error.message);
    }
}

// 회원가입 처리
export async function handleRegister(event) {
    if (event) {
        event.preventDefault();
    }

    const email = document.querySelector('#register-page input[type="email"]').value;
    const password = document.querySelector('#register-page input[type="password"]').value;
    const passwordConfirm = document.querySelectorAll('#register-page input[type="password"]')[1].value;
    const nickname = document.querySelector('#register-page input[type="text"]').value;
    const profileImageInput = document.getElementById('profileImage');

    if (!email || !password || !passwordConfirm || !nickname) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
    }

    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    try {
        const userData = {
            email,
            password,
            nickname,
            profileImage: profileImageInput.files.length > 0 ? profileImageInput.files[0] : null
        };
        
        // 먼저 기본 사용자 정보로 회원가입
        const response = await registerApi(userData);
        
        alert('회원가입이 완료되었습니다.');
        showPage('login-page');
    } catch (error) {
        alert(error.message);
    }
}

// 로그아웃 처리
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    document.querySelector('.profile-icon').style.display = 'none';
    showPage('login-page');
    alert('로그아웃 되었습니다.');
} 
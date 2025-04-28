import { getUserInfo, updateUserInfo, updatePassword, deleteAccount as deleteAccountApi } from '../api/userApi.js';
import { showPage } from '../main.js';
import { API_BASE_URL } from '../api/config.js';

// 이미지 미리보기 함수
export function previewProfileImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    const profileUploadDiv = document.querySelector('.profile-upload');

    if (!profileUploadDiv) {
        console.error("❌ 프로필 업로드 요소를 찾을 수 없습니다.");
        return;
    }

    reader.onload = function () {
        const uploadedImageUrl = reader.result;

        profileUploadDiv.style.backgroundImage = `url(${uploadedImageUrl})`;
    };

    reader.readAsDataURL(file);
}

// 프로필 정보 로드
export async function loadUserInfo() {
    try {
        const userInfo = await getUserInfo();
        
        // 프로필 정보 표시
        document.getElementById('profile-email-value').textContent = userInfo.email;
        document.getElementById('profile-nickname-value').textContent = userInfo.nickname;

        // 프로필 이미지 표시
        const profileImage = document.querySelector('.profile-edit-image');
        if (profileImage && userInfo.profileImage) {
            const imageUrl = userInfo.profileImage.startsWith('http')
            ? userInfo.profileImage  
            : `${API_BASE_URL}/${userInfo.profileImage}`; 

            profileImage.style.backgroundImage = `url(${imageUrl})`;
        }

        // 헤더의 프로필 아이콘에도 이미지 설정
        const profileIcon = document.querySelector('.profile-icon');
        if (profileIcon && userInfo.profileImage) {
            const imageUrl = userInfo.profileImage.startsWith('http')
                ? userInfo.profileImage
                : `${API_BASE_URL}/${userInfo.profileImage}`;

            profileIcon.style.backgroundImage = `url(${imageUrl})`;
        }

        // 수정 모드 초기화
        const profilePage = document.getElementById('profile-page');
        profilePage.classList.remove('edit-mode');
    } catch (error) {
        alert('회원정보를 불러오는데 실패했습니다.');
        console.error(error);
    }
}

// 수정 모드 전환
export function toggleEditMode() {
    const profilePage = document.getElementById('profile-page');
    const nicknameValue = document.getElementById('profile-nickname-value');
    
    if (!profilePage.classList.contains('edit-mode')) {
        // 수정 모드로 전환
        profilePage.classList.add('edit-mode');
        
        // 닉네임을 입력 필드로 변경
        const currentNickname = nicknameValue.textContent;
        nicknameValue.innerHTML = `<input type="text" value="${currentNickname}" class="edit-input">`;
    }
}

// 프로필 이미지 미리보기
export function previewProfileEditImage(event) {
    const file = event.target.files[0];
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const profileImage = document.querySelector('.profile-edit-image');
        
        if (profileImage) {
            profileImage.style.backgroundImage = `url(${e.target.result})`;
        } else {
            console.error("❌ 프로필 이미지 요소를 찾을 수 없습니다.");
        }
    };
    reader.readAsDataURL(file);
}

// 프로필 업데이트
export async function updateProfile() {
    try {
        const profilePage = document.getElementById('profile-page');
        const nicknameInput = profilePage.querySelector('.edit-input');
        const profileImageInput = document.getElementById('profile-image-upload');
        
        const formData = new FormData();

        if (nicknameInput) {
            formData.append("nickname", nicknameInput.value);
        }
        
        if (profileImageInput.files.length > 0) {
            formData.append("profileImage", profileImageInput.files[0]);
        } else {
            console.warn("⚠ 프로필 이미지 변경 없음");
        }

        const updatedUser = await updateUserInfo(formData);

        // 프로필 화면 업데이트
        document.getElementById('profile-nickname-value').textContent = updatedUser.nickname;
        if (updatedUser.profileImage) {
            document.querySelector('.profile-icon').style.backgroundImage = `url(${updatedUser.profileImage})`;
        }
        
        // 수정 모드 해제
        profilePage.classList.remove('edit-mode');
        alert('프로필이 수정되었습니다.');
    } catch (error) {
        alert(error.message);
    }
}

// 비밀번호 변경
export async function updateUserPassword() {
    try {
        const currentPassword = document.querySelector('#password-page input[type="password"]').value;
        const newPassword = document.querySelectorAll('#password-page input[type="password"]')[1].value;
        const confirmPassword = document.querySelectorAll('#password-page input[type="password"]')[2]?.value;
        
        if (!currentPassword || !newPassword) {
            alert('현재 비밀번호와 새 비밀번호를 모두 입력해주세요.');
            return;
        }
        
        if (confirmPassword && newPassword !== confirmPassword) {
            alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
            return;
        }

        await updatePassword(currentPassword, newPassword);
        
        alert('비밀번호가 변경되었습니다.');
        showPage('post-list-page');
    } catch (error) {
        alert(error.message || '비밀번호 변경에 실패했습니다.');
    }
}

// 회원 탈퇴 모달 표시
export function showDeleteAccountModal() {
    const modal = document.getElementById('delete-account-modal');
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
}

// 회원 탈퇴 처리
export async function deleteAccount() {
    try {
        await deleteAccountApi();
        alert('회원 탈퇴가 완료되었습니다.');
        document.body.classList.remove('modal-open');
        document.getElementById('delete-account-modal').style.display = 'none';
        showPage('login-page');
    } catch (error) {
        alert(error.message);
    }
} 

// 게시글 삭제 모달 표시
export function showDeletePostModal() {
    const modal = document.getElementById('delete-post-modal');
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
}
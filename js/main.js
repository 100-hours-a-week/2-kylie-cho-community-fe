import { addPost, loadPosts, updateCurrentPost } from './components/post.js';
import { logout } from './pages/login.js';
import { loadUserInfo } from './components/profile.js';

let currentPage = 'login-page';

export function showPage(pageId) {
    document.getElementById(currentPage).style.display = 'none';
    document.getElementById(pageId).style.display = 'block';
    currentPage = pageId;
    updateBackButton();

    // 페이지별 초기화 로직
    if (pageId === 'post-list-page') {
        loadPosts();
    } else if (pageId === 'profile-page') {
        loadUserInfo();
    }
}

export function goBack() {
    if (currentPage === 'register-page') {
        showPage('login-page');
    } else if (currentPage === 'post-add-page' || currentPage === 'post-detail-page') {
        showPage('post-list-page');
    } else if (currentPage === 'post-edit-page') {
        showPage('post-detail-page');
    } else if (currentPage === 'profile-page' || currentPage === 'password-page') {
        showPage('post-list-page');
    }
}

function updateBackButton() {
    const backButton = document.querySelector('.back');
    if (['register-page', 'post-add-page', 'post-detail-page', 'post-edit-page', 'profile-page', 'password-page'].includes(currentPage)) {
        backButton.style.display = 'block';
    } else {
        backButton.style.display = 'none';
    }
}

// DOMContentLoaded 이벤트에서 모든 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    const postUpdateButton = document.querySelector('.post-update-button');
    const submitButton = document.querySelector('.post-submit-button');
    const profileIcon = document.querySelector('.profile-icon');
    const profileMenu = document.querySelector('.profile-menu');
    const backButton = document.querySelector('.back');

    // 뒤로가기 버튼 이벤트
    if (backButton) {
        backButton.addEventListener('click', goBack);
    }

    // 프로필 아이콘 클릭 이벤트
    if (profileIcon) {
        profileIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle('show');
        });
    }

    // 게시글 작성 완료 버튼 클릭 이벤트
    if (submitButton) {
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            addPost(e);
        });
    }

    // 게시글 수정 완료 버튼 클릭 이벤트
    if (postUpdateButton) {
        postUpdateButton.addEventListener('click', (e) => {
            e.preventDefault();
            updateCurrentPost(e);
        })
    }

    // 메뉴 아이템 클릭 이벤트
    document.getElementById('profile-edit').addEventListener('click', () => {
        profileMenu.classList.remove('show');
        showPage('profile-page');
    });

    document.getElementById('password-edit').addEventListener('click', () => {
        profileMenu.classList.remove('show');
        showPage('password-page');
    });

    document.getElementById('logout').addEventListener('click', () => {
        logout();
        profileMenu.classList.remove('show');
    });

    // 메뉴 외부 클릭 시 메뉴 닫기
    document.addEventListener('click', (e) => {
        if (profileMenu.classList.contains('show') && 
            !profileIcon.contains(e.target) && 
            !profileMenu.contains(e.target)) {
            profileMenu.classList.remove('show');
        }
    });
});
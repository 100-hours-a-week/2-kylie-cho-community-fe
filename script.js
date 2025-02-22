// script.js

let currentPage = 'login-page';

function showPage(pageId) {
    document.getElementById(currentPage).style.display = 'none';
    document.getElementById(pageId).style.display = 'block';
    currentPage = pageId;
    updateBackButton();
}

function goBack() {
    if (currentPage === 'register-page') {
        showPage('login-page');
    } else if (currentPage === 'post-add-page' || currentPage === 'post-detail-page') {
        showPage('post-list-page');
    } else if (currentPage === 'post-edit-page') {
        showPage('post-detail-page');
    } else if (currentPage === 'password-page') {
        showPage('profile-page');
    }
}

function updateBackButton() {
    const backButton = document.querySelector('.back');
    if (['register-page', 'post-add-page', 'post-detail-page', 'post-edit-page', 'password-page'].includes(currentPage)) {
        backButton.style.display = 'block';
    } else {
        backButton.style.display = 'none';
    }
}

function login() {
    alert('로그인 성공!');
    document.querySelector('.profile-icon').style.display = 'block';
    showPage('post-list-page');
}

function logout() {
    alert('로그아웃 되었습니다.');
    document.querySelector('.profile-icon').style.display = 'none';
    showPage('login-page');
}

function register() {
    alert('회원가입 완료!');
    showPage('login-page');
}

let currentPost = {};

function addPost() {
    let postTitle = document.querySelector('#post-add-page input').value;
    let postContent = document.querySelector('#post-add-page textarea').value;
    let postImage = document.querySelector('#post-add-page input[type="file"]').files[0];
    let postContainer = document.getElementById('posts');
    
    let post = document.createElement('div');
    post.classList.add('post');
    
    post.innerHTML = `
        <div class="post-brief-view">
            <h3 onclick="viewPost('${postTitle}', '${postContent}', '${postImage ? postImage.name : ''}')">${postTitle}</h3>
            <div class="post-brief-view-middle">
                <p>좋아요 0 댓글 0 조회수 0</p>
                <p>2025-02-22 00:00:00</p>
            </div>
            <p>더미 작성자 1</p>
        </div>
    `;
    postContainer.appendChild(post);
    
    showPage('post-list-page');
}

function viewPost(title, content, image) {
    currentPost = {title, content, image};

    document.getElementById('post-title').innerText = title;
    document.getElementById('post-author').innerText = '더미 작성자 1';
    document.getElementById('post-date').innerText = new Date().toLocaleDateString();
    
    if (content.image) {
        document.getElementById('post-image').innerHTML = `<img src="${content.image}" alt="이미지">`;
    }
    document.getElementById('post-content').innerText = content;
    
    showPage('post-detail-page');
}

function showDeleteModal() {
    document.getElementById('delete-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('delete-modal').style.display = 'none';
}

function deletePost() {
    alert('게시글이 삭제되었습니다.');
    closeModal();
}

function updatePost() {
    let newTitle = document.getElementById('edit-title').value;
    let newContent = document.getElementById('edit-content').value;
    
    document.getElementById('post-title').innerText = newTitle;
    document.getElementById('post-content').innerText = newContent;
    showPage('post-detail-page');
}

function updateProfile() {
    alert('회원정보가 수정되었습니다.');
}

function updatePassword() {
    alert('비밀번호가 변경되었습니다.');
}

function toggleProfileMenu() {
    const menu = document.getElementById('profile-menu');
    
    if (menu.style.display === 'block' || menu.style.display === '') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.profile-icon').addEventListener('click', toggleProfileMenu);
    document.getElementById('logout').addEventListener('click', logout);
    document.getElementById('profile-edit').addEventListener('click', function() { showPage('profile-page'); });
    document.getElementById('password-edit').addEventListener('click', function() { showPage('password-page'); });
});

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

let userProfileImage = '';

// 프로필 이미지 미리보기 함수
function previewProfileImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        // 이미지 미리보기
        userProfileImage = reader.result;
        // 프로필 아이콘에 미리보기 이미지 설정
        document.querySelector('.profile-icon').style.backgroundImage = `url(${userProfileImage})`;
    }
    reader.readAsDataURL(event.target.files[0]);
}

function register() {
    // 사용자가 선택한 프로필 이미지 처리
    const profileImageInput = document.getElementById('profile-image-upload');
    
    // 프로필 이미지가 선택되지 않았다면 기본 이미지 사용
    if (!userProfileImage && !profileImageInput.files.length) {
        userProfileImage = './image/merong_minion.jpeg'; // 프로젝트 폴더 내의 기본 이미지
        document.querySelector('.profile-icon').style.backgroundImage = `url(${userProfileImage})`; // 프로필 아이콘에 기본 이미지 설정
    }

    // 회원가입 완료 후 로그인 페이지로 이동
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
                <div class="post-stats-left">
                    <p>좋아요 0</p>
                    <p>댓글 0</p>
                    <p>조회수 0</p>
                </div>
                <p>2025-02-22 00:00:00</p>
            </div>
            <p>더미 작성자 1</p>
        </div>
    `;
    postContainer.appendChild(post);
    
    showPage('post-list-page');
}

// 게시글 목록에 더미 데이터 추가
const posts = [
    {
        postId: 1,
        title: "게시글 제목 1",
        author: "작성자 1",
        createdAt: "2021-01-01 00:00:00",
        likeCount: 123,
        commentCount: 12,
        viewCount: 123,
        content: "게시글 내용 1"
    },
    {
        postId: 2,
        title: "게시글 제목 2",
        author: "작성자 2",
        createdAt: "2021-02-01 00:00:00",
        likeCount: 98,
        commentCount: 8,
        viewCount: 200,
        content: "게시글 제목 2의 내용입니다요. 메롱 미니언 아주 귀엽지요? 글씨가 어디까지 끊기나, 글씨 크기는 적당한가 시험 중이니 양해해주세요. 미니언은 참 기여워. 좋아요 댓글 부탁드려요~~",
        image: "./image/merong_minion.jpeg"  // 이미지 경로
    }
];

function loadPosts() {
    const postContainer = document.getElementById("posts");
    posts.forEach(post => {
        let postElement = document.createElement("div");
        postElement.classList.add("post");

        postElement.innerHTML = `
            <div class="post-brief-view">
                <h1 onclick="viewPost(${post.postId})">${post.title}</h1>
                <div class="post-brief-view-middle">
                    <div class="post-stats-left">
                        <p>좋아요 ${post.likeCount}</p>
                        <p>댓글 ${post.commentCount}</p>
                        <p>조회수 ${post.viewCount}</p>
                    </div>
                    <p>${post.createdAt}</p>
                </div>
                <p>${post.author}</p>
            </div>
        `;
        postContainer.appendChild(postElement);
    });
}

function viewPost(postId) {
    const post = posts.find(p => p.postId === postId);
    if (post) {
        showPage('post-detail-page');
        displayPostDetails(post);
    } else {
        alert('게시글을 찾을 수 없습니다.');
    }
}

function displayPostDetails(post) {
    document.getElementById('post-title').innerText = post.title;
    document.getElementById('post-author').innerText = post.author;
    document.getElementById('post-date').innerText = post.createdAt;

    if (post.image) {
        document.getElementById('post-image').innerHTML = `<img src="${post.image}" alt="게시글 이미지">`;
    }
    document.getElementById('post-content').innerText = post.content;

    // 통계 정보 표시
    document.getElementById('post-like-count').innerText = post.likeCount;
    document.getElementById('post-view-count').innerText = post.viewCount;
    document.getElementById('post-comment-count').innerText = post.commentCount;

    // 댓글 섹션 초기화
    const commentSection = document.getElementById('post-comments-section');
    const commentsList = document.getElementById('comments');
    commentsList.innerHTML = '';
    
    // 댓글 더미 데이터 추가
    const comments = [
        { author: "댓글 작성자 1", createdAt: "2021-01-01 00:00:00", content: "댓글 내용 1" },
        { author: "댓글 작성자 2", createdAt: "2021-01-02 00:00:00", content: "댓글 내용 2" }
    ];

    comments.forEach(comment => {
        let commentElement = document.createElement("div");
        commentElement.classList.add("comment");
        commentElement.innerHTML = `
            <div class="comment-header">
                <div class="comment-meta">
                    <p class="comment-author">${comment.author}</p>
                    <p class="comment-date">${comment.createdAt}</p>
                </div>
                <div class="comment-actions">
                    <button onclick="editComment(this)" class="post-detail-button">수정</button>
                    <button onclick="deleteComment(this)" class="post-detail-button">삭제</button>
                </div>
            </div>
            <p class="comment-content">${comment.content}</p>
        `;
        commentsList.appendChild(commentElement);
    });
}

function addComment() {
    const commentContent = document.querySelector('#new-comment-content').value;
    if (commentContent.trim() === "") {
        alert("댓글 내용을 입력해주세요.");
        return;
    }

    // 댓글을 추가
    let newComment = {
        author: "댓글 작성자1",
        created_at: new Date().toLocaleString(),
        content: commentContent
    };

    // 댓글을 게시글에 추가
    let commentsList = document.getElementById('comments');
    let commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    
    commentElement.innerHTML = `
        <div class="comment-header">
            <div class="comment-meta">
                <p class="comment-author">${newComment.author}</p>
                <p class="comment-date">${newComment.created_at}</p>
            </div>
            <div class="comment-actions">
                <button onclick="editComment(this)" class="post-detail-button">수정</button>
                <button onclick="deleteComment(this)" class="post-detail-button">삭제</button>
            </div>
        </div>
        <p class="comment-content">${newComment.content}</p>
    `;
    commentsList.appendChild(commentElement);

    // 댓글 내용 초기화
    document.querySelector('#new-comment-content').value = '';
}

function editComment(button) {
    const commentElement = button.closest('.comment');
    const contentElement = commentElement.querySelector('.comment-content');
    const currentContent = contentElement.textContent;
    
    // 수정 모드로 전환
    contentElement.innerHTML = `
        <textarea class="comment-edit-textarea">${currentContent}</textarea>
        <div class="comment-edit-actions">
            <button onclick="saveComment(this)" class="post-detail-button">저장</button>
            <button onclick="cancelEdit(this)" class="post-detail-button">취소</button>
        </div>
    `;
}

function saveComment(button) {
    const commentElement = button.closest('.comment');
    const textarea = commentElement.querySelector('.comment-edit-textarea');
    const newContent = textarea.value;
    
    // 수정된 내용 저장
    commentElement.querySelector('.comment-content').textContent = newContent;
}

function cancelEdit(button) {
    const commentElement = button.closest('.comment');
    const contentElement = commentElement.querySelector('.comment-content');
    const originalContent = contentElement.querySelector('.comment-edit-textarea').value;
    
    // 원래 내용으로 복원
    contentElement.textContent = originalContent;
}

function deleteComment(button) {
    if (confirm('댓글을 삭제하시겠습니까?')) {
        button.closest('.comment').remove();
    }
}

function showDeleteModal() {
    document.getElementById('delete-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('delete-modal').style.display = 'none';
    document.getElementById('comment-delete-modal').style.display = 'none';
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

document.addEventListener('DOMContentLoaded', loadPosts);

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.profile-icon').addEventListener('click', toggleProfileMenu);
    document.getElementById('logout').addEventListener('click', logout);
    document.getElementById('profile-edit').addEventListener('click', function() { showPage('profile-page'); });
    document.getElementById('password-edit').addEventListener('click', function() { showPage('password-page'); });

});

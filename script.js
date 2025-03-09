// script.js

let currentPage = 'login-page';
let posts = []; // 전역 변수로 게시글 데이터 저장

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
    const file = event.target.files[0];
    const reader = new FileReader();
    const profileUploadDiv = document.querySelector('.profile-upload');

    reader.onload = function () {
        // 프로필 이미지 미리보기
        const uploadedImageUrl = reader.result;
        // 프로필 업로드 div에 이미지를 배경으로 설정
        profileUploadDiv.style.backgroundImage = `url(${uploadedImageUrl})`;
        profileUploadDiv.classList.add('with-uploaded-image');
        // 기본 이미지 클래스를 제거
        profileUploadDiv.classList.remove('with-default-image');
    };

    // 파일 읽기
    if (file) {
        reader.readAsDataURL(file);
    }
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

// loadPosts 함수 수정
async function loadPosts() {
    const postContainer = document.getElementById("posts");
    postContainer.innerHTML = ''; // 기존 게시글 초기화
    
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = '게시글을 불러오는 중...';
    loadingMessage.style.textAlign = 'center';
    postContainer.appendChild(loadingMessage);

    try {
        if (posts.length === 0) { // 처음 로드할 때만 API에서 데이터 가져오기
            posts = await fetchPosts();
        }
        postContainer.innerHTML = ''; // 로딩 메시지 제거
        
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
                    <p class="post-author">${post.author}</p>
                </div>
            `;
            postContainer.appendChild(postElement);
        });
    } catch (error) {
        postContainer.innerHTML = '<p style="text-align: center; color: red;">게시글을 불러오는데 실패했습니다.</p>';
    }
}

// addPost 함수 수정
async function addPost() {
    let postTitle = document.querySelector('#post-add-page input').value;
    let postContent = document.querySelector('#post-add-page textarea').value;
    let postImage = document.querySelector('#post-add-page input[type="file"]').files[0];
    
    if (!postTitle || !postContent) {
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }

    // 새 게시글 객체 생성
    const newPost = {
        postId: posts.length > 0 ? Math.max(...posts.map(p => p.postId)) + 1 : 1,
        title: postTitle,
        content: postContent,
        author: '작성자 1',
        createdAt: new Date().toLocaleString(),
        likeCount: 0,
        commentCount: 0,
        viewCount: 0,
        image: null
    };

    // 이미지가 있는 경우 처리
    if (postImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newPost.image = e.target.result;
        };
        reader.readAsDataURL(postImage);
    }

    // 게시글 배열에 추가
    posts.unshift(newPost);
    
    // 게시글 목록 페이지로 이동
    showPage('post-list-page');
    loadPosts(); // 게시글 목록 새로고침
}

// 게시글 데이터를 불러오는 함수
async function fetchPosts() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const posts = await response.json();
        return posts.slice(0, 10).map(post => ({
            postId: post.id,
            title: post.title,
            author: `작성자 ${post.userId}`,
            createdAt: new Date().toLocaleString(),
            likeCount: Math.floor(Math.random() * 100),
            commentCount: Math.floor(Math.random() * 20),
            viewCount: Math.floor(Math.random() * 200),
            content: post.body,
            image: post.id % 2 === 0 ? "./image/merong_minion.jpeg" : null
        }));
    } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
        return [];
    }
}

// 댓글 데이터를 불러오는 함수
async function fetchComments(postId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        const comments = await response.json();
        return comments.map(comment => ({
            author: comment.email.split('@')[0],
            createdAt: new Date().toLocaleString(),
            content: comment.body
        }));
    } catch (error) {
        console.error('댓글을 불러오는데 실패했습니다:', error);
        return [];
    }
}

// viewPost 함수 수정
async function viewPost(postId) {
    try {
        const post = posts.find(p => p.postId === postId);
        if (post) {
            showPage('post-detail-page');
            displayPostDetails(post);
            
            // 댓글 불러오기
            const comments = await fetchComments(postId);
            const commentsList = document.getElementById('comments');
            commentsList.innerHTML = '';
            
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
        } else {
            alert('게시글을 찾을 수 없습니다.');
        }
    } catch (error) {
        alert('게시글을 불러오는데 실패했습니다.');
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
    document.getElementById('delete-modal').style.display = 'none';
    document.getElementById('delete-account-modal').style.display = 'none';
}

function deletePost() {
    alert('게시글이 삭제되었습니다.');
    showPage('post-list-page');
    closeModal();
}

function updatePost() {
    let newTitle = document.getElementById('edit-title').value;
    let newContent = document.getElementById('edit-content').value;
    let newImage = document.querySelector('#post-edit-page input[type="file"]').files[0];
    
    // 제목과 내용 업데이트
    document.getElementById('post-title').innerText = newTitle;
    document.getElementById('post-content').innerText = newContent;
    
    // 새 이미지가 선택된 경우 이미지 업데이트
    if (newImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('post-image').innerHTML = `<img src="${e.target.result}" alt="게시글 이미지">`;
        };
        reader.readAsDataURL(newImage);
    }
    
    showPage('post-detail-page');
}

// 사용자 정보 상태 관리
let isEditMode = false;
const userInfo = {
    email: 'startupcoding@gmail.com',
    nickname: '스타트업코딩',
    profileImage: './image/merong_minion.jpeg'
};

function handleMenuItemClick(pageId) {
    showPage(pageId);
    profileMenu.classList.remove('show');
    if (pageId === 'profile-page') {
        loadUserInfo(); // 프로필 페이지 진입 시 사용자 정보 로드
    }
}

function loadUserInfo() {
    // 수정 모드 초기화
    isEditMode = false;
    const profileSection = document.querySelector('.profile-edit-section');
    profileSection.classList.remove('edit-mode');
    
    // 프로필 이미지 설정
    document.querySelector('.profile-edit-image').style.backgroundImage = `url(${userInfo.profileImage})`;
    // 이메일 설정
    document.getElementById('profile-email-value').textContent = userInfo.email;
    // 닉네임 설정
    document.getElementById('profile-nickname-value').textContent = userInfo.nickname;
    // 이미지 변경 버튼 숨김
    const imageChangeButton = document.querySelector('.profile-image-change');
    if (imageChangeButton) {
        imageChangeButton.style.display = 'none';
    }
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    const profileSection = document.querySelector('.profile-edit-section');
    const nicknameField = document.getElementById('profile-nickname-value');
    const imageChangeButton = document.querySelector('.profile-image-change');

    if (isEditMode) {
        // 수정 모드 활성화
        profileSection.classList.add('edit-mode');
        // 닉네임을 input으로 변경
        const currentNickname = nicknameField.textContent;
        nicknameField.innerHTML = `<input type="text" value="${currentNickname}" class="info-value editable">`;
        // 이미지 변경 버튼 표시
        imageChangeButton.style.display = 'block';
    }
}

function updateProfile() {
    const nicknameInput = document.querySelector('#profile-nickname-value input');
    if (nicknameInput) {
        userInfo.nickname = nicknameInput.value;
    }
    
    // 프로필 아이콘 이미지도 업데이트
    document.querySelector('.profile-icon').style.backgroundImage = 
        document.querySelector('.profile-edit-image').style.backgroundImage;
    
    alert('회원정보가 수정되었습니다.');
    showPage('post-list-page'); // 게시글 목록 페이지로 이동
}

function previewProfileEditImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            document.querySelector('.profile-edit-image').style.backgroundImage = `url(${imageUrl})`;
            userInfo.profileImage = imageUrl;
        };
        reader.readAsDataURL(file);
    }
}

const profileIcon = document.querySelector('.profile-icon');
const profileMenu = document.querySelector('.profile-menu');

// DOMContentLoaded 이벤트에 프로필 페이지 초기화 로직 추가
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    
    // 프로필 아이콘 클릭 이벤트
    document.querySelector('.profile-icon').addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle('show');
    });

    // 메뉴 항목 클릭 이벤트
    document.getElementById('profile-edit').addEventListener('click', () => handleMenuItemClick('profile-page'));
    document.getElementById('password-edit').addEventListener('click', () => handleMenuItemClick('password-page'));
    document.getElementById('logout').addEventListener('click', () => {
        logout();
        profileMenu.classList.remove('show');
    });

    // 메뉴 외부 클릭 시 메뉴 닫기
    document.addEventListener('click', (e) => {
        if (!profileIcon.contains(e.target) && !profileMenu.contains(e.target)) {
            profileMenu.classList.remove('show');
        }
    });
});

function showDeleteAccountModal() {
    const modal = document.getElementById('delete-account-modal');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

function deleteAccount() {
    alert('회원 탈퇴가 완료되었습니다.');
    closeModal();
    logout();
}

// 게시글 상세 페이지에서 수정 버튼 클릭 시 호출되는 함수
function showEditPage() {
    const title = document.getElementById('post-title').innerText;
    const content = document.getElementById('post-content').innerText;
    const postImage = document.getElementById('post-image').innerHTML;
    
    // 수정 페이지로 이동하면서 기존 내용 설정
    showPage('post-edit-page');
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-content').value = content;
    
    // 이미지가 있는 경우 미리보기 표시
    if (postImage) {
        const imgSrc = postImage.match(/src="([^"]+)"/)?.[1];
        if (imgSrc) {
            const previewContainer = document.createElement('div');
            previewContainer.id = 'edit-image-preview';
            previewContainer.innerHTML = `<img src="${imgSrc}" alt="게시글 이미지">`;
            const imageInput = document.querySelector('#post-edit-page input[type="file"]');
            imageInput.parentNode.insertBefore(previewContainer, imageInput);
        }
    }
}


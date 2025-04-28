import { showPage } from '../main.js';
import { getPosts, getPostById, createPost, updatePost, deletePost, addHeart, removeHeart, checkIsHearted } from '../api/postApi.js';
import { API_BASE_URL } from '../api/config.js';
import { loadComments } from './comment.js';

let currentPost = null;

// 게시글 목록 로드
export async function loadPosts() {
    try {
        const posts = await getPosts();
        displayPosts(posts);
    } catch (error) {
        console.error('게시글 목록 로드 에러:', error);
        alert(error.message);
    }
}

// 게시글 목록 표시
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.onclick = () => viewPost(post.id);

        // 이미지 URL 처리
        let imageUrl = post.image;
        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `${API_BASE_URL}/${imageUrl}`;
        }

        // 작성자 정보
        const authorName = post.user?.nickname || '알 수 없음';

        // 작성자 프로필 이미지
        let authorProfileImage = post.user?.profileImage;
        if (!authorProfileImage) {
            authorProfileImage = 'https://blog.kakaocdn.net/dn/bCXLP7/btrQuNirLbt/N30EKpk07InXpbReKWzde1/img.png';
        } else if (!authorProfileImage.startsWith('http')) {
            authorProfileImage = `${API_BASE_URL}/${authorProfileImage}`;
        }

        // 작성 시간 한국 시간 변환
        const formattedDate = new Date(post.createdAt).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        postElement.innerHTML = `
            <div class="post-brief-view">
                <h1>${post.title}</h1>
                <div class="post-brief-view-middle">
                    <div class="post-stats-left">
                        <span>좋아요 ${post.heartCount}</span>
                        <span>댓글 ${post.commentCount}</span>
                        <span>조회수 ${post.viewCount}</span>
                    </div>
                    <p>${formattedDate}</p>
                </div>
                <div class="post-brief-divider"></div>
                <div class="post-author">
                    <img src="${authorProfileImage}" alt="프로필 이미지" class="author-profile-image">
                    <span>${authorName}</span>
                </div>
            </div>
        `;

        postsContainer.appendChild(postElement);
    });
}

// 게시글 상세 조회
async function viewPost(postId) {
    try {
        const post = await getPostById(postId);
        currentPost = post;
        displayPostDetails(post);
        await loadComments(postId);
        showPage('post-detail-page');
    } catch (error) {
        console.error('게시글 상세 조회 에러:', error);
        alert(error.message);
    }
}

// 게시글 상세 정보 표시
async function displayPostDetails(post) {
    // 게시글 제목
    const postTitle = document.getElementById('post-title');
    if (postTitle) postTitle.innerText = post.title || '제목 없음';

    // 작성자 닉네임
    const postAuthor = document.getElementById('post-author');
    if (postAuthor) postAuthor.innerText = post.user?.nickname || '알 수 없음';

    // 작성자 프로필 이미지
    const postAuthorProfileImage = document.getElementById('post-author-image');
    if (postAuthorProfileImage) {
        let profileImageUrl = post.user?.profileImage;
        if (!profileImageUrl) {
            profileImageUrl = 'https://blog.kakaocdn.net/dn/bCXLP7/btrQuNirLbt/N30EKpk07InXpbReKWzde1/img.png';
        } else if (!profileImageUrl.startsWith('http')) {
            profileImageUrl = `${API_BASE_URL}/${profileImageUrl}`;
        }
        postAuthorProfileImage.src = profileImageUrl;
        postAuthorProfileImage.alt = '작성자 프로필 이미지';
    }

    // 작성일
    document.getElementById('post-date').innerText = new Date(post.createdAt).toLocaleString();
    
    // 게시글 이미지 
    const postImage = document.getElementById('post-image');
    if (postImage) {
        if (post.image) {
            const imageUrl = post.image.startsWith('http') ? post.image : `${API_BASE_URL}/${post.image}`;
            postImage.innerHTML = `<img src="${imageUrl}" alt="게시글 이미지">`;
            postImage.style.display = 'block';
        } else {
            postImage.style.display = 'none';
        }
    }
    
    // 게시글 내용
    const postContent = document.getElementById('post-content');
    if (postContent) postContent.innerText = post.content || '내용 없음';

    // 좋아요 수, 댓글 수, 조회 수
    const likeCount = document.getElementById('like-count');
    if (likeCount) {
        likeCount.innerText = post.heartCount || 0;
        
        // 기존 이벤트 리스너 제거
        const newLikeCount = likeCount.cloneNode(true);
        likeCount.parentNode.replaceChild(newLikeCount, likeCount);
        
        // 좋아요 상태 확인
        try {
            const isHearted = await checkIsHearted(post.id);
            const statBox = newLikeCount.closest('.stat-box');
            if (isHearted) {
                statBox.classList.add('hearted');
            } else {
                statBox.classList.remove('hearted');
            }
        } catch (error) {
            console.error('좋아요 상태 확인 에러:', error);
        }

        // stat-box 전체에 이벤트 리스너 추가
        const statBox = newLikeCount.closest('.stat-box');
        statBox.addEventListener('click', async (e) => {
            e.stopPropagation();
            const isHearted = statBox.classList.contains('hearted');
            
            try {
                if (!localStorage.getItem('userId')) {
                    alert('로그인이 필요한 기능입니다.');
                    return;
                }

                if (isHearted) {
                    await removeHeart(post.id);
                    statBox.classList.remove('hearted');
                } else {
                    await addHeart(post.id);
                    statBox.classList.add('hearted');
                    
                    // 하트 애니메이션 효과 추가
                    const heartIcon = document.createElement('span');
                    heartIcon.className = 'heart-icon animate-heart';
                    heartIcon.innerHTML = '❤️';
                    statBox.appendChild(heartIcon);
                    
                    // 애니메이션 종료 후 하트 아이콘 제거
                    setTimeout(() => {
                        heartIcon.remove();
                    }, 1000);
                }

                // 좋아요 수 업데이트
                const updatedPost = await getPostById(post.id);
                newLikeCount.innerText = updatedPost.heartCount || 0;
                currentPost = updatedPost;
            } catch (error) {
                console.error('좋아요 처리 에러:', error);
                alert(error.message);
            }
        });
    }

    const commentCount = document.getElementById('comment-count');
    if (commentCount) commentCount.innerText = post.commentCount || 0;

    const viewCount = document.getElementById('view-count');
    if (viewCount) viewCount.innerText = post.viewCount || 0;

    // 작성자인 경우에만 수정/삭제 버튼 표시
    const userId = localStorage.getItem('userId');
    const postActions = document.querySelector('.post-actions');
    if (postActions) {
        if (post.user?.id?.toString() === userId) {
            postActions.style.display = 'flex';
        } else {
            postActions.style.display = 'none';
        }
    }
}

// 게시글 작성
export async function addPost(event) {
    event.preventDefault();

    const title = document.getElementById('post-add-title').value;
    const content = document.getElementById('post-add-content').value;
    const imageFile = document.getElementById('post-add-image')?.files[0];

    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }

    try {
        await createPost(title, content, imageFile);
        alert('게시글이 작성되었습니다.');
        showPage('post-list-page');
    } catch (error) {
        console.error('게시글 작성 에러:', error);
        alert(error.message);
    }
}

// 게시글 수정 페이지로 이동
export function showEditPage() {
    if (!currentPost) return;

    document.getElementById('post-edit-title').value = currentPost.title;
    document.getElementById('post-edit-content').value = currentPost.content;

    // 기존 이미지 처리
    const imagePreview = document.getElementById('post-edit-image-preview');
    const existingImageInput = document.getElementById('post-edit-existing-image');

    if (currentPost.image) {
        const imageUrl = currentPost.image.startsWith('http') 
            ? currentPost.image 
            : `${API_BASE_URL}/${currentPost.image}`;
        
        imagePreview.src = imageUrl;
        imagePreview.style.display = 'block';
        existingImageInput.value = currentPost.image; 
    } else {
        imagePreview.style.display = 'none';
        existingImageInput.value = '';
    }

    showPage('post-edit-page');
}

// 게시글 수정
export async function updateCurrentPost(event) {
    event.preventDefault();
    
    if (!currentPost) return;

    const title = document.getElementById('post-edit-title').value;
    const content = document.getElementById('post-edit-content').value;
    const imageFile = document.getElementById('post-edit-image')?.files[0];

    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }

    try {
        const updatedPost = await updatePost(currentPost.id, title, content, imageFile);
        currentPost = updatedPost;
        alert('게시글이 수정되었습니다.');
        viewPost(currentPost.id);
    } catch (error) {
        console.error('게시글 수정 에러:', error);
        alert(error.message);
    }
}

// 게시글 삭제
export async function deleteCurrentPost() {
    if (!currentPost) return;

    try {
        await deletePost(currentPost.id);
        alert('게시글이 삭제되었습니다.');
        document.body.classList.remove('modal-open');
        document.getElementById('delete-post-modal').style.display = 'none';
        showPage('post-list-page');
    } catch (error) {
        console.error('게시글 삭제 에러:', error);
        alert(error.message);
    }
}

// 이미지 미리보기 (게시글 수정)
export function previewEditImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const imagePreview = document.getElementById('post-edit-image-preview');

    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// 이미지 미리보기 (게시글 작성)
export function previewAddImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const imagePreview = document.getElementById('post-add-image-preview');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
} 
import { getComments, createComment, updateComment, deleteComment } from '../api/commentApi.js';
import { API_BASE_URL } from '../api/config.js';

let currentPostId = null;
let currentCommentId = null;

// 댓글 목록 로드
export async function loadComments(postId) {
    try {
        currentPostId = postId;
        const comments = await getComments(postId);
        displayComments(comments);
    } catch (error) {
        console.error('댓글 목록 로드 에러:', error);
        alert(error.message);
    }
}

// 댓글 목록 표시
function displayComments(comments) {
    const commentsList = document.getElementById('comments');
    commentsList.innerHTML = '';

    const currentUserId = localStorage.getItem('userId');

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.dataset.commentId = comment.id;

        // 작성자 프로필 이미지
        let authorProfileImage = comment.user?.profileImage;
        if (!authorProfileImage) {
            authorProfileImage = 'https://blog.kakaocdn.net/dn/bCXLP7/btrQuNirLbt/N30EKpk07InXpbReKWzde1/img.png';
        } else if (!authorProfileImage.startsWith('http')) {
            authorProfileImage = `${API_BASE_URL}/${authorProfileImage}`;
        }

        // 작성 시간 한국 시간 변환
        const formattedDate = new Date(comment.createdAt).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // 댓글 작성자인 경우에만 수정/삭제 버튼 표시
        const commentActions = comment.user?.id?.toString() === currentUserId
            ? `<div class="comment-actions">
                <button onclick="editComment(this)" class="post-detail-button">수정</button>
                <button onclick="showDeleteCommentModal(this)" class="post-detail-button">삭제</button>
               </div>`
            : '';

        commentElement.innerHTML = `
            <div class="comment-header">
                <div class="comment-meta">
                    <div class="comment-author">
                        <img src="${authorProfileImage}" alt="프로필 이미지" class="author-profile-image">
                        <span>${comment.user?.nickname || '알 수 없음'}</span>
                    </div>
                    <p class="comment-date">${formattedDate}</p>
                </div>
                ${commentActions}
            </div>
            <p class="comment-content">${comment.content}</p>
        `;

        commentsList.appendChild(commentElement);
    });
}

// 댓글 작성
export async function addComment() {
    const commentInput = document.querySelector('.comment-input-area textarea');
    const commentContent = commentInput.value.trim();
    
    if (!commentContent) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }
    
    try {
        await createComment(currentPostId, commentContent);
        commentInput.value = '';
        await loadComments(currentPostId);
    } catch (error) {
        console.error('댓글 작성 에러:', error);
        alert(error.message);
    }
}

// 댓글 수정 모드 진입
export function editComment(button) {
    const commentDiv = button.closest('.comment');
    const commentContent = commentDiv.querySelector('.comment-content');
    const originalContent = commentContent.textContent;
    currentCommentId = commentDiv.dataset.commentId;
    
    const textarea = document.createElement('textarea');
    textarea.classList.add('comment-edit-textarea');
    textarea.value = originalContent;
    
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('comment-edit-actions');
    actionsDiv.innerHTML = `
        <button onclick="saveComment(this)" class="post-detail-button">저장</button>
        <button onclick="cancelEdit(this)" class="post-detail-button">취소</button>
    `;
    
    commentContent.replaceWith(textarea);
    textarea.after(actionsDiv);
    button.closest('.comment-actions').style.display = 'none';
}

// 댓글 수정 저장
export async function saveComment(button) {
    const commentDiv = button.closest('.comment');
    const textarea = commentDiv.querySelector('.comment-edit-textarea');
    
    const newContent = textarea.value.trim();
    if (!newContent) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }
    
    try {
        await updateComment(currentCommentId, newContent);
        await loadComments(currentPostId);
    } catch (error) {
        console.error('댓글 수정 에러:', error);
        alert(error.message);
    }
}

// 댓글 수정 취소
export function cancelEdit(button) {
    const commentDiv = button.closest('.comment');
    
    loadComments(currentPostId);
}

// 댓글 삭제 모달 표시
export function showDeleteCommentModal(button) {
    currentCommentId = button.closest('.comment').dataset.commentId;
    const modal = document.getElementById('delete-comment-modal');
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
}

// 댓글 삭제
export async function deleteCurrentComment() {
    try {
        await deleteComment(currentPostId, currentCommentId);
        document.body.classList.remove('modal-open');
        document.getElementById('delete-comment-modal').style.display = 'none';
        await loadComments(currentPostId);
    } catch (error) {
        console.error('댓글 삭제 에러:', error);
        alert(error.message);
    }
} 
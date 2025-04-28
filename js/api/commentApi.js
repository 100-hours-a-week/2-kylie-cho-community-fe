import { API_BASE_URL } from './config.js';
import { getHeaders } from './config.js';

// 댓글 목록 조회
export async function getComments(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/comments/post/${postId}`, {
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error('댓글 목록을 불러오는데 실패했습니다.');
        }

        return await response.json();
    } catch (error) {
        console.error('댓글 목록 조회 에러:', error);
        throw error;
    }
}

// 댓글 작성
export async function createComment(postId, content) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/comments`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                ...getHeaders()
            },
            body: JSON.stringify({
                postId,
                content,
                userId: localStorage.getItem('userId')
            })
        });

        if (!response.ok) {
            throw new Error('댓글 작성에 실패했습니다.');
        }

        return await response.json();
    } catch (error) {
        console.error('댓글 작성 에러:', error);
        throw error;
    }
}

// 댓글 수정
export async function updateComment(commentId, content) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                content,
                userId: localStorage.getItem('userId')
            })
        });

        if (!response.ok) {
            throw new Error('댓글 수정에 실패했습니다.');
        }

        return await response.json();
    } catch (error) {
        console.error('댓글 수정 에러:', error);
        throw error;
    }
}

// 댓글 삭제
export async function deleteComment(postId, commentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}?userId=${localStorage.getItem('userId')}&postId=${postId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error('댓글 삭제에 실패했습니다.');
        }
    } catch (error) {
        console.error('댓글 삭제 에러:', error);
        throw error;
    }
} 
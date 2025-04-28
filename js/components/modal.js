export function showDeleteModal() {
    const modal = document.querySelector('.modal');
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
}

export function closeModal() {
    document.getElementById('delete-post-modal').style.display = 'none';
    document.getElementById('delete-account-modal').style.display = 'none';
    document.getElementById('delete-comment-modal').style.display = 'none';
} 
// Get elements
const checkoutBtn = document.querySelector('.checkout-btn');
const confirmationModal = document.getElementById('confirmationModal');
const thankYouModal = document.getElementById('thankYouModal');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Show confirmation modal
checkoutBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'flex';
});

// Confirm button
confirmBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
    thankYouModal.style.display = 'flex';
});

// Cancel button
cancelBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
});
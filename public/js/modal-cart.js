const checkoutBtn = document.querySelector('.checkout-btn');
const confirmationModal = document.getElementById('confirmationModal');
const thankYouModal = document.getElementById('thankYouModal');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');

checkoutBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'flex';
});

confirmBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
    thankYouModal.style.display = 'flex';
});

cancelBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
});
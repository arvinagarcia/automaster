const profileIcon = document.getElementById('profile-icon');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const backIcon = document.querySelector('.back-icon')

profileIcon.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
});

backIcon.addEventListener('click', () => {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');  
})
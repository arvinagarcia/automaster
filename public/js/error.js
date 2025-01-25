const messageDiv = document.querySelector('.top-right-messages');

messageDiv.classList.add('visible');

setTimeout(() => {
  messageDiv.classList.remove('visible');
  messageDiv.classList.add('hidden');
}, 3000);
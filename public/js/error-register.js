const messageDivs = document.querySelectorAll('.top-right-message');

messageDivs.forEach((messageDiv) => {
  messageDiv.classList.add('visible');

  setTimeout(() => {
    messageDiv.classList.remove('visible');
    messageDiv.classList.add('hidden');
  }, 3000);
});
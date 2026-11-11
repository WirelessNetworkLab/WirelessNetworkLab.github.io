document.addEventListener('DOMContentLoaded', () => {
  // Headerの読み込み
  const headerContainer = document.getElementById('header-placeholder');
  if (headerContainer) {
    fetch('components/header.html')
      .then(response => response.text())
      .then(data => {
        headerContainer.innerHTML = data;
        setActiveNavLink(); // 読み込み完了後に現在のページへのリンクを強調
      })
      .catch(err => console.error('Header loading error:', err));
  }

  // Footerの読み込み
  const footerContainer = document.getElementById('footer-placeholder');
  if (footerContainer) {
    fetch('components/footer.html')
      .then(response => response.text())
      .then(data => {
        footerContainer.innerHTML = data;
      })
      .catch(err => console.error('Footer loading error:', err));
  }
});

// 開いているページに応じてナビゲーションの active クラスを付与
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.main-nav a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
}